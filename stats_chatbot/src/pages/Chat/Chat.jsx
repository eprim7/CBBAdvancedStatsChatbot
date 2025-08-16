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
      const keys = [
        "SOS", "NET", "Offensive Rating", "Defensive Rating", "EFG", "TS%", "ORB%", "DRB%", "TRB%", "AST%", "STL%", "BLK%",
        "PACE", "3PAR", "FTAR", "PPG", "FG%", "2FG%", "3FG%", "FT%", "APG", "AST-TOV", "TOV", "Allowed_PPG",
        "Allowed_FG%", "2Point_Allowed_FG%", "3Point_Allowed_FG%", "SPG", "BPG", "Fouls", "ADJOE", "ADJDE", "BARTHAG", "WAB", "CONF"
      ];

      let normalized = text.replace(/\n/g, ' ').replace(/\s+/g, ' ');

      const escapedKeys = keys.map(key => key.replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1'));

      const pattern = new RegExp(`\\b(${escapedKeys.join('|')}):`, 'g');

      normalized = normalized.replace(pattern, '\n$1:');

      return normalized.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  };


  /*
    function_name: sendMessage
    purpose: send a message to our backend server, and get a response
    return: returns the response based on the query
  */

  const sendMessage = async () => {
    if (!input.trim()) return;

    // set the messages for the user
    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);

    try {
      // send it to the backend
      const res = await axios.post("http://localhost:5000/api/chat", { text: input });
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
            <h1 className={styles.h1}>Enter your teams or queries here</h1>
            {messages.map((msg, idx) => {
              if (msg.sender === "bot") {
                const lines = formatBotMessage(msg.text);
                return (
                  <div key={idx} className={styles.botMessage}>
                    <strong>{msg.sender}:</strong>
                    {lines.map((line, i) => (
                      <p key={i} className={styles.p}>
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
