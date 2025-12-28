import React, { useState } from "react";
import styles from "./Auth.module.css";

const AuthForm = ({ onLogin, onRegister }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [authMessage, setAuthMessage] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerFullName, setRegisterFullName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthMessage("");
    try {
      await onLogin(loginEmail, loginPassword);
      setAuthMessage("Login successful!");
    } catch (err) {
      setAuthMessage(err.message || "Login failed");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthMessage("");
    try {
      await onRegister(registerFullName, registerEmail, registerPassword);
      setAuthMessage("Registration successful! Please log in.");
      setIsLoginView(true);
    } catch (err) {
      setAuthMessage(err.message || "Registration failed");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.logo}>LOOP</h1>
          <p className={styles.subtitle}>
            {isLoginView ? "Welcome back 👋" : "Create your account"}
          </p>
        </div>

        {authMessage && (
          <div className={styles.message}>{authMessage}</div>
        )}

        {isLoginView ? (
          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className={styles.input}
                placeholder="you@example.com"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className={styles.input}
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className={styles.submitButton}>
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Full name</label>
              <input
                type="text"
                value={registerFullName}
                onChange={(e) => setRegisterFullName(e.target.value)}
                required
                className={styles.input}
                placeholder="Your full name"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
                className={styles.input}
                placeholder="you@example.com"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Password</label>
              <input
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
                className={styles.input}
                placeholder="Create a strong password"
              />
            </div>
            <button type="submit" className={styles.submitButton}>
              Register
            </button>
          </form>
        )}

        <div className={styles.footer}>
          <span className={styles.footerText}>
            {isLoginView ? "Don't have an account?" : "Already have an account?"}
          </span>{" "}
          <button
            onClick={() => setIsLoginView(!isLoginView)}
            className={styles.toggleButton}
          >
            {isLoginView ? "Register" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;