// const { celebrate } = require('celebrate');
const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getMovies, deleteMovie, createMovie,
} = require('../controllers/movies');
// const { cardValidator, cardIdParamsValidator } = require('../utils/validators');

router.get('/', auth, getMovies);
router.delete('/:movieId', auth, deleteMovie);
router.post('/', auth, createMovie);

module.exports = router;
