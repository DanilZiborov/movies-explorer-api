require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
// const { celebrate, errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { login } = require('./controllers/users');
const { createUser } = require('./controllers/users');

const { NotFoundError } = require('./utils/errors/errors');

// const { userSignInValidator, userSignUpValidator } = require('./utils/validators');

const { DB_ADRESS = 'mongodb://127.0.0.1/bitfilmsdb' } = process.env;
const { PORT = 3000 } = process.env;

mongoose.connect(DB_ADRESS);

const app = express();

app.use(cors());
app.use(express.json());

app.use(requestLogger);

app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.post('/signin', login);
app.post('/signup', createUser);

app.use((req, res, next) => {
  const err = new NotFoundError('Ресурс не найден');
  next(err);
});

app.use(errorLogger);

// тут линтер ругается, но, как я понял, четыре аргумента обязательны для обработчика ошибки
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
