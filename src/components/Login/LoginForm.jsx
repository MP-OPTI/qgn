// File: src/components/Login/LoginForm.jsx
import React from 'react';
import CustomCheckbox from '../CustomCheckbox'; // Adjust the import path as necessary

const LoginForm = ({ email, setEmail, password, setPassword, handleSubmit, rememberMe, setRememberMe }) => {
  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="checkbox-container">
        <CustomCheckbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
        <label htmlFor="rememberMe">Remember Me</label>
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
