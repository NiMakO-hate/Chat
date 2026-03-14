"use strict";

const { Model } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Message, {
        foreignKey: "senderId",
        as: "sentMessages",
      });
      User.hasMany(models.Message, {
        foreignKey: "receiverId",
        as: "receivedMessages",
      });
    }

    static validateEmail(email) {
      const emailPattern = /^[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z]{2,}$/;
      return emailPattern.test(email);
    }

    static validatePassword(password) {
      const passwordPattern = /^.{3,10}$/;
      return passwordPattern.test(password);
    }

    static validateUsername(username) {
      const usernamePattern = /^.{3,10}$/;
      return usernamePattern.test(username);
    }

    static validateSignInData({ email, password}) {
      if (
        !email || typeof email !== "string" || !email.trim().length === 0 || !this.validateEmail(email)) {
          return {
            isValid: false,
            error: 'Email не должен быть пустым и должен быть валидным'
          }
        }


        if (!password || typeof password !== "string" || !password.trim().length === 0 || !this.validatePassword(password)) {
          return {
            isValid: false,
            error: 'Пароль не должен быть пустым и должен быть длинной от 3 до 10 символов'
          }
        }

        
        return {
          isValid: true,
          error: null
        }
    }

    static validateSignUpData({ email, password, username}) {
      if (
        !email || typeof email !== "string" || !email.trim().length === 0 || !this.validateEmail(email)) {
          return {
            isValid: false,
            error: 'Email не должен быть пустым и должен быть валидным'
          }
        }

        if (
          !password || typeof password !== "string" || !password.trim().length === 0 || !this.validatePassword(password)) {
            return {
              isValid: false,
              error: 'Пароль не должен быть пустым и должен быть длинной от 3 до 10 символов'
            }
          }

        if (
          !username || typeof username !== "string" || !username.trim().length === 0 || !this.validateUsername(username)) {
            return {
              isValid: false,
              error: 'Имя пользователя не должно быть пустым и должно быть длинной от 3 до 10 символов'
            }
          }

        return {
          isValid: true,
          error: null
        }
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 10],
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
          len: [3, 10],
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
      hooks: {
        beforeCreate: async (newUser) => {
          const hashedPassword = await bcrypt.hash(newUser.password, 10);
          newUser.password = hashedPassword;
          newUser.email = newUser.email.toLowerCase();
          newUser.username = newUser.username.toLowerCase();
        },
        afterCreate: async (newUser) => {
          const rawUser = newUser.get();
          delete rawUser.password;
          return rawUser;
        }
      }
    }
  );

  return User;
};
