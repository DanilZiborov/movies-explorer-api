require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { celebrate, errors } = require('celebrate');
// const helmet = require('helmet');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { rateLimiter } = require('./middlewares/rateLimiter');

const { login } = require('./controllers/users');
const { createUser } = require('./controllers/users');

const { NotFoundError } = require('./utils/errors/errors');

const { userSignInValidator, userSignUpValidator } = require('./utils/validators');

const { DB_ADRESS = 'mongodb://127.0.0.1/bitfilmsdb' } = process.env;
const { PORT = 3000 } = process.env;

mongoose.connect(DB_ADRESS);

const app = express();

app.use(rateLimiter);
app.use(cors());

app.use(express.json());

app.use(requestLogger);

app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.post('/signin', celebrate(userSignInValidator), login);
app.post('/signup', celebrate(userSignUpValidator), createUser);

app.use((req, res, next) => {
  const err = new NotFoundError('Ресурс не найден');
  next(err);
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
