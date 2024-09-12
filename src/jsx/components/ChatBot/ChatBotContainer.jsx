import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const ChatBotContainer = () => {
  const [messages, setMessages] = useState(() => {
    // Load chat history from localStorage when the component mounts
    const savedMessages = localStorage.getItem("chatMessages");
    console.log("🚀 ~ Initial state ~ savedMessages:", savedMessages);
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [input, setInput] = useState("");
  const chatWindowRef = useRef(null);

  useEffect(() => {
    // Save chat history to localStorage whenever messages change
    console.log("🚀 ~ useEffect ~ messages:", messages);
    localStorage.setItem("chatMessages", JSON.stringify(messages));
    // Scroll to the bottom of the chat window whenever messages change
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const newMessage = { sender: "user", text: input };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    const options = {
      method: "POST",
      url: "https://meta-llama-3-8b.p.rapidapi.com/",
      headers: {
        'x-rapidapi-key': '870a7030d7msh014e25f605f2b29p18dbbejsn67d230e5bc71',
        'x-rapidapi-host': 'meta-llama-3-8b.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      data: {
        model: "meta-llama/Llama-3-8b-chat-hf",
        messages: [
          {
            role: "user",
            content: input,
          },
        ],
      },
    };

    try {
      // Replace with your actual LLaMA model API endpoint and API key
      const response = await axios.request(options);
      console.log(response.data);

      const botMessage = {
        sender: "bot",
        text: response.data.choices[0].message.content,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setInput("");
  };

  return (
    <div className="chat_container">
      <div className="chat-window" ref={chatWindowRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBotContainer;