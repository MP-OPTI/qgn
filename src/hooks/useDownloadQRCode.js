//useDownloadQRCode.js
import { useRef } from 'react';

const useDownloadQRCode = () => {
  const qrRef = useRef();

  const downloadQRCode = (qrCode) => {
    const canvas = qrRef.current.querySelector('canvas');
    const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    let downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `${qrCode.title || qrCode.value}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return { qrRef, downloadQRCode };
};

export default useDownloadQRCode;
