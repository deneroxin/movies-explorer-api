const { BadRequestError } = require('./BadRequestError');
const { ConflictError } = require('./ConflictError');
const { ForbiddenError } = require('./ForbiddenError');
const { NotFoundError } = require('./NotFoundError');
const { UnauthorizedError } = require('./UnauthorizedError');
const { InternalServerError } = require('./InternalServerError');

const Status = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
};

const Msg = {
  TEST_SERVER_RECOVER: 'Тестируем перезагрузку приложения на сервере',
  INTERNAL_ERROR: 'На сервере произошла ошибка',
  WRONG_CREDENTIALS: 'Вы ввели неправильный логин или пароль',
  WRONG_EMAIL_FORMAT: 'Адрес электронной почты имеет неверный формат',
  WRONG_URL_FORMAT: 'Адресная ссылка имеет неверный формат',
  UNAUTHORIZED: 'Необходима авторизация',
  WRONG_TOKEN_FORMAT: 'При авторизации произошла ошибка. Токен не передан или передан не в том формате',
  TOKEN_INCORRECT: 'При авторизации произошла ошибка. Переданный токен некорректен',
  PAGE_NOT_FOUND: 'Страница по указанному маршруту не найдена',
  USER_EXISTS: 'Пользователь с таким email уже существует',
  USER_NOT_FOUND: 'Пользователь с таким идентификатором не найден',
  YOU_ARENT_FOUND: 'Вас нет в базе данных',
  MOVIE_EXISTS: 'Такой фильм уже есть в коллекции',
  MOVIE_NOT_FOUND: 'Фильм не найден',
  NOT_ENOUGH_RIGHTS: 'У вас недостаточно прав для этого действия',
  SIGNOUT: 'Пользователь вышел из системы',
};

class GeneralError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

function generalErrorHandler(err, req, res, next) {
  const { statusCode = InternalServerError.code } = err;
  const message = (statusCode === InternalServerError.code)
    ? Msg.INTERNAL_ERROR : err.message;
  res.status(statusCode).send({ message });
  next();
}

module.exports = {
  Status,
  Msg,
  generalErrorHandler,
  GeneralError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
};
