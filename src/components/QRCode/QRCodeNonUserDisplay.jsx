// File: src/components/QRCode/QRCodeNonUserDisplay.jsx
import React from 'react';
import { QRCode } from 'react-qrcode-logo';
import qLogo from '../../assets/q-logo.png';

const QRCodeNonUserDisplay = ({ submittedUrl }) => {

  return (
    <div style={{ textAlign: 'center' }}>
        <>
          <QRCode
            value={submittedUrl}
            size={256}
            bgColor="#ffffff"
            fgColor="#000000"
            qrStyle="dots"
            eyeRadius={[
              { outer: 10, inner: 0 },
              { outer: 10, inner: 0 },
              { outer: 10, inner: 0 },
            ]}
            logoImage={qLogo}
            logoWidth={50}
          />
          <a href={submittedUrl} target="_blank" rel="noopener noreferrer">
            {submittedUrl}
          </a>
        </>
    </div>
  );
};

export default QRCodeNonUserDisplay;
