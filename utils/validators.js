const { Joi } = require('celebrate');

const userSignInRules = {
  email: Joi.string().required().email(),
  password: Joi.string().required().min(8),
};

const userSignUpRules = {
  name: Joi.string().min(2).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(8),
};

const userDataRules = {
  name: Joi.string().min(2).max(30).required(),
  email: Joi.string().required().email(),
};

const movieRules = {
  country: Joi.string().required(),
  director: Joi.string().required(),
  duration: Joi.number().required(),
  year: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().regex(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/im).required(),
  trailerLink: Joi.string().regex(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/im).required(),
  thumbnail: Joi.string().regex(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/im).required(),
  movieId: Joi.number().required(),
  nameRU: Joi.string().required(),
  nameEN: Joi.string().required(),

};

const objectIdRule = Joi.string().hex().length(24).required();

module.exports.userSignInValidator = {
  body: Joi.object().keys(userSignInRules).unknown(true),
};

module.exports.userSignUpValidator = {
  body: Joi.object().keys(userSignUpRules).unknown(true),
};

module.exports.userDataValidator = {
  body: Joi.object().keys(userDataRules).unknown(true),
};

module.exports.movieValidator = {
  body: Joi.object().keys(movieRules).unknown(true),
};

module.exports.movieIdParamsValidator = {
  params: Joi.object().keys({
    movieId: objectIdRule,
  }),
};
