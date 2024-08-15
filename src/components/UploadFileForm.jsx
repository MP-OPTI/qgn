// src/components/UploadFileForm.jsx
import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../services/firebase';

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB in bytes

const UploadFileForm = ({ handleSubmit }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size > MAX_FILE_SIZE) {
      setError('File size exceeds 1MB. Please choose a smaller file.');
      setFile(null);
    } else {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (file) {
      const storageRef = ref(storage, `uploads/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      handleSubmit(downloadURL, file.name);
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <input type="file" onChange={handleFileChange} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" disabled={!file}>Upload and Generate QR Code</button>
    </form>
  );
};

export default UploadFileForm;
