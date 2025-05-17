import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Header from "../../components/Header/Header";
import styles from '../Chat/Chat.module.css';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  // Function to split bot message stats onto separate lines
  const formatBotMessage = (text) => {
    return text.split(/(?=\b[A-Z0-9%_]+:)/g);
  };

  // function to send the message to the python backend. I will then get a response back from the backend and set it in setMessages
  const sendMessage = async () => {
    if (!input.trim()) return;

    // set the messages for the user
    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);

    try {
      // send it to the backend
      const res = await axios.post("http://127.0.0.1:8000/chat", { text: input });
      // set the bots message
      const botMessage = { sender: "bot", text: res.data.response };
      // set the messages in setMessages
      setMessages((prev) => [...prev, botMessage]);
      // set our input back to nothing
      setInput("");
    } catch (error) {
      console.error("Error communicating with chatbot", error);
    }
  };

  // allows the page to automatically scroll when the chatbot overflows
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.chatBox}>
          <div className={styles.responseWindow}>
            <h1>Enter your teams or queries here</h1>
            {messages.map((msg, idx) => {
              if (msg.sender === "bot") {
                const lines = formatBotMessage(msg.text);
                return (
                  <div key={idx} className={styles.botMessage}>
                    <strong>{msg.sender}:</strong>
                    {lines.map((line, i) => (
                      <p key={i} style={{ margin: '0.2rem 0', paddingLeft: '1rem' }}>
                        {line.trim()}
                      </p>
                    ))}
                  </div>
                );
              } else {
                return (
                  <p key={idx} className={styles.userMessage}>
                    <strong>{msg.sender}:</strong> {msg.text}
                  </p>
                );
              }
            })}
            <div ref={bottomRef} />
          </div>
          <input
            className={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="enter a team name or a query to get started"
          />
        </div>
      </div>
    </>
  );
};

export default Chat;
