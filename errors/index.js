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
  WRONG_CREDENTIALS: 'Введён неверный адрес почты или пароль',
  WRONG_EMAIL_FORMAT: 'Адрес электронной почты имеет неверный формат',
  WRONG_URL_FORMAT: 'Адресная ссылка имеет неверный формат',
  UNAUTHORIZED: 'Необходима авторизация',
  PAGE_NOT_FOUND: 'Страница не найдена',
  USER_EXISTS: 'Пользователь с таким email уже зарегистрирован',
  USER_NOT_FOUND: 'Пользователь с таким идентификатором не найден',
  YOU_ARENT_FOUND: 'Вас нет в базе данных',
  MOVIE_EXISTS: 'Такой фильм уже есть в коллекции',
  MOVIE_NOT_FOUND: 'Фильм не найден',
  NOT_ENOUGH_RIGHTS: 'У вас недостаточно прав для этого действия',
};

class GeneralError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = {
  Status,
  Msg,
  GeneralError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
};
