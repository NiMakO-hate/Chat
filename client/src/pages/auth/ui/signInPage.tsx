import React, { useState } from 'react';
import { SignInForm, SignUpForm } from '../../../features/auth';
import styles from './signInPage.module.css';

type Props = {
  setUser: (user: unknown) => void;
};

export function SignInPage({ setUser }: Props) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.tabRow}>
          <button
            type="button"
            className={`${styles.tabBtn} ${mode === 'signin' ? styles.tabBtnActive : ''}`}
            onClick={() => setMode('signin')}
          >
            Вход
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${mode === 'signup' ? styles.tabBtnActive : ''}`}
            onClick={() => setMode('signup')}
          >
            Регистрация
          </button>
        </div>

        {mode === 'signin' ? <SignInForm setUser={setUser} /> : <SignUpForm />}
      </div>
    </div>
  );
}