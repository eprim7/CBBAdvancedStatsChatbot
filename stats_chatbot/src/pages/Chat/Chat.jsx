import React, { useState } from "react";
import axios from "axios";
import Header from "../../components/Header/Header";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);

    try {
      const res = await axios.post("http://127.0.0.1:8000/chat", { text: input });
      const botMessage = { sender: "bot", text: res.data.response };
      setMessages((prev) => [...prev, botMessage]);
      setInput("");
    } catch (error) {
      console.error("Error communicating with chatbot", error);
    }
  };

  return (
    <>
      <Header />
      <div>
        <div style={{ padding: "1em", border: "1px solid black", height: "300px", overflowY: "auto" }}>
          {messages.map((msg, idx) => (
            <p key={idx} style={{ color: msg.sender === "user" ? "blue" : "green" }}>
              <strong>{msg.sender}:</strong> {msg.text}
            </p>
          ))}
        </div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </>
  );
};

export default Chat;
