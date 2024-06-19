// QRCodeDisplay.jsx
import React from 'react';
import { QRCode } from 'react-qrcode-logo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import qLogo from '../../assets/q-logo.png';
import useDownloadQRCode from '../../hooks/useDownloadQRCode';

const truncateUrl = (url) => {
  return url.length > 20 ? `${url.slice(0, 20)}...` : url;
};

const QRCodeDisplay = ({
  qrCode,
  handleRemove,
  handleEdit,
  editingId,
  editingUrl,
  editingTitle,
  editingTags,
  setEditingUrl,
  setEditingTitle,
  setEditingTags,
  handleEditSubmit
}) => {
  const { qrRef, downloadQRCode } = useDownloadQRCode();

  return (
    <div className="qr-code" key={qrCode.id} ref={qrRef} style={{ position: 'relative' }}>
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
      
      <h3>{qrCode.title}</h3>

      <a href={qrCode.value} target="_blank">{truncateUrl(qrCode.value)}</a>
      
      <div className="tags-container">
        <div className="tag-icon"><FontAwesomeIcon icon="tag" /></div>
        {(qrCode.tags || []).map((tag, index) => (
          <div key={index} className="tag">{tag}</div>
        ))}
      </div>

      {editingId === qrCode.id && (
        <form onSubmit={handleEditSubmit} className="edit-qr-code">
          <label>Title</label>
          <input
            type="text"
            value={editingTitle}
            onChange={(e) => setEditingTitle(e.target.value)}
            placeholder="Title"
            style={{ marginBottom: '10px' }}
          />
          <label>QR Code</label>
          <input
            type="text"
            value={editingUrl}
            onChange={(e) => setEditingUrl(e.target.value)}
            placeholder="URL"
            style={{ marginBottom: '10px' }}
          />
          <label>Tags</label>
          <input
            type="text"
            value={editingTags}
            onChange={(e) => setEditingTags(e.target.value)}
            placeholder="Tags (comma separated)"
            style={{ marginBottom: '10px' }}
          />
          <div>
            <button className="green" type="submit" style={{ marginRight: '5px' }}><FontAwesomeIcon icon="check" /></button>
            <button className="black" onClick={() => handleEdit(null, '', '', '')}><FontAwesomeIcon icon="xmark" /></button>
          </div>
        </form>
      )}

      <>
        <button className="trash" onClick={() => handleRemove(qrCode.id)}><FontAwesomeIcon icon="trash" /></button>
        <button onClick={() => handleEdit(qrCode.id, qrCode.value, qrCode.title, qrCode.tags || [])}>
          <FontAwesomeIcon icon="pen-to-square" />
        </button>
        <button onClick={() => downloadQRCode(qrCode)}>
          <FontAwesomeIcon icon="download" />
        </button>
      </>

    </div>
  );
};

export default QRCodeDisplay;