export class UserValidator {
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
    static validateSignInData({ email, password }) {
        if (
          !email ||
          typeof email !== 'string' ||
          email.trim().length === 0 ||
          !this.validateEmail(email)
        ) {
          return {
            isValid: false,
            error: 'Email не должен быть пустым и должен быть валидным',
          };
        }
        if (
          !password ||
          typeof password !== 'string' ||
          password.trim().length === 0 ||
          !this.validatePassword(password)
        ) {
          return {
            isValid: false,
            error: 'Пароль не должен быть пустым и должен быть длинной от 3 до 10 символов',
          };
        }
        return { isValid: true };
    }
    static validateSignUpData({ email, password, username }){
        if (
          !email ||
          typeof email !== 'string' ||
          email.trim().length === 0 ||
          !this.validateEmail(email)
        ) {
          return {
            isValid: false,
            error: 'Email не должен быть пустым и должен быть валидным',
          };
        }

        if (
          !password ||
          typeof password !== 'string' ||
          password.trim().length === 0 ||
          !this.validatePassword(password)
        ) {
          return {
            isValid: false,
            error: 'Пароль не должен быть пустым и должен быть длинной от 3 до 10 символов',
          };
        }
        if (
          !username ||
          typeof username !== 'string' ||
          username.trim().length === 0 ||
          !this.validateUsername(username)
        ) {
          return {
            isValid: false,
            error: 'Имя пользователя не должно быть пустым и должно быть длинной от 3 до 10 символов',
          };
        }
        return { isValid: true };
    }
}