const messageRouter = require('express').Router();
const MessageController = require('../controllers/Message.controller');
const verifyAccessToken = require('../middleware/verifyAccessToken');

messageRouter
  .get(
    '/conversation/:otherUserId',
    verifyAccessToken,
    MessageController.getConversation
  )
  .post(
    '/mark-as-read/:fromUserId',
    verifyAccessToken,
    MessageController.markAsRead
  )
  .post('/create-message', verifyAccessToken, MessageController.createMessage);

module.exports = messageRouter;