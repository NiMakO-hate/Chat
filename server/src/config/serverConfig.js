const express = require('express');
const path = require('path');
const morgan = require('morgan');
const removeXPoweredBy = require('../middleware/removeHeader');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const corsOptions = {
  origin: [process.env.CLIENT_URL],
  credentials: true,
};

const serverConfig = (app) => {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(removeXPoweredBy);
  app.use(morgan('dev'));
  app.use('/files', express.static(path.resolve(__dirname, '..', 'public')));
  app.use(cors(corsOptions));
  app.use(cookieParser());
};

module.exports = serverConfig;