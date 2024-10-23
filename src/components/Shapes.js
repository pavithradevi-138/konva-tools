// Shapes.js
import React, {useState, useRef} from 'react';
import { Stage, Layer, Rect, Circle, Ellipse, Line, RegularPolygon, Star, Transformer } from 'react-konva';

const Shapes = ({
  shapes,
  setShapes,
  selectedShapeId,
  onSelectShapeClick,
  selectionRect,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onStageClick,
  onStageDoubleClick, // Receive double click handler
}) => {
  const shapeRefs = useRef({}); // Create a ref to store shapes

  const renderShape = (shape) => {
    const isSelected = shape.id === selectedShapeId;
    const shapeProps = {
      key: shape.id,
      x: shape.x,
      y: shape.y,
      rotation: shape.rotation,
      draggable: true,
      ref: (node) => {
        // Store the shape reference
        shapeRefs.current[shape.id] = node;
      },
      onClick: () => onSelectShapeClick(shape),
      onDoubleClick: () => onSelectShapeClick(shape), // Handle double click
      onDragEnd: (e) => {
        shape.x = e.target.x();
        shape.y = e.target.y();
      },
      onTransformEnd: (e) => {
        const node = e.target;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        // Update shape size and rotation
        const newShape = {
          ...shape,
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          scaleX: scaleX,
          scaleY: scaleY,
        };

        // Update shapes state
        setShapes((prevShapes) =>
          prevShapes.map((s) => (s.id === shape.id ? newShape : s))
        );

        // Reset the scale of the node
        node.scaleX(1);
        node.scaleY(1);
      },
    };

    switch (shape.type) {
      case 'Rect':
        return <Rect {...shapeProps} width={100} height={80} fill="blue" stroke="black" />;
      case 'Circle':
        return <Circle {...shapeProps} radius={30} fill="green" stroke="black" />;
      case 'Ellipse':
        return <Ellipse {...shapeProps} radiusX={70} radiusY={40} fill="purple" stroke="black" />;
      case 'Line':
        return <Line {...shapeProps} points={[shape.x - 50, shape.y, shape.x, shape.y + 50, shape.x + 50, shape.y]} stroke="red" strokeWidth={2} />;
      case 'RegularPolygon':
        return <RegularPolygon {...shapeProps} sides={5} radius={40} fill="orange" />;
      case 'Star':
        return <Star {...shapeProps} numPoints={5} innerRadius={20} outerRadius={40} fill="yellow" />;
      default:
        return null;
    }
  };

  const renderTransformer = () => {
    if (selectedShapeId) {
      const selectedShapeNode = shapeRefs.current[selectedShapeId];
      return (
        <Transformer
          key="transformer"
          nodes={[selectedShapeNode]} // Pass the actual Konva node reference
          centeredScaling
          boundBoxFunc={(oldBox, newBox) => {
            // Limit the scaling
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      );
    }
    return null;
  };

  const renderSelectionRect = () => {
    if (!selectionRect) return null;

    const { startX, startY, width, height } = selectionRect;
    return (
      <Rect
        x={Math.min(startX, startX + width)}
        y={Math.min(startY, startY + height)}
        width={Math.abs(width)}
        height={Math.abs(height)}
        fill="rgba(0, 0, 255, 0.3)"
        stroke="blue"
        strokeWidth={1}
      />
    );
  };

  return (
    <Stage
      width={window.innerWidth - 200}
      height={window.innerHeight}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onClick={onStageClick} // Handle stage click
      onDblClick={onStageDoubleClick} // Handle double-click
    >
      <Layer>
        {shapes.map((shape) => renderShape(shape))}
        {renderTransformer()}
        {renderSelectionRect()}
      </Layer>
    </Stage>
  );
};





export default Shapes;
