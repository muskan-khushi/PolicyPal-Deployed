// src/components/Chat/Chat.jsx
import React, { useEffect, useState } from "react";
import "./Chat.css";
import { useNavigate } from "react-router-dom";

const Chat = ({ sessionId, messages, setMessages }) => {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);
  const sendMessage = async () => {
    if (!input.trim()) return;

    const token = localStorage.getItem("token"); // get token here
    if (!token) {
      alert("Please log in first.");
      navigate("/login");
      return;
    }

    const userMessage = { role: "user", text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");

    try {
      const res = await fetch("http://localhost:5000/api/chat/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessionId,
          message: updatedMessages,
        }),
      });

      const data = await res.json();

      setMessages([
        ...updatedMessages,
        { role: "bot", text: data.reply || "No reply received." },
      ]);
    } catch (error) {
      setMessages([
        ...updatedMessages,
        { role: "bot", text: "Server error, please try again." },
      ]);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`msg ${msg.role}`}>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      <div className="input-box">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your question..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
