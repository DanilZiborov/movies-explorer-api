const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { MongooseError } = require('mongoose');
const User = require('../models/user');
const { STATUS_CODES } = require('../utils/STATUS_CODES');

const { NODE_ENV, JWT_SECRET } = process.env;
const {
  NotFoundError, ConflictError, BadRequestError,
} = require('../utils/errors/errors');

module.exports.getUserInfo = (req, res, next) => {
  User.findById({ _id: req.user._id })
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    })
      .then((user) => {
        const userObject = user.toObject();
        delete userObject.password;
        res.status(STATUS_CODES.CREATED).send({ data: userObject });
      })
      .catch((err) => {
        if (err instanceof MongooseError.ValidationError) {
          next(new BadRequestError(err.message));
        } else if (err.code === 11000) {
          next(new ConflictError('Этот email уже используется'));
        } else { next(err); }
      }));
};

module.exports.updateUserInfo = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof MongooseError.ValidationError) {
        next(new BadRequestError(err.message));
      } else if (err.code === 11000) {
        next(new ConflictError('Этот email уже использустеся'));
      } else { next(err); }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.status(STATUS_CODES.OK).send({ token });
    })
    .catch(next);
};
