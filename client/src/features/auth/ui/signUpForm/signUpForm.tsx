import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './signUpForm.module.css';
import { UserService } from '../../../../entities/user/UserService';
import { UserValidator } from '../../../../entities/user/UserValidator';

type SignUpFormState = {
  email: string;
  password: string;
  username: string;
};

const INITIAL_INPUTS_DATA: SignUpFormState = {
  email: '',
  password: '',
  username: '',
};

export function SignUpForm() {
  const [inputs, setInputs] = useState<SignUpFormState>(INITIAL_INPUTS_DATA);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { isValid, error } = UserValidator.validateSignUpData(inputs);

    if (!isValid) {
      alert(error);
      return;
    }

    try {
      setLoading(true);
      const response = await UserService.signUp(
        inputs.email,
        inputs.password,
        inputs.username
      );

      if (response.statusCode === 201) {
        setInputs(INITIAL_INPUTS_DATA);
        navigate('/auth');
      } else {
        alert(response.error || response.message || 'Ошибка при регистрации');
      }
    } catch (err) {
      console.error(err);
      alert('Ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.signUpForm} onSubmit={onSubmitHandler}>
      <h2 className={styles.formTitle}>Регистрация</h2>

      <div className={styles.inputGroup}>
        <input
          type="text"
          name="username"
          placeholder="Имя пользователя"
          onChange={onChangeHandler}
          value={inputs.username}
          className={styles.formInput}
          autoFocus
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={onChangeHandler}
          value={inputs.email}
          className={styles.formInput}
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          onChange={onChangeHandler}
          value={inputs.password}
          className={styles.formInput}
          required
        />
      </div>

      <button type="submit" className={styles.submitButton} disabled={loading}>
        {loading ? 'Загрузка...' : 'Зарегистрироваться'}
      </button>
    </form>
  );
}
