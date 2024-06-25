// File: src/pages/Password.jsx

import React, { useState, useEffect } from 'react';
import QRCodePasswordForm from '../components/QRCode/QRCodePasswordForm';
import QRCodeNonUserDisplay from '../components/QRCode/QRCodeNonUserDisplay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const PasswordPage = () => {
  const [submittedPassword, setSubmittedPassword] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('hideMessage')) {
      setTimeout(() => {
        setShowMessage(true);
      }, 3000);
    }
  }, []);

  const handleCloseMessage = () => {
    setAnimateOut(true);
    setTimeout(() => {
      setShowMessage(false);
      setAnimateOut(false);
      localStorage.setItem('hideMessage', 'true');
    }, 500);
  };

  const handleFormSubmit = (password) => {
    console.log('Form submitted with Password:', password);
    setSubmittedPassword(password);
  };

  return (
    <div className="qr-nonuser">
      <div className="qr-generator">
        <QRCodePasswordForm handleSubmit={handleFormSubmit} />
      </div>
      <div className="qr-codes">
        {submittedPassword ? (
          <QRCodeNonUserDisplay submittedUrl={submittedPassword} />
        ) : (
          <div className="qr-placeholder"><FontAwesomeIcon icon="qrcode" /></div>
        )}
      </div>
      {showMessage && (
        <div className={`message-to-user ${animateOut ? 'slide-out' : 'slide-in'}`}>
          <button className="close-button" onClick={handleCloseMessage}>
            <FontAwesomeIcon icon="xmark" />
          </button>
          <p>Want to save your QR Code? <a href="/register">Register</a> as a user, to save and download all your QR Codes!</p>
        </div>
      )}
    </div>
  );
};

export default PasswordPage;
