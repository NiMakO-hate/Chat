const MessageService = require('../services/Message.service');
const formatResponse = require('../utils/formatResponse');

class MessageController {
  static async createMessage(req, res) {
    try {
      const { content, receiverId } = req.body;
      const { user } = res.locals;

      const message = await MessageService.createMessage({
        content,
        senderId: user.id,
        receiverId,
      });

      return res
        .status(201)
        .json(formatResponse(201, 'Сообщение успешно создано', message));
    } catch ({ message }) {
      console.log(
        '===============MessageController.createMessage===============\n',
        message
      );
      res
        .status(500)
        .json(
          formatResponse(500, 'Внутреннаяя ошибка сервера', null, message)
        );
    }
  }

  static async getConversation(req, res) {
    try {
      const { user } = res.locals;
      const { otherUserId } = req.params;

      const conversation = await MessageService.getConversation({
        userId: user.id,
        otherUserId,
      });

      return res
        .status(200)
        .json(
          formatResponse(200, 'Успешно получены сообщения', conversation)
        );
    } catch ({ message }) {
      console.log(
        '===============MessageController.getConversation===============\n',
        message
      );
      res
        .status(500)
        .json(
          formatResponse(500, 'Внутреннаяя ошибка сервера', null, message)
        );
    }
  }

  static async markAsRead(req, res) {
    try {
      const { user } = res.locals;
      const { fromUserId } = req.params;

      const updatedCount = await MessageService.markAsRead({
        userId: user.id,
        fromUserId,
      });

      return res
        .status(200)
        .json(
          formatResponse(
            200,
            'Успешно отмечено как прочитано',
            updatedCount
          )
        );
    } catch ({ message }) {
      console.log(
        '===============MessageController.markAsRead===============\n',
        message
      );
      res
        .status(500)
        .json(
          formatResponse(500, 'Внутреннаяя ошибка сервера', null, message)
        );
    }
  }
}

module.exports = MessageController;