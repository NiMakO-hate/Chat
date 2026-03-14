import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './signInForm.module.css';
import { UserService } from '../../../../entities/user/UserService';
import { UserValidator } from '../../../../entities/user/UserValidator';
import { setAccessToken } from '../../../../shared/lib/axiosInstance';

type SignInFormState = {
  email: string;
  password: string;
};

type SignInFormProps = {
  setUser: (user: unknown) => void;
};

const INITIAL_INPUTS_DATA: SignInFormState = {
  email: '',
  password: '',
};

export function SignInForm({ setUser }: SignInFormProps) {
  const [inputs, setInputs] = useState<SignInFormState>(INITIAL_INPUTS_DATA);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { isValid, error } = UserValidator.validateSignInData(inputs);

    if (!isValid) {
      alert(error);
      return;
    }

    try {
      setLoading(true);
      const response = await UserService.signIn(inputs.email, inputs.password);

      if (response.statusCode === 200) {
        setInputs(INITIAL_INPUTS_DATA);
        setAccessToken(response.data.accessToken);
        setUser(response.data.user);
        navigate('/');
      } else {
        alert(response.error || response.message || 'Ошибка входа');
      }
    } catch (err) {
      console.error(err);
      alert('Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.signInForm} onSubmit={onSubmitHandler}>
      <h2 className={styles.formTitle}>Вход</h2>

      <div className={styles.inputGroup}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={onChangeHandler}
          value={inputs.email}
          className={styles.formInput}
          autoFocus
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
        {loading ? 'Загрузка...' : 'Войти'}
      </button>
    </form>
  );
}
