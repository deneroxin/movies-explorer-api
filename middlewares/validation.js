const { Joi, celebrate } = require('celebrate');

const validUriKind = { scheme: [/(?:ht|f)tps?/] };

module.exports = {

  signin: celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),

  signup: celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30).required(),
    }),
  }),

  createMovie: celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().positive().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().uri(validUriKind).required(),
      trailerLink: Joi.string().uri(validUriKind).required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
      thumbnail: Joi.string().uri(validUriKind).required(),
      movieId: Joi.number().required(),
    }),
  }),

  deleteMovie: celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24).required(),
    }),
  }),

  updateUserData: celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      name: Joi.string().min(2).max(30).required(),
    }),
  }),

  getUserById: celebrate({
    params: Joi.object().keys({
      userId: Joi.string().hex().length(24).required(),
    }),
  }),

};
