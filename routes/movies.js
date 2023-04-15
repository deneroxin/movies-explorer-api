const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const Movie = require('../models/movie');
const {
  getAllMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

router.get('/', getAllMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().positive().required(),
    year: Joi.string().pattern(/^[12]\d{3}$/).custom(Movie.boundYear).required(),
    description: Joi.string().required(),
    image: Joi.string().uri(Movie.validUriKind).required(),
    trailerLink: Joi.string().uri(Movie.validUriKind).required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().uri(Movie.validUriKind).required(),
    movieId: Joi.string().required(),
  }),
}), createMovie);

router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
}), deleteMovie);

module.exports = router;
