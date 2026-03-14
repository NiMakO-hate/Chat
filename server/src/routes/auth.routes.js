const authRouter = require('express').Router();
const UserController = require('../controllers/User.controller');

authRouter
  .get('/refresh-token', UserController.refreshToken)
  .post('/sign-up', UserController.signUP)
  .post('/sign-in', UserController.signIn)
  .post('/sign-out', UserController.signOut);

module.exports = authRouter;