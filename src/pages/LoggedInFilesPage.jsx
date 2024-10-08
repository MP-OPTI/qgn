// src/pages/FilesPage.jsx
import React, { useState } from 'react';
import UploadFileForm from '../components/UploadFileForm';
import QRCodeList from '../components/QRCode/QRCodeList';
import SearchBar from '../components/SearchBar';
import FilterIcons from '../components/Filter/FilterIcons';
import { useAuth } from '../hooks/useAuth';
import { useQRCode } from '../hooks/useQRCode';

const FilesPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [qrType] = useState('File');  // Set to 'File' to filter only file-based QR codes
  const [filter, setFilter] = useState('newest');
  const {
    qrCodes,
    loading,
    editingId,
    editingUrl,
    editingTitle,
    editingTags,
    setEditingUrl,
    setEditingTitle,
    setEditingTags,
    handleSubmit,
    handleRemove,
    handleEdit,
    handleEditSubmit
  } = useQRCode(user);

  const filteredQRCodes = qrCodes
    .filter(qrCode => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearchQuery = (
        qrCode.value.toLowerCase().includes(searchLower) ||
        qrCode.title.toLowerCase().includes(searchLower) ||
        (qrCode.tags || []).some(tag => tag.toLowerCase().includes(searchLower))
      );
      const matchesQrType = qrType === '' || qrCode.type === qrType;
      return matchesSearchQuery && matchesQrType;
    })
    .sort((a, b) => {
      if (filter === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (filter === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (filter === 'az') {
        return a.title.localeCompare(b.title);
      } else if (filter === 'za') {
        return b.title.localeCompare(a.title);
      } else if (filter === 'mostTagged') {
        return (b.tags?.length || 0) - (a.tags?.length || 0);
      } else if (filter === 'leastTagged') {
        return (a.tags?.length || 0) - (b.tags?.length || 0);
      } else if (filter === 'recentlyUpdated') {
        return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
      }
      return 0;
    });

  return (
    <div className="qr-user">
      <div className="qr-generator">
        <UploadFileForm handleSubmit={handleSubmit} />
      </div>

      <div className="qr-userhero">
        <h2>#1 Upload your file</h2>
        <h2>#2 Get QR Code</h2>
        <h2>#3 Store them for later</h2>
        <h4>* You can use titles and tags to better find your QR codes in the future.</h4>
      </div>

      <div className="qr-search">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          qrType={qrType}
        />
        <FilterIcons filter={filter} setFilter={setFilter} />
      </div>
      
      <div className="qr-codes">
        {user && (
          <div>
            {loading ? (
              <p>Loading QR codes...</p>
            ) : (
              <QRCodeList
                qrCodes={filteredQRCodes}
                editingId={editingId}
                editingUrl={editingUrl}
                editingTitle={editingTitle}
                editingTags={editingTags}
                setEditingUrl={setEditingUrl}
                setEditingTitle={setEditingTitle}
                setEditingTags={setEditingTags}
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

export default FilesPage;
