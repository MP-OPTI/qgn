// File: src/pages/WiFi.jsx
import React, { useState, useEffect } from 'react';
import QRCodeWiFiForm from '../components/QRCode/QRCodeWiFiForm';
import QRCodeNonUserDisplay from '../components/QRCode/QRCodeNonUserDisplay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const WiFiPage = () => {
  const [submittedWifi, setSubmittedWifi] = useState('');
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

  const handleFormSubmit = (wifiString) => {
    console.log('Form submitted with WiFi String:', wifiString);
    setSubmittedWifi(wifiString);
  };

  return (
    <div className="qr-nonuser">
      <div className="qr-generator">
        <QRCodeWiFiForm handleSubmit={handleFormSubmit} />
      </div>
      <div className="qr-codes">
        {submittedWifi ? (
          <QRCodeNonUserDisplay submittedUrl={submittedWifi} />
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

export default WiFiPage;
