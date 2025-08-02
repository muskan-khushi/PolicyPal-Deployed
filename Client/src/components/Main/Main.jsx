import React from "react";
import "./Main.css";
import Chat from "../Chat/Chat";
import { useState } from "react";

const Main = () => {
  const sessionId = "session_" + Date.now();
  const [messages, setMessages] = useState([]);

  return (
    <div className="main">
      <div className="nav">
        <p>PolicyPal</p>
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
