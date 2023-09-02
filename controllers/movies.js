const { MongooseError } = require('mongoose');
const Movie = require('../models/movie');
const { STATUS_CODES } = require('../utils/STATUS_CODES');
const { NotFoundError, ForbiddenError, BadRequestError } = require('../utils/errors/errors');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: { $eq: req.user._id } })
    .then((movies) => {
      res.send({ data: movies });
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  console.log(req.params.movieId);
  Movie.findOne(({ _id: req.params.movieId }))
    .orFail(() => {
      throw new NotFoundError('Карточка фильма с таким id не найден');
    })
    .then((movie) => {
      if (movie.owner._id.valueOf() === req.user._id) {
        movie.deleteOne()
          .then(() => res.send({ message: 'Карточка успешно удалена' }))
          .catch(next);
      } else {
        throw new ForbiddenError('Отказано в доступе: удалять можно только свои карточки');
      }
    })
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description,
    image, trailerLink, thumbnail, movieId, nameRU, nameEN,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(STATUS_CODES.CREATED).send({ data: movie }))
    .catch((err) => {
      if (err instanceof MongooseError.ValidationError) {
        next(new BadRequestError(err.message));
      } else next(err);
    });
};
