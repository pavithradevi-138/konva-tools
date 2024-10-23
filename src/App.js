// App.js
import React, { useState, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Shapes from './components/Shapes';

const App = () => {
  const [shapes, setShapes] = useState([]);
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionRect, setSelectionRect] = useState(null);

  const handleSelectShape = (type) => {
    const centerX = (window.innerWidth - 200) / 2; // Center of canvas horizontally
    const centerY = window.innerHeight / 2; // Center of canvas vertically

    const newShape = {
      id: shapes.length + 1,
      type,
      x: centerX,
      y: centerY,
      rotation: 0,
    };

    setShapes((prevShapes) => [...prevShapes, newShape]);
  };

  const handleStageClick = (e) => {
    // Deselect all shapes when clicking on the empty area
    if (e.target === e.target.getStage()) {
      setSelectedShapeId(null);
    }
  };

  const handleStageDoubleClick = (e) => {
    // Deselect shape on double-clicking it
    setSelectedShapeId(null);
  };

  const handleSelectShapeClick = (shape) => {
    setSelectedShapeId(shape.id);
  };

  const handleMouseDown = (e) => {
    if (e.evt.shiftKey || e.evt.ctrlKey) {
      setIsSelecting(true);
      const { x, y } = e.target.getStage().getPointerPosition();
      setSelectionRect({ startX: x, startY: y, width: 0, height: 0 });
    }
  };

  const handleMouseMove = (e) => {
    if (!isSelecting) return;

    const { x, y } = e.target.getStage().getPointerPosition();
    setSelectionRect((prev) => ({
      ...prev,
      width: x - prev.startX,
      height: y - prev.startY,
    }));
  };

  const handleMouseUp = () => {
    if (!selectionRect) {
      setIsSelecting(false);
      return;
    }

    const { startX, startY, width, height } = selectionRect;
    setIsSelecting(false);

    if (width && height) {
      const newSelection = shapes.filter((shape) => {
        const shapeX = shape.x;
        const shapeY = shape.y;
        return (
          shapeX > Math.min(startX, startX + width) &&
          shapeX < Math.max(startX, startX + width) &&
          shapeY > Math.min(startY, startY + height) &&
          shapeY < Math.max(startY, startY + height)
        );
      });
      if (newSelection.length > 0) {
        setSelectedShapeId(newSelection[newSelection.length - 1].id);
      }
    }

    setSelectionRect(null);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar onSelectShape={handleSelectShape} />
      <Shapes
        shapes={shapes}
        setShapes={setShapes}
        selectedShapeId={selectedShapeId}
        onSelectShapeClick={handleSelectShapeClick}
        selectionRect={selectionRect}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onStageClick={handleStageClick} // Pass stage click handler
        onStageDoubleClick={handleStageDoubleClick} // Pass double click handler
      />
    </div>
  );
};

export default App;
