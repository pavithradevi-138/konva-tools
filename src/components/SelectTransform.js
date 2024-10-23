// App.js
import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Transformer } from 'react-konva';
import Konva from 'konva';

const SelectTransform = () => {
  const stageRef = useRef();
  const trRef = useRef();
  const selectionRectRef = useRef();

  const [selectedShapes, setSelectedShapes] = useState([]);
  const [selecting, setSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  });

  const shapes = [
    { id: 'rect1', x: 60, y: 60, width: 100, height: 90, fill: 'red' },
    { id: 'rect2', x: 250, y: 100, width: 150, height: 90, fill: 'green' },
  ];

  const updateSelectionRect = () => {
    const { x1, y1, x2, y2 } = selectionBox;
    selectionRectRef.current.setAttrs({
      visible: true,
      x: Math.min(x1, x2),
      y: Math.min(y1, y2),
      width: Math.abs(x2 - x1),
      height: Math.abs(y2 - y1),
    });
  };

  const handleMouseDown = (e) => {
    if (e.target !== e.target.getStage()) return;
    const pos = e.target.getStage().getPointerPosition();
    setSelectionBox({ x1: pos.x, y1: pos.y, x2: pos.x, y2: pos.y });
    setSelecting(true);
  };

  const handleMouseMove = (e) => {
    if (!selecting) return;
    const pos = e.target.getStage().getPointerPosition();
    setSelectionBox((prev) => ({ ...prev, x2: pos.x, y2: pos.y }));
    updateSelectionRect();
  };

  const handleMouseUp = () => {
    setSelecting(false);
    selectionRectRef.current.visible(false);
    const box = selectionRectRef.current.getClientRect();
    const selected = shapes
      .map((shape) => stageRef.current.findOne(`#${shape.id}`))
      .filter((shape) => shape && Konva.Util.haveIntersection(box, shape.getClientRect()));
    trRef.current.nodes(selected);
    setSelectedShapes(selected);
  };

  const handleStageClick = (e) => {
    if (selectionRectRef.current.visible()) return;
    if (e.target === e.target.getStage()) {
      trRef.current.nodes([]);
      setSelectedShapes([]);
      return;
    }
    if (!e.target.hasName('rect')) return;

    const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
    const isSelected = selectedShapes.includes(e.target);

    if (metaPressed && isSelected) {
      const newSelection = selectedShapes.filter((node) => node !== e.target);
      trRef.current.nodes(newSelection);
      setSelectedShapes(newSelection);
    } else if (metaPressed) {
      const newSelection = [...selectedShapes, e.target];
      trRef.current.nodes(newSelection);
      setSelectedShapes(newSelection);
    } else {
      trRef.current.nodes([e.target]);
      setSelectedShapes([e.target]);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', () => {
      stageRef.current.width(window.innerWidth);
      stageRef.current.height(window.innerHeight);
    });
  }, []);

  return (
    <Stage
      ref={stageRef}
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleStageClick}
    >
      <Layer>
        {shapes.map((shape) => (
          <Rect
            key={shape.id}
            id={shape.id}
            x={shape.x}
            y={shape.y}
            width={shape.width}
            height={shape.height}
            fill={shape.fill}
            name="rect"
            draggable
          />
        ))}
        <Rect
          ref={selectionRectRef}
          fill="rgba(0,0,255,0.5)"
          visible={false}
          listening={false}
        />
        <Transformer ref={trRef} />
      </Layer>
    </Stage>
  );
};

export default SelectTransform;
