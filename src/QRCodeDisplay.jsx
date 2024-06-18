// QRCodeDisplay.jsx
import React from 'react';
import { QRCode } from 'react-qrcode-logo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './fontawesome';
import qLogo from './assets/q-logo.png';

const truncateUrl = (url) => {
  return url.length > 20 ? `${url.slice(0, 20)}...` : url;
};

const QRCodeDisplay = ({ qrCode, handleRemove, handleEdit, editingId, editingUrl, setEditingUrl, handleEditSubmit }) => (
  <div className="qr-code" key={qrCode.id}>
    <QRCode
      value={qrCode.value}
      size={300}
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
    
    {editingId === qrCode.id ? (
      <form onSubmit={handleEditSubmit}>
        <input
          type="text"
          value={editingUrl}
          onChange={(e) => setEditingUrl(e.target.value)}
        />
        <button type="submit"><FontAwesomeIcon icon="check" /></button>
        <button onClick={() => handleEdit(null, '')}><FontAwesomeIcon icon="xmark" /></button>
      </form>
    ) : (
      <a href={qrCode.value} target="_blank">{truncateUrl(qrCode.value)}</a>
    )}

    {editingId !== qrCode.id && (
      <>

        <button className="trash" onClick={() => handleRemove(qrCode.id)}><FontAwesomeIcon icon="trash" /></button>
        
        <button onClick={() => handleEdit(qrCode.id, qrCode.value)}>
          <FontAwesomeIcon icon="pen-to-square" />
        </button>
        
      </>
    )}
  </div>
);

export default QRCodeDisplay;
