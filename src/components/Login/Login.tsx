import React, { useState } from "react";
import "./Login.scss";
import { loginUser } from "../../services/users.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

interface User {
  userName: string;
  password: string;
}

interface LoginComponentProps {
  onLoginSuccess: (user: User) => void;
}

const LoginComponent: React.FC<LoginComponentProps> = ({ onLoginSuccess }) => {
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
  const [errors, setErrors] = useState<{
    userName: boolean;
    password: boolean;
  }>({
    userName: false,
    password: false,
  });
  const navigate = useNavigate();

  const onSignUp = () => {
    navigate("/signup");
  };

  const onForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleLogin = async () => {
    setErrors({ userName: false, password: false });

    if (!userName && !password) {
      setErrors({ userName: true, password: true });
      alert("Username and Password are required!");
      return;
    }
    if (!userName) {
      setErrors((prev) => ({ ...prev, userName: true }));
      alert("Username is empty!");
      return;
    }
    if (!password) {
      setErrors((prev) => ({ ...prev, password: true }));
      alert("Password is empty!");
      return;
    }

    try {
      const response = await loginUser();
      const data = await response.json();
      const user = data.users.find((user: User) => user.userName === userName);

      if (!user) {
        alert("Username is incorrect");
        return;
      }

      if (user.password !== password) {
        alert("Password is incorrect");
        return;
      }

      localStorage.setItem("user", JSON.stringify(user));
      onLoginSuccess(user);
      navigate("/home");
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-innerContainer">
        <h1 className="login-title">Welcome Back</h1>

        <input
          type="text"
          className={`login-input ${errors.userName ? "input-error" : ""}`}
          placeholder="Username"
          value={userName}
          onChange={(e) => {
            setUserName(e.target.value);
            setErrors((prev) => ({ ...prev, userName: false }));
          }}
        />

        <div className="login-passwordContainer">
          <input
            type={secureTextEntry ? "password" : "text"}
            className={`login-inputPassword ${
              errors.password ? "input-error" : ""
            }`}
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: false }));
            }}
          />

          <button
            className="login-eyeIcon"
            onClick={() => setSecureTextEntry(!secureTextEntry)}
          >
            <FontAwesomeIcon icon={secureTextEntry ? faEyeSlash : faEye} />
          </button>
        </div>

        <button className="login-buttonLogin" onClick={handleLogin}>
          Sign In
        </button>

        <p className="login-ORText">OR</p>

        <button className="login-buttonSignUp" onClick={onSignUp}>
          Sign Up
        </button>

        <button className="login-forgotPassword" onClick={onForgotPassword}>
          Forgot Password?
        </button>
      </div>
    </div>
  );
};

export default LoginComponent;
