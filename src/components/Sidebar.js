// Sidebar.js
import React, { useState, useEffect } from 'react';
import shapesData from '../shapes.json';

const Sidebar = ({ onSelectShape }) => {
  const [shapes, setShapes] = useState([]);

  useEffect(() => {
    setShapes(shapesData);
  }, []);

  return (
    <div style={sidebarStyle}>
      <h2>Shapes List</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {shapes.map((shape) => (
          <li
            key={shape.id}
            style={listItemStyle}
            onClick={() => onSelectShape(shape.type)}
          >
            {shape.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

const sidebarStyle = {
  width: '200px',
  background: '#f4f4f4',
  padding: '10px',
  height: '100vh',
  overflowY: 'auto',
  borderRight: '1px solid #ccc',
};

const listItemStyle = {
  cursor: 'pointer',
  padding: '10px 0',
  borderBottom: '1px solid #ddd',
};


export default Sidebar;
