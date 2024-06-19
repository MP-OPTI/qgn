//QRCodeForm.jsx^
import React, { useState } from 'react';
import { QRCode } from 'react-qrcode-logo';
import qLogo from '../../assets/q-logo.png';
import { sanitizeInput } from '../../utils/sanitizeInput';

const QRCodeForm = ({ handleSubmit, showGenerateButton, isLoggedIn }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [submittedUrl, setSubmittedUrl] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    const sanitizedUrl = sanitizeInput(url);
    setSubmittedUrl(sanitizedUrl); // Store the sanitized URL to display the QR code
    handleSubmit(sanitizedUrl, title, tags);
    setUrl('');
    setTitle('');
    setTags('');
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
        </div>
      )}
    </>
  );
};

export default QRCodeForm;
