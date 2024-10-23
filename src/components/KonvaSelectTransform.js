import React, { useEffect, useRef } from 'react';
import Konva from 'konva';

const KonvaSelectTransform = () => {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const transformerRef = useRef(null);
  const selectionRectangleRef = useRef(null);
  
  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Initialize stage and layer
    const stage = new Konva.Stage({
      container: containerRef.current,
      width: width,
      height: height,
    });
    stageRef.current = stage;

    const layer = new Konva.Layer();
    stage.add(layer);

    // Create rectangles
    const rect1 = new Konva.Rect({
      x: 60,
      y: 60,
      width: 100,
      height: 90,
      fill: 'red',
      name: 'rect',
      draggable: true,
    });
    layer.add(rect1);

    const rect2 = new Konva.Rect({
      x: 250,
      y: 100,
      width: 150,
      height: 90,
      fill: 'green',
      name: 'rect',
      draggable: true,
    });
    layer.add(rect2);

    // Initialize transformer
    const transformer = new Konva.Transformer();
    layer.add(transformer);
    transformerRef.current = transformer;

    // Initialize selection rectangle
    const selectionRectangle = new Konva.Rect({
      fill: 'rgba(0,0,255,0.5)',
      visible: false,
      listening: false,
    });
    layer.add(selectionRectangle);
    selectionRectangleRef.current = selectionRectangle;

    layer.draw();

    let x1, y1, x2, y2;
    let selecting = false;

    stage.on('mousedown touchstart', (e) => {
      if (e.target !== stage) {
        return;
      }
      e.evt.preventDefault();
      x1 = stage.getPointerPosition().x;
      y1 = stage.getPointerPosition().y;
      x2 = stage.getPointerPosition().x;
      y2 = stage.getPointerPosition().y;

      selectionRectangle.width(0);
      selectionRectangle.height(0);
      selecting = true;
    });

    stage.on('mousemove touchmove', (e) => {
      if (!selecting) {
        return;
      }
      e.evt.preventDefault();
      x2 = stage.getPointerPosition().x;
      y2 = stage.getPointerPosition().y;

      selectionRectangle.setAttrs({
        visible: true,
        x: Math.min(x1, x2),
        y: Math.min(y1, y2),
        width: Math.abs(x2 - x1),
        height: Math.abs(y2 - y1),
      });
      layer.draw();
    });

    stage.on('mouseup touchend', (e) => {
      selecting = false;
      if (!selectionRectangle.visible()) {
        return;
      }
      e.evt.preventDefault();
      selectionRectangle.visible(false);
      const shapes = stage.find('.rect');
      const box = selectionRectangle.getClientRect();
      const selected = shapes.filter((shape) =>
        Konva.Util.haveIntersection(box, shape.getClientRect())
      );
      transformer.nodes(selected);
      layer.draw();
    });

    stage.on('click tap', function (e) {
      if (selectionRectangle.visible()) {
        return;
      }

      if (e.target === stage) {
        transformer.nodes([]);
        return;
      }

      if (!e.target.hasName('rect')) {
        return;
      }

      const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
      const isSelected = transformer.nodes().indexOf(e.target) >= 0;

      if (!metaPressed && !isSelected) {
        transformer.nodes([e.target]);
      } else if (metaPressed && isSelected) {
        const nodes = transformer.nodes().slice();
        nodes.splice(nodes.indexOf(e.target), 1);
        transformer.nodes(nodes);
      } else if (metaPressed && !isSelected) {
        const nodes = transformer.nodes().concat([e.target]);
        transformer.nodes(nodes);
      }
    });

    return () => {
      stage.destroy(); // Clean up the stage on component unmount
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />;
};

export default KonvaSelectTransform;
