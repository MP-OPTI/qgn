// src/components/QRCode/QRCodeForm.jsx
import React, { useState } from 'react';
import { sanitizeInput } from '../../utils/sanitizeInput';

const QRCodeForm = ({ handleSubmit, isLoggedIn }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    const sanitizedUrl = sanitizeInput(url);
    handleSubmit(sanitizedUrl, title, tags, 'URL');
    setUrl('');
    setTitle('');
    setTags('');
  };

  return (
    <form onSubmit={onSubmit}>

      {!isLoggedIn && <h3>Insert your URL into the field below</h3>}
      
      <input
        type="text"
        placeholder="Enter URL for the QR Code"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      {isLoggedIn && (
        <>
          <input
            type="text"
            placeholder="Enter title/name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Tag1, Tag2, etc."
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </>
      )}
      <button type="submit">Generate QR Code</button>
    </form>
  );
};

export default QRCodeForm;
