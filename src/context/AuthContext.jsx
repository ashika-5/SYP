// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("currentUser"));
    const adminLogged = localStorage.getItem("isAdminLoggedIn") === "true";

    if (savedUser) setCurrentUser(savedUser);
    if (adminLogged) setIsAdmin(true);
  }, []);

  const registerPatient = (fullName, email, password) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // Check if email already exists
    if (users.some((user) => user.email === email)) {
      throw new Error("Email already registered");
    }

    const newUser = {
      id: Date.now(),
      fullName,
      email,
      password, // In real app, hash this password
    };

    localStorage.setItem("users", JSON.stringify([...users, newUser]));
    return newUser;
  };

  const loginPatient = (email, password) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) {
      throw new Error("Invalid email or password");
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    setCurrentUser(user);
    return user;
  };

  const loginAdmin = () => {
    localStorage.setItem("isAdminLoggedIn", "true");
    setIsAdmin(true);
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isAdminLoggedIn");
    setCurrentUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        registerPatient,
        loginPatient,
        loginAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
