// src/components/QRCode/QRCodePasswordForm.jsx
import React, { useState, useEffect } from 'react';
import { sanitizeInput } from '../../utils/sanitizeInput';

const generatePassword = (length) => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

const QRCodePasswordForm = ({ handleSubmit }) => {
  const [password, setPassword] = useState('');

  useEffect(() => {
    const newPassword = generatePassword(32);
    setPassword(newPassword);
  }, []);

  const regeneratePassword = () => {
    const newPassword = generatePassword(32);
    setPassword(newPassword);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const sanitizedPassword = sanitizeInput(password);
    handleSubmit(sanitizedPassword, 'Generated Password', '', 'Password');
  };

  return (
    <form onSubmit={onSubmit}>
      <h3>Generated Password</h3>
      <input
        type="text"
        value={password}
        readOnly
      />
      <button type="button" onClick={regeneratePassword}>Generate</button>
      <button type="submit">Get Password QR Code</button>
    </form>
  );
};

export default QRCodePasswordForm;
