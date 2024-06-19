//QRCodeForm.jsx
import React, { useState, useEffect } from 'react';
import { QRCode } from 'react-qrcode-logo';
import qLogo from '../../assets/q-logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sanitizeInput } from '../../utils/sanitizeInput';

const QRCodeForm = ({ handleSubmit, showGenerateButton, isLoggedIn }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [submittedUrl, setSubmittedUrl] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('hideMessage')) {
      setTimeout(() => {
        setShowMessage(true); // Show the message with a delay
      }, 3000); // 3-second delay before showing the message
    }
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const sanitizedUrl = sanitizeInput(url);
    setSubmittedUrl(sanitizedUrl); // Store the sanitized URL to display the QR code
    handleSubmit(sanitizedUrl, title, tags);
    setUrl('');
    setTitle('');
    setTags('');
  };

  const handleCloseMessage = () => {
    setAnimateOut(true);
    setTimeout(() => {
      setShowMessage(false);
      setAnimateOut(false);
      localStorage.setItem('hideMessage', 'true'); // Set item in localStorage
    }, 500); // Duration of the slideOut animation
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Enter URL for the QR Code"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        
        {isLoggedIn && (
          <input
            type="text"
            placeholder="Enter title/name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        )}
        
        {isLoggedIn && (
          <input
            type="text"
            placeholder="Tag1, Tag2, etc."
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        )}
      
        {showGenerateButton && <button type="submit">Generate QR Code</button>}
      </form>
      
      {!isLoggedIn && submittedUrl && (
        <div className="qr-code-notloggedin">
          <QRCode
            value={submittedUrl}
            size={256}
            bgColor="#ffffff"
            fgColor="#000000"
            qrStyle="dots"
            eyeRadius={[
              { outer: 10, inner: 0 },
              { outer: 10, inner: 0 },
              { outer: 10, inner: 0 }
            ]}
            logoImage={qLogo}
            logoWidth={50}
          />
          <a href={submittedUrl} target="_blank">{submittedUrl}</a>
          {showMessage && (
            <div className={`message-to-user ${animateOut ? 'slide-out' : 'slide-in'}`}>
              <button className="close-button" onClick={handleCloseMessage}><FontAwesomeIcon icon="xmark" /></button>
              <p>Want to save your QR Code? <a href="/register">Register</a> as a user, to save and download all your QR Codes!</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default QRCodeForm;
