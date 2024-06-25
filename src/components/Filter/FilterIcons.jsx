// File: src/components/FilterIcons.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortAlphaDown, faSortAlphaUp, faClock, faTags, faTag } from '@fortawesome/free-solid-svg-icons';

const FilterIcons = ({ filter, setFilter }) => {
  return (
    <div className="filter">
      <FontAwesomeIcon
        icon={faClock}
        size="2x"
        title="Newest Added"
        onClick={() => setFilter('newest')}
        style={{ cursor: 'pointer', marginRight: '10px', color: filter === 'newest' ? 'yellow' : 'white' }}
      />
      <FontAwesomeIcon
        icon={faSortAlphaDown}
        size="2x"
        title="A-Z"
        onClick={() => setFilter('az')}
        style={{ cursor: 'pointer', marginRight: '10px', color: filter === 'az' ? 'yellow' : 'white' }}
      />
      <FontAwesomeIcon
        icon={faSortAlphaUp}
        size="2x"
        title="Z-A"
        onClick={() => setFilter('za')}
        style={{ cursor: 'pointer', marginRight: '10px', color: filter === 'za' ? 'yellow' : 'white' }}
      />
      <FontAwesomeIcon
        icon={faTags}
        size="2x"
        title="Most Tagged"
        onClick={() => setFilter('mostTagged')}
        style={{ cursor: 'pointer', marginRight: '10px', color: filter === 'mostTagged' ? 'yellow' : 'white' }}
      />
      <FontAwesomeIcon
        icon={faTag}
        size="2x"
        title="Least Tagged"
        onClick={() => setFilter('leastTagged')}
        style={{ cursor: 'pointer', marginRight: '10px', color: filter === 'leastTagged' ? 'yellow' : 'white' }}
      />
    </div>
  );
};

export default FilterIcons;
