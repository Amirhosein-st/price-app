import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgetPassword.scss";
import { fetchUsers, updateUserData } from "../../services/users.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

interface User {
  id: string;
  userName: string;
  email: string;
  password: string;
}

const ForgetPasswordComponent: React.FC<any> = () => {
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
  const [secureTextEntryConfirm, setSecureTextEntryConfirm] =
    useState<boolean>(true);
  const [errors, setErrors] = useState<{
    userName: boolean;
    email: boolean;
    newPassword: boolean;
    confirmPassword: boolean;
  }>({
    userName: false,
    email: false,
    newPassword: false,
    confirmPassword: false,
  });
  const navigate = useNavigate();

  const onBackToLogin = () => {
    navigate("/login");
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|email)\.com$/;
    return emailRegex.test(email);
  };

  const handlePasswordReset = async () => {
    setErrors({
      userName: false,
      email: false,
      newPassword: false,
      confirmPassword: false,
    });

    if (!userName || !email || !newPassword || !confirmPassword) {
      if (!userName) {
        setErrors((prev) => ({ ...prev, userName: true }));
      }
      if (!email) {
        setErrors((prev) => ({ ...prev, email: true }));
      }
      if (!newPassword) {
        setErrors((prev) => ({ ...prev, newPassword: true }));
      }
      if (!confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: true }));
      }
      alert("All fields are required.");
      return;
    }

    if (!validateEmail(email)) {
      alert(
        "Your email must be from one of the following domains: @gmail.com, @hotmail.com, or @email.com."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetchUsers();
      const data = await response.json();
      const user = data.users.find(
        (user: User) => user.userName === userName && user.email === email
      );

      if (!user) {
        alert("No matching user found.");
        return;
      }

      const updateResponse = await updateUserData(user.id, {
        user: {
          userName: user.userName,
          email: user.email,
          password: newPassword,
        },
      });

      if (updateResponse.ok) {
        alert("Password updated successfully! Let's Login");
        setTimeout(() => onBackToLogin(), 2000);
      } else {
        alert("Failed to update password.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="innerContainer">
        <h1 className="title">Reset Password</h1>

        <input
          type="text"
          className={`input ${errors.userName ? "input-error" : ""}`}
          placeholder="Username"
          value={userName}
          onChange={(e) => {
            setUserName(e.target.value);
            setErrors((prev) => ({ ...prev, userName: false }));
          }}
        />

        <input
          type="email"
          className={`input ${errors.email ? "input-error" : ""}`}
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({ ...prev, email: false }));
          }}
        />

        <div className="passwordContainer">
          <input
            type={secureTextEntry ? "password" : "text"}
            className={`inputPassword ${
              errors.newPassword ? "input-error" : ""
            }`}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setErrors((prev) => ({ ...prev, newPassword: false }));
            }}
          />

          <button
            className="eyeIcon"
            onClick={() => setSecureTextEntry(!secureTextEntry)}
          >
            <FontAwesomeIcon icon={secureTextEntry ? faEyeSlash : faEye} />
          </button>
        </div>

        <div className="passwordContainer">
          <input
            type={secureTextEntryConfirm ? "password" : "text"}
            className={`inputPassword ${
              errors.confirmPassword ? "input-error" : ""
            }`}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors((prev) => ({ ...prev, confirmPassword: false }));
            }}
          />

          <button
            className="eyeIcon"
            onClick={() => setSecureTextEntryConfirm(!secureTextEntryConfirm)}
          >
            <FontAwesomeIcon
              icon={secureTextEntryConfirm ? faEyeSlash : faEye}
            />
          </button>
        </div>

        <button className="button" onClick={handlePasswordReset}>
          Submit
        </button>

        <button className="backButton" onClick={onBackToLogin}>
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgetPasswordComponent;
