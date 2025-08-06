import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUpForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirm_password] = useState("");
  const navigate = useNavigate();

  // --- THIS IS THE FINAL FIX ---
  const API_ENDPOINT = `${import.meta.env.VITE_API_URL}/api/user/register`;
  // --------------------------

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirm_password) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        navigate("/chat");
        alert("Registration successful!");
      } else {
        alert(data.message || "Registration Failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="form-container">
      <form className="auth-form" onSubmit={onSubmitHandler}>
        <h2 className="auth-title">Create an Account</h2>
        <div className="input-group">
          <label htmlFor="signup-name">Name</label>
          <input type="text" id="signup-name" placeholder="Name" required value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="input-group">
          <label htmlFor="signup-email">Email</label>
          <input type="email" id="signup-email" placeholder="Enter your email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="input-group">
          <label htmlFor="signup-password">Password</label>
          <input type="password" id="signup-password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="input-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" placeholder="Confirm Password" required value={confirm_password} onChange={(e) => setConfirm_password(e.target.value)} />
        </div>
        <button type="submit" className="submit-button">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpForm;