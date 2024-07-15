/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState("");
  const [lastLogin, setLastLogin] = useState("");

  // Load userId from localStorage on component mount
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }

    const storedLastLogin = localStorage.getItem("lastLogin");
    if (storedLastLogin) {
      setLastLogin(storedLastLogin);
    }
  }, []);

  // Store userId in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("userId", userId);
    localStorage.setItem("lastLogin", lastLogin);
  }, [lastLogin, userId]);

  console.log("userId now:", userId);

  return (
    <UserContext.Provider
      value={{ userId, setUserId, lastLogin, setLastLogin }}
    >
      {children}
    </UserContext.Provider>
  );
};
