// src/components/QRCode/QRCodeWiFiForm.jsx
import React, { useState } from 'react';
import { sanitizeInput } from '../../utils/sanitizeInput';

const QRCodeWiFiForm = ({ handleSubmit, isLoggedIn }) => {
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    const sanitizedSsid = sanitizeInput(ssid);
    const sanitizedPassword = sanitizeInput(password);
    const wifiString = `WIFI:S:${sanitizedSsid};T:WPA;P:${sanitizedPassword};;`;
    handleSubmit(wifiString, ssid, '', 'WiFi');
    setSsid('');
    setPassword('');
  };

  return (
    <form onSubmit={onSubmit}>
      {!isLoggedIn && <h3>Insert your SSID and Pass below</h3>}
      <input
        type="text"
        placeholder="Enter SSID"
        value={ssid}
        onChange={(e) => setSsid(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Generate WiFi QR Code</button>
    </form>
  );
};

export default QRCodeWiFiForm;
