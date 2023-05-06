const Movie = require('../models/movie');
const {
  Status, Msg, NotFoundError, ForbiddenError, ConflictError,
} = require('../errors');

module.exports = {

  getAllMovies: (req, res, next) => {
    Movie.find({ owner: req.user._id })
      .select('-owner')
      .sort('-year country director nameRU')
      .then((result) => {
        res.status(Status.OK).send(result);
      })
      .catch(next);
  },

  createMovie: (req, res, next) => {
    Movie.find({ owner: req.user._id, movieId: req.body.movieId }).lean()
      .then((result) => {
        if (result && result.length) throw new ConflictError(Msg.MOVIE_EXISTS);
        req.body.owner = req.user._id;
        return Movie.create(req.body);
      })
      .then((createdMovie) => {
        res.status(Status.CREATED).send(createdMovie);
      })
      .catch(next);
  },

  deleteMovie: (req, res, next) => {
    const { id } = req.params;
    Movie.findById(id)
      .then((foundMovie) => {
        if (!foundMovie) throw new NotFoundError(Msg.MOVIE_NOT_FOUND);
        if (foundMovie.get('owner', String) !== req.user._id) {
          throw new ForbiddenError(Msg.NOT_ENOUGH_RIGHTS);
        }
        return Movie.findByIdAndRemove(id).lean();
      })
      .then((oldMovie) => {
        res.status(Status.OK).send(oldMovie);
      })
      .catch(next);
  },
};
