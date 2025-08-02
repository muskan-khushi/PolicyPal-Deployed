import React from "react";
import "./Main.css";
import Chat from "../Chat/Chat";
import { useState } from "react";
import { Link } from "react-router";

const Main = () => {
  const sessionId = "session_" + Date.now();
  const [messages, setMessages] = useState([]);

  return (
    <div className="main">
      <div className="nav">
        <p>PolicyPal</p>
        
        <div className="auth-opt">
          <Link to="/auth"><button>Sign Up</button></Link>
          <Link to="/auth"><button>Login</button></Link>
        </div>
      </div>

      <div className="main-container">
        {
          messages.length === 0 &&
          <div className="greet">
            <img src="https://cdn-icons-png.freepik.com/512/211/211283.png" alt="" />
            <p><span>Hello!</span></p>
            <p>How can I help you today?</p>
          </div>
        }

        <Chat
          sessionId={sessionId}
          messages={messages}
          setMessages={setMessages}
        />
      </div>
    </div>
  );
};

export default Main;
