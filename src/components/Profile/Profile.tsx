import React, { useEffect, useState } from "react";
import { fetchUsers, updateUserData } from "../../services/users.service";
import { toJalaali } from "jalaali-js";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./Profile.scss";

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    location: "",
  });
  const [errors, setErrors] = useState<{
    email: string;
    name: string;
    password: string;
    confirmPassword: string;
    location: string;
  }>({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    location: "",
  });
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
  const [secureTextEntryConfirm, setSecureTextEntryConfirm] =
    useState<boolean>(true);

  const locations = ["Tehran", "Mashhad", "Sari", "Rasht", "Karaj"];

  useEffect(() => {
    const fetchUserData = async () => {
      let storedUser: any = localStorage.getItem("user");
      if (storedUser) {
        storedUser = JSON.parse(storedUser);
      }

      try {
        const response = await fetchUsers();
        const data = await response.json();

        const user = data.users.find(
          (user: any) => user.userName === storedUser.userName
        );

        setUser(user);
        setLoading(false);
        setFormData({
          email: user.email,
          name: user.name,
          password: "",
          confirmPassword: "",
          location: user.location,
        });
      } catch (error) {
        alert("An error occurred. Please try again.");
      }
    };

    fetchUserData();
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    let isValid = true;
    const newErrors = {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
      location: "",
    };

    if (!formData.email) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format.";
      isValid = false;
    }

    if (!formData.name) {
      newErrors.name = "Name is required.";
      isValid = false;
    }

    if (formData.password && formData.password.length < 4) {
      newErrors.password = "Password must be at least 6 characters long.";
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    if (!formData.location) {
      newErrors.location = "Location is required.";
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    const passwordToUpdate =
      formData.password === "" ? user.password : formData.password;

    const updateResponse = await updateUserData(user.id, {
      user: {
        userName: user.userName,
        name: formData.name,
        email: formData.email,
        location: formData.location,
        password: passwordToUpdate,
      },
    });

    if (updateResponse.ok) {
      alert("Your User Data was Updated");

      setUser({
        ...user,
        name: formData.name,
        email: formData.email,
        location: formData.location,
        password: passwordToUpdate,
      });

      setModalOpen(false);
    } else {
      alert("Failed to update.");
    }
  };
  const convertToJalali = (gregorianDate: string) => {
    const datePart = gregorianDate.split(" ")[0];
    const [year, month, day] = datePart.split("/").map(Number);
    const jalaliDate = toJalaali(year, month, day);
    return `${jalaliDate.jy}/${jalaliDate.jm}/${jalaliDate.jd}`;
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <div className="no-user">No user data found.</div>;
  }

  return (
    <div className="profile-page">
      <h1>Profile Page</h1>
      <div className="user-info">
        {user.avatar && (
          <img
            src={user.avatar}
            alt={`${user.name}'s avatar`}
            className="avatar"
          />
        )}
        <h2>Hi: {user.name}</h2>
        <p>
          <strong>Username:</strong> {user.userName}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Location:</strong> {user.location}
        </p>
        <p>
          <strong>Created Date:</strong> {convertToJalali(user.createdDate)}
        </p>
        <button className="edit-btn" onClick={() => setModalOpen(true)}>
          Edit Profile
        </button>
      </div>

      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="Edit Profile Modal"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>Edit Profile</h2>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" value={user.userName} readOnly />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="password-container">
              <input
                type={secureTextEntry ? "password" : "text"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setSecureTextEntry(!secureTextEntry)}
              >
                <FontAwesomeIcon icon={secureTextEntry ? faEyeSlash : faEye} />
              </button>
            </div>
            {errors.password && (
              <span className="error">{errors.password}</span>
            )}
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <div className="password-container">
              <input
                type={secureTextEntryConfirm ? "password" : "text"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setSecureTextEntryConfirm(!secureTextEntryConfirm)
                }
              >
                <FontAwesomeIcon
                  icon={secureTextEntryConfirm ? faEyeSlash : faEye}
                />
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="error">{errors.confirmPassword}</span>
            )}
          </div>
          <div className="form-group">
            <label>Location</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleInputChange}
            >
              <option value="">Select a location</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
            {errors.location && (
              <span className="error">{errors.location}</span>
            )}
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProfilePage;
