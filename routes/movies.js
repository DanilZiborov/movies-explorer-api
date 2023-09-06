const { celebrate } = require('celebrate');
const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getMovies, deleteMovie, createMovie,
} = require('../controllers/movies');
const { movieValidator, movieIdParamsValidator } = require('../utils/validators');

router.get('/', auth, getMovies);
router.delete('/:movieId', celebrate(movieIdParamsValidator), auth, deleteMovie);
router.post('/', auth, celebrate(movieValidator), createMovie);

module.exports = router;
