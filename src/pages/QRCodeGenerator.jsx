import React from 'react';
import QRCodeForm from '../components/QRCode/QRCodeForm';
import QRCodeList from '../components/QRCode/QRCodeList';
import { useAuth } from '../hooks/useAuth';
import { useQRCode } from '../hooks/useQRCode';

const QRCodeGenerator = () => {
  const { user } = useAuth();
  const {
    qrCodes,
    loading,
    editingId,
    editingUrl,
    setEditingUrl,
    handleSubmit,
    handleRemove,
    handleEdit,
    handleEditSubmit
  } = useQRCode(user);

  return (
    <div className="qr-container">
      <div className="qr-generator">
        <QRCodeForm handleSubmit={handleSubmit} showGenerateButton={true} isLoggedIn={!!user} />
      </div>
      <div className="qr-codes">
        {user && (
          <div>
            {loading ? (
              <p>Loading QR codes...</p>
            ) : (
              <QRCodeList
                qrCodes={qrCodes}
                editingId={editingId}
                editingUrl={editingUrl}
                setEditingUrl={setEditingUrl}
                handleRemove={handleRemove}
                handleEdit={handleEdit}
                handleEditSubmit={handleEditSubmit}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QRCodeGenerator;
