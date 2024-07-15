/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";

const Ticker = () => {
  const [messages, setMessages] = useState([
    "Welcome to our bank! Your financial security is our top priority.",
    "Attention: Be cautious of phishing scams. Our bank will never ask for your password via email.",
    "Our customer support team is available 24/7 to assist you. Call us at 1-800-BANK-HELP.",
    "Stay updated with our latest offers and promotions. Visit our website or mobile app today!",
  ]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) =>
        prevIndex === messages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change the interval time as needed (in milliseconds)

    return () => clearInterval(interval);
  }, [messages]);

  return (
    <div className="bg-blue-200 text-blue-800 p-2 rounded-md">
      <p>{messages[currentMessageIndex]}</p>
    </div>
  );
};

export default Ticker;
