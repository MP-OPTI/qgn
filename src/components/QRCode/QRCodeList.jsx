// File: src/components/QRCode/QRCodeList.jsx

import React from 'react';
import QRCodeDisplay from './QRCodeDisplay';
import { useTransition, animated } from '@react-spring/web';

const QRCodeList = ({
  qrCodes,
  editingId,
  editingUrl,
  editingTitle,
  editingTags,
  setEditingUrl,
  setEditingTitle,
  setEditingTags,
  handleRemove,
  handleEdit,
  handleEditSubmit
}) => {
  const transitions = useTransition(qrCodes, {
    keys: qrCode => qrCode.id,
    from: { opacity: 0, transform: 'scale(0.5)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    leave: { opacity: 0, transform: 'scale(0.5)' },
    trail: 100, // delay between each item
  });

  return (
    <div className="qr-codes-grid">
      {transitions((style, qrCode) => (
        <animated.div style={style} className="qr-code-wrapper">
          <QRCodeDisplay
            key={qrCode.id}
            qrCode={qrCode}
            handleRemove={handleRemove}
            handleEdit={handleEdit}
            editingId={editingId}
            editingUrl={editingUrl}
            editingTitle={editingTitle}
            editingTags={editingTags}
            setEditingUrl={setEditingUrl}
            setEditingTitle={setEditingTitle}
            setEditingTags={setEditingTags}
            handleEditSubmit={handleEditSubmit}
          />
        </animated.div>
      ))}
    </div>
  );
};

export default QRCodeList;
