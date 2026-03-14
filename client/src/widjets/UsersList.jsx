import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserService } from '../entities/user/UserService';
import './UsersList.css';

export function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await UserService.getUsers();
        if (response.statusCode === 200) {
          setUsers(response.data || []);
        } else {
          setError(response.message || 'Не удалось получить список пользователей');
        }
      } catch (err) {
        setError('Ошибка при загрузке пользователей');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSelectUser = (id) => {
    navigate(`/chat/${id}`);
  };

  if (loading) {
    return <div className="users-list users-list--state">Загрузка...</div>;
  }

  if (error) {
    return <div className="users-list users-list--state">{error}</div>;
  }

  if (users.length === 0) {
    return <div className="users-list users-list--state">Пользователи не найдены</div>;
  }

  return (
    <div className="users-list">
      {users.map((user) => (
        <button
          key={user.id}
          type="button"
          className="users-list__item"
          onClick={() => handleSelectUser(user.id)}
        >
          <div className="users-list__avatar">
            {user.username?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="users-list__info">
            <div className="users-list__name">{user.username}</div>
            <div className="users-list__email">{user.email}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

