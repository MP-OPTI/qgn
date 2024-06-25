// src/components/SearchBar.jsx
import React from 'react';

const SearchBar = ({ searchQuery, setSearchQuery, qrType, setQrType }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search by URL, title, or tags"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <select value={qrType} onChange={(e) => setQrType(e.target.value)}>
        <option value="">All Types</option>
        <option value="URL">URL</option>
        <option value="WiFi">WiFi</option>
        <option value="Password">Password</option>
      </select>
    </div>
  );
};

export default SearchBar;
