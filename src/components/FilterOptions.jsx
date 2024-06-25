// File: src/components/FilterOptions.jsx
import React from 'react';

const FilterOptions = ({ filter, setFilter }) => {
  return (
    <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ marginLeft: '20px', padding: '10px' }}>
      <option value="newest">Newest added</option>
      <option value="oldest">Oldest added</option>
      <option value="az">A-Z</option>
      <option value="za">Z-A</option>
      <option value="mostTagged">Most Tagged</option>
      <option value="leastTagged">Least Tagged</option>
      <option value="recentlyUpdated">Recently Updated</option>
    </select>
  );
};

export default FilterOptions;
