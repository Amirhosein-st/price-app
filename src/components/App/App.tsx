import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginComponent from "../Login/Login";
import SignUpComponent from "../SignUp/SignUp";
import ForgetPasswordComponent from "../ForgetPassword/ForgetPassword";
import "./App.scss";
import HomeComponent from "../Home/Home";
import FristPageComponent from "../FristPage/FristPage";
import GoldComponent from "../Gold/Gold";
import ArzComponent from "../Arz/Arz";
import CryptoComponent from "../Crypto/Crypto";
import ProfileComponent from "../Profile/Profile";

const App: React.FC = () => {
  const [user, setUser] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(true);
    } else {
      setUser(false);
    }
  }, []);

  const handleLoginSuccess = (user: any) => {
    setUser(true);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(false);
  };

  return (
    <BrowserRouter>
      <div className="container">
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/home" /> : <Navigate to="/login" />}
          />

          <Route
            path="/login"
            element={<LoginComponent onLoginSuccess={handleLoginSuccess} />}
          />

          <Route
            path="/forgot-password"
            element={<ForgetPasswordComponent />}
          />

          <Route path="/signup" element={<SignUpComponent />} />

          <Route
            path="/home"
            element={
              user ? (
                <HomeComponent onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          >
            <Route index element={<FristPageComponent />} />
            <Route path="gold" element={<GoldComponent />} />
            <Route path="arz" element={<ArzComponent />} />
            <Route path="crypto" element={<CryptoComponent />} />
            <Route path="profile" element={<ProfileComponent />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
