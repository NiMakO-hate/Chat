const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserService = require("../services/User.service");
const { User } = require("../db/models");
const formatResponse = require("../utils/formatResponse");
const generateJWTTokens = require("../utils/generateJWTTokens");
const cookieConfig = require("../config/cookieConfig");

class UserController {
  static async refreshToken(req, res) {
    try {
      const { refreshToken } = req.cookies;

      const { user } = jwt.verify(
        refreshToken,
        process.env.SECRET_REFRESH_TOKEN
      );

      const { accessToken, refreshToken: newRefreshToken } = generateJWTTokens({
        user,
      });

      return res
        .status(201)
        .cookie("refreshToken", newRefreshToken, cookieConfig)
        .json(
          formatResponse(201, "Успешно продлена пользовательская сессия", {
            user,
            accessToken,
          })
        );
    } catch ({ message }) {
      console.log(
        "=============AuthController.refreshTokens=============",
        message
      );
      res
        .status(401)
        .json(formatResponse(401, "Invalid refreshToken", null, message));
    }
  }

  static async signUP(req, res) {
    const { email, password, username } = req.body || {};

    const { isValid, error } = User.validateSignUpData({
      email,
      password,
      username,
    });

    if (!isValid) {
      return res.status(422).json(formatResponse(422, error, null, error));
    }

    const normalizedEmail = email.trim().toLowerCase();
    try {
      const userFound = await UserService.getByEmail(normalizedEmail);

      if (userFound) {
        return res
          .status(409)
          .json(
            formatResponse(
              409,
              `Пользователь c таким email (${email}) уже существует`,
              null,
              `Пользователь c таким email (${email}) уже существует`
            )
          );
      }

      const newUser = await UserService.create({ email, password, username });

      if (!newUser) {
        return res
          .status(500)
          .json(
            formatResponse(
              500,
              "Не удалось создать пользователя",
              null,
              "Не удалось создать пользователя"
            )
          );
      }

      const { accessToken, refreshToken } = generateJWTTokens({
        user: newUser,
      });

      return res
        .status(201)
        .cookie("refreshToken", refreshToken, cookieConfig)
        .json(
          formatResponse(201, "Пользователь успешно создан", {
            user: newUser,
            accessToken,
          })
        );
    } catch ({ message }) {
      console.log(
        "===============AuthController.signUp===============\n",
        message
      );
      res
        .status(500)
        .json(formatResponse(500, "Внутреннаяя ошибка сервера", null, message));
    }
  }
  static async signIn(req, res) {
    const { email, password } = req.body;

    const { isValid, error } = User.validateSignInData({ email, password });

    if (!isValid) {
      return res.status(422).json(formatResponse(422, error, null, error));
    }

    const normalizedEmail = email.trim().toLowerCase();
    try {
      const userFound = await UserService.getByEmail(normalizedEmail);

      if (!userFound) {
        return res
          .status(404)
          .json(
            formatResponse(
              404,
              "Пользователь не найден",
              null,
              "Пользователь не найден"
            )
          );
      }
      const isPasswordValid = await bcrypt.compare(
        password,
        userFound.password
      );
      if (!isPasswordValid) {
        return res
          .status(401)
          .json(
            formatResponse(
              401,
              "Неверный email или пароль",
              null,
              "Неверный email или пароль"
            )
          );
      }
      delete userFound.password;
      const { accessToken, refreshToken } = generateJWTTokens({
        user: userFound,
      });
      return res
        .status(200)
        .cookie("refreshToken", refreshToken, cookieConfig)
        .json(
          formatResponse(200, "Успешно авторизован", {
            user: userFound,
            accessToken,
          })
        );
    } catch ({ message }) {
      console.log(
        "===============AuthController.signIn===============\n",
        message
      );
      res
        .status(500)
        .json(formatResponse(500, "Внутреннаяя ошибка сервера", null, message));
    }
  }
  static async signOut(req, res) {
    try {
      return res.status(200).clearCookie("refreshToken").json(formatResponse(200, "Успешно вышли из аккаунта", null, null));
    } catch ({ message }) {
      console.log(
        "===============AuthController.signOut===============\n",
        message
      );
      res
        .status(500)
        .json(formatResponse(500, "Внутреннаяя ошибка сервера", null, message));
    }
  }

  static async getUsers(req, res) {
    try {
      const { user } = res.locals;
      const users = await UserService.getAllExcept(user.id);

      return res
        .status(200)
        .json(
          formatResponse(200, "Список пользователей успешно получен", users)
        );
    } catch ({ message }) {
      console.log(
        "===============AuthController.getUsers===============\n",
        message
      );
      res
        .status(500)
        .json(formatResponse(500, "Внутреннаяя ошибка сервера", null, message));
    }
  }
}

module.exports = UserController;
