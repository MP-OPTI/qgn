// File: src/components/Checkbox/CustomCheckbox.jsx
import React from 'react';

const CustomCheckbox = ({ checked, onChange }) => {
  return (
    <label className="custom-checkbox">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="checkmark"></span>
    </label>
  );
};

export default CustomCheckbox;
