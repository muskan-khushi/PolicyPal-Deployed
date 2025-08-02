import React, { useState } from 'react';
import './Auth.css';
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUp";

const AuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="toggle-container">
          <button
            className={`toggle-button ${isLoginView ? 'active' : ''}`}
            onClick={() => setIsLoginView(true)}
          >
            Login
          </button>
          <button
            className={`toggle-button ${!isLoginView ? 'active' : ''}`}
            onClick={() => setIsLoginView(false)}
          >
            Sign Up
          </button>
        </div>
        {isLoginView ? <LoginForm /> : <SignUpForm />}
      </div>
    </div>
  );
};

export default AuthPage;