import React, { useState } from "react";
import "./SignUp.scss";
import { addNewUser } from "../../services/users.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";

const SignUpComponent: React.FC<any> = () => {
  const [userName, setUserName] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [role] = useState<string>("user");
  const [password, setPassword] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isLocationModalVisible, setLocationModalVisible] =
    useState<boolean>(false);
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [secureTextEntryConfirm, setSecureTextEntryConfirm] =
    useState<boolean>(true);
  const [errors, setErrors] = useState<{
    userName: boolean;
    name: boolean;
    email: boolean;
    password: boolean;
    confirmPassword: boolean;
    location: boolean;
  }>({
    userName: false,
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
    location: false,
  });
  const navigate = useNavigate();
  const locations = ["Tehran", "Mashhad", "Sari", "Rasht", "Karaj"];

  const onBackToLogin = () => {
    navigate("/login");
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|email)\.com$/;
    return emailRegex.test(email);
  };

  const handleOpenModal = async () => {
    setLocationModalVisible(true);
    setErrors((prev) => ({ ...prev, location: false }));
  };

  const handleSignUp = async () => {
    setErrors({
      userName: false,
      name: false,
      email: false,
      password: false,
      confirmPassword: false,
      location: false,
    });

    if (
      !userName ||
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !location
    ) {
      if (!userName) {
        setErrors((prev) => ({ ...prev, userName: true }));
      }
      if (!name) {
        setErrors((prev) => ({ ...prev, name: true }));
      }
      if (!email) {
        setErrors((prev) => ({ ...prev, email: true }));
      }
      if (!password) {
        setErrors((prev) => ({ ...prev, password: true }));
      }
      if (!confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: true }));
      }
      if (!location) {
        setErrors((prev) => ({ ...prev, location: true }));
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

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await addNewUser({
        user: {
          userName,
          name,
          role,
          password,
          location,
          email,
        },
      });

      if (response.ok) {
        alert("User created successfully!");
        onBackToLogin();
        navigate("/");
      } else {
        alert("Failed to create user. Please try again.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  };

  const renderDropdown = () => (
    <div className="modal">
      {locations.map((item) => (
        <div
          key={item}
          className="modalItem"
          onClick={() => {
            setLocation(item);
            setLocationModalVisible(false);
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );

  return (
    <div className="container">
      <div className="innerContainer">
        <h1 className="title">Create Your Account</h1>

        <input
          type="text"
          className={`SignUp-input ${errors.userName ? "input-error" : ""}`}
          placeholder="Username"
          value={userName}
          onChange={(e) => {
            setUserName(e.target.value);
            setErrors((prev) => ({ ...prev, userName: false }));
          }}
        />

        <input
          type="text"
          className={`SignUp-input ${errors.name ? "input-error" : ""}`}
          placeholder="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors((prev) => ({ ...prev, name: false }));
          }}
        />

        <input
          type="email"
          className={`SignUp-input ${errors.email ? "input-error" : ""}`}
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
            className={`inputPassword ${errors.password ? "input-error" : ""}`}
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: false }));
            }}
          />

          <button
            className="SignUp-eyeIcon"
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
            className="SignUp-eyeIcon"
            onClick={() => setSecureTextEntryConfirm(!secureTextEntryConfirm)}
          >
            <FontAwesomeIcon
              icon={secureTextEntryConfirm ? faEyeSlash : faEye}
            />
          </button>
        </div>

        <div
          className={`dropdown ${errors.location ? "input-error" : ""}`}
          onClick={() => handleOpenModal()}
        >
          {location || "Select Location"}
        </div>

        <Modal
          isOpen={isLocationModalVisible}
          onRequestClose={() => setLocationModalVisible(false)}
          className="modalOverlay"
          overlayClassName="modalOverlayBackground"
        >
          {renderDropdown()}
        </Modal>

        <button className="buttonSignUp" onClick={handleSignUp}>
          Sign Up
        </button>

        <button className="backButton" onClick={onBackToLogin}>
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default SignUpComponent;
