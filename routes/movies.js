const router = require('express').Router();
const {
  getAllMovies, createMovie, deleteMovie,
} = require('../controllers/movies');
const validation = require('../middlewares/validation');

router.get('/', getAllMovies);

router.post('/', validation.createMovie, createMovie);

router.delete('/:id', validation.deleteMovie, deleteMovie);

module.exports = router;
