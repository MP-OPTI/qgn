//QRCodeList.jsx
import React from 'react';
import QRCodeDisplay from './QRCodeDisplay';

const QRCodeList = ({
  qrCodes,
  editingId,
  editingUrl,
  setEditingUrl,
  handleRemove,
  handleEdit,
  handleEditSubmit
}) => {
  return (
    <div className="qr-codes-grid">
      {qrCodes.length > 0 ? (
        qrCodes.map((qrCode) => (
          <QRCodeDisplay
            key={qrCode.id}
            qrCode={qrCode}
            handleRemove={handleRemove}
            handleEdit={handleEdit}
            editingId={editingId}
            editingUrl={editingUrl}
            setEditingUrl={setEditingUrl}
            handleEditSubmit={handleEditSubmit}
          />
        ))
      ) : (
        <p className="inittxt">No QR codes yet... <br></br><br></br>Start by creating some above. You can make a QR Code with any text or URL.</p>
      )}
    </div>
  );
};

export default QRCodeList;
