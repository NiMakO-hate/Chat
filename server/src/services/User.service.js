const { User } = require('../db/models');
const { Op } = require('sequelize');

class UserService {
  static async getByEmail(email) {
    return (await User.findOne({ where: { email } }))?.get();
  }

  static async create(userData) {
    return await User.create(userData);
  }

  static async getAllExcept(currentUserId) {
    return await User.findAll({
      where: { id: { [Op.ne]: currentUserId } },
      attributes: { exclude: ['password'] },
    });
  }
}

module.exports = UserService;