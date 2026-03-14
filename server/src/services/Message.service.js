const { Message, User } = require('../db/models');
const isValidId = require('../utils/isValidId');

class MessageService {
  static async createMessage({ senderId, receiverId, content }) {
    if (!isValidId(senderId) || !isValidId(receiverId)) {
      throw new Error('неправильный отправитель или получатель');
    }

    if (senderId === receiverId) {
      throw new Error('отправитель и получатель не могут быть одним и тем же');
    }

    if (!content || !content.trim()) {
      throw new Error('содержимое сообщения не может быть пустым');
    }

    const sender = await User.findByPk(senderId);
    const receiver = await User.findByPk(receiverId);

    if (!sender || !receiver) {
      throw new Error('отправитель или получатель не найден');
    }

    return await Message.create({ senderId, receiverId, content: content.trim() });
  }

  static async getConversation({ userId, otherUserId, limit = 50, offset = 0 }) {
    if (!isValidId(userId) || !isValidId(otherUserId)) {
      throw new Error('неправильный id пользователя');
    }

    return await Message.findAll({
      where: {
        senderId: [userId, otherUserId],
        receiverId: [userId, otherUserId],
      },
      order: [['createdAt', 'ASC']],
      limit,
      offset,
    });
  }

  static async markAsRead({ userId, fromUserId }) {
    if (!isValidId(userId) || !isValidId(fromUserId)) {
      throw new Error('неправильный id пользователя');
    }

    const [updatedCount] = await Message.update(
      { isRead: true, readAt: new Date() },
      {
        where: {
          receiverId: userId,
          senderId: fromUserId,
          isRead: false,
        },
      }
    );

    return updatedCount;
  }
}

module.exports = MessageService;

