const userRouter = require('express').Router();
const UserController = require('../controllers/User.controller');
const verifyAccessToken = require('../middleware/verifyAccessToken');

userRouter.get('/', verifyAccessToken, UserController.getUsers);

module.exports = userRouter;

