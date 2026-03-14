import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { UserService } from "../entities/user/UserService";
import { setAccessToken } from "../shared/lib/axiosInstance";
import "./Navigation.css";

export default function Navigation({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";

  const handleSignOut = async () => { 
    try {
      const response = await UserService.signOut();
      if (response.statusCode === 200) {
        setUser(null);
        setAccessToken("");
        navigate("/");
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="navigation">
      {user ? (
        <div className="user-info">
          <span className="user-name">{user.username}</span>
          <button onClick={handleSignOut} className="sign-out-btn">
            Выйти
          </button>
        </div>
      ) : !isAuthPage ? (
        <div className="auth-links">
          <NavLink to="/auth" className="auth-link">
            Войти
          </NavLink>
        </div>
      ) : null}
    </nav>
  );
}
