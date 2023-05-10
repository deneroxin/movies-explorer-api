const { PORT = 3001, NODE_ENV, DATABASE } = process.env;

module.exports = {
  port: PORT,

  databaseAddress: NODE_ENV === 'production'
    ? DATABASE
    : 'mongodb://0.0.0.0:27017/bitfilmsdb',

  allowedCors: [
    'https://diploma.deneroxin.nomoredomains.monster',
    'http://localhost:3000',
  ],

  allowedMethods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};
