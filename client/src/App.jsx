import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Layout from './app/Layout';
import { HomePage } from './pages/HomePage';
import { SignInPage } from './pages/auth';
import { ChatPage } from './pages/ChatPage';
import { UserService } from './entities/user/UserService';
import { setAccessToken } from './shared/lib/axiosInstance';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const dataFromServer = await UserService.refreshTokens();

        if (dataFromServer.error) {
          setUser(null);
          return;
        }

        if (dataFromServer.statusCode === 201) {
          setUser(dataFromServer.data.user);
          setAccessToken(dataFromServer.data.accessToken);
        }
      } catch (error) {
        console.error(error);
        setUser(null);
      }
    };

    loadUser();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout user={user} setUser={setUser} />}>
          <Route index element={<HomePage />} />
          <Route path="auth" element={user ? <Navigate to="/" replace /> : <SignInPage setUser={setUser} />} />
          <Route path="chat/:userId" element={user ? <ChatPage /> : <Navigate to="/auth" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;