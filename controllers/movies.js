const Movie = require('../models/movie');
const {
  Status, Msg, NotFoundError, ForbiddenError, ConflictError,
} = require('../errors');

module.exports = {

  getAllMovies: (req, res, next) => {
    Movie.find({})
      .populate('owner', 'name')
      .sort('-year country director nameRU')
      .then((result) => {
        res.status(Status.OK).send(result);
      })
      .catch(next);
  },

  createMovie: (req, res, next) => {
    req.body.owner = req.user._id;
    Movie.create(req.body)
      .then((createdCard) => {
        res.status(Status.CREATED).send(createdCard);
      })
      .catch((err) => {
        if (err.code === 11000) {
          next(new ConflictError(Msg.MOVIE_EXISTS));
        } else {
          next(err);
        }
      });
  },

  deleteMovie: (req, res, next) => {
    const { id } = req.params;
    Movie.findById(id)
      .then((foundMovie) => {
        if (!foundMovie) throw new NotFoundError(Msg.MOVIE_NOT_FOUND);
        if (foundMovie.get('owner', String) !== req.user._id) {
          throw new ForbiddenError(Msg.NOT_ENOUGH_RIGHTS);
        }
        Movie.findByIdAndRemove(id)
          .then((oldMovie) => {
            res.status(Status.OK).send(oldMovie);
          })
          .catch(next);
      })
      .catch(next);
  },
};
