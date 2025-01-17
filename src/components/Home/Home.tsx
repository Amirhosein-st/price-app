import React, { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import "./Home.scss";

interface User {
  name: string;
  role: string;
}

interface HomeComponentProps {
  onLogout: () => void;
}

const HomeComponent: React.FC<HomeComponentProps> = ({ onLogout }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkUser = async () => {
      const data = localStorage.getItem("user");
      if (data) {
        setUser(JSON.parse(data));
      }
    };
    checkUser();
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <button onClick={onLogout} className="home-logoutButton">
          Log Out
        </button>
        {user ? (
          <button onClick={() => navigate("/home")} className="home-headerText">
            Welcome, {user.name}
          </button>
        ) : (
          <button onClick={() => navigate("/home")} className="home-headerText">
            Home
          </button>
        )}
      </div>

      <div className="home-navbar">
        <button
          className={`navItem ${isActive("/home/gold") ? "activeNavText" : ""}`}
          onClick={() => navigate("/home/gold")}
        >
          طلا و سکه
        </button>
        <button
          className={`navItem ${isActive("/home/arz") ? "activeNavText" : ""}`}
          onClick={() => navigate("/home/arz")}
        >
          ارز
        </button>
        <button
          className={`navItem ${
            isActive("/home/crypto") ? "activeNavText" : ""
          }`}
          onClick={() => navigate("/home/crypto")}
        >
          کریپتو
        </button>
        <button
          className={`navItem ${
            isActive("/home/profile") ? "activeNavText" : ""
          }`}
          onClick={() => navigate("/home/profile")}
        >
          پروفایل
        </button>
      </div>

      <div className="home-mainContent">
        <Outlet />
      </div>
    </div>
  );
};

export default HomeComponent;
