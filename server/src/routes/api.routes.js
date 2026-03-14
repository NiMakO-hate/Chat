const apiRouter = require('express').Router();
const authRouter = require('./auth.routes');
const userRouter = require('./user.routes');
const messageRouter = require('./message.routes');
const formatResponse = require('../utils/formatResponse');

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/messages', messageRouter);

apiRouter.use((req, res) => {
  res.status(404).json(formatResponse(404, 'Not Found', null, 'Not Found'));
});

module.exports = apiRouter;