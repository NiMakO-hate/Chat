const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });
const formatResponse = require('../utils/formatResponse');

function verifyAccessToken(req, res, next) {
  try {
    const accessToken = req.headers.authorization.split(' ')[1];
    const { user } = jwt.verify(accessToken, process.env.SECRET_ACCESS_TOKEN);
    res.locals.user = user;
    next();
  } catch ({ message }) {
    console.log('=============verifyAccessToken=============', message);
    res
      .status(403)
      .json(formatResponse(403, 'Invalid refreshToken', null, message));
  }
}

module.exports = verifyAccessToken;