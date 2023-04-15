const mongoose = require('mongoose');
const validator = require('validator');
const { Msg } = require('../errors');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: validator.isURL,
      message: Msg.WRONG_URL_FORMAT,
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: validator.isURL,
      message: Msg.WRONG_URL_FORMAT,
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: validator.isURL,
      message: Msg.WRONG_URL_FORMAT,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
}, {
  statics: {
    boundYear(value, helpers) {
      const filmYear = parseInt(value, 10);
      const thisYear = (new Date()).getFullYear();
      if (filmYear > 1895 && filmYear <= thisYear) return value;
      return helpers.error('any.invalid');
    },
    validUriKind: { scheme: [/(?:ht|f)tps?/] },
  },
});

module.exports = mongoose.model('movie', movieSchema);
