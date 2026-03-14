'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.User, {
        foreignKey: 'senderId',
        as: 'sender',
      });
      Message.belongsTo(models.User, {
        foreignKey: 'receiverId',
        as: 'receiver',
      });
    }
  }

  Message.init(
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      senderId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      receiverId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      readAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Message',
      tableName: 'messages',
      timestamps: true,
    }
  );

  return Message;
};

