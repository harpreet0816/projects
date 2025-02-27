import { Line } from "fabric";
import React from "react";

export const clearGuidelines = (canvas) => {
  const objects = canvas.getObjects("line");
  objects.forEach((obj) => {
    if (
      (obj.id && obj.id.startsWith("vertical-")) ||
      obj.id.startsWith("horizontal-")
    ) {
      canvas.remove(obj);
    }
  });
  canvas.renderAll();
};

export const createVerticalGuideline = (canvas, x, id) => {
  return new Line([x, 0, x, canvas.height], {
    id,
    stroke: "red",
    strokeWidth: 5,
    selectable: false,
    evented: false,
    strokeDashArray: [5, 5],
    opacity: 0.8,
  });
};

export const createHorizontalGuideline = (canvas, y, id) => {
  return new Line([0, y, canvas.width, y], {
    id,
    stroke: "red",
    strokeWidth: 5,
    selectable: false,
    evented: false,
    strokeDashArray: [5, 5],
    opacity: 0.8,
  });
};

export const guidelineExists = (canvas, id) => {
  const objects = canvas.getObjects("line");
  return objects.some((obj) => obj.id === id);
};

const snappingHelper = ({ canvas, obj, guidelines, setGuidelines }) => {
  const snappingDistance = 10;

  const canvasWidth = canvas.width;
  const canHeight = canvas.height;

  const left = obj.left;
  const top = obj.top;

  const right = left + obj.width * obj.scaleX;
  const bottom = top + obj.height * obj.scaleY;

  const centerX = left + (obj.width * obj.scaleX) / 2;
  const centerY = top + (obj.height * obj.scaleY) / 2;

  let newGuidelines = [];
  console.clear();
  console.table({
    "Canvas Width": canvasWidth,
    "Canvas Height": canHeight,
    "Object Left": left,
    "Object Top": top,
    "Object Right": right,
    "Object Bottom": bottom,
    "Object Center X": centerX,
    "Object Center Y": centerY,
  });
  clearGuidelines(canvas);
  let snapped = false;

  // left side line
  if (Math.abs(left) < snappingDistance) {
    obj.set({ left: 0 });
    if (!guidelineExists(canvas, "vertical-left")) {
      const line = createVerticalGuideline(canvas, 0, "vertical-left");
      newGuidelines.push(line);
      canvas.add(line);
    }
    snapped = true;
  }

  // top side line
  if (Math.abs(top) < snappingDistance) {
    obj.set({ top: 0 });
    if (!guidelineExists(canvas, "horizontal-top")) {
      const line = createHorizontalGuideline(canvas, 0, "horizontal-top");
      newGuidelines.push(line);
      canvas.add(line);
    }
    snapped = true;
  }

  // right side line
  if (Math.abs(right - canvas.width) < snappingDistance) {
    obj.set({ left: canvasWidth - obj.width * obj.scaleX });
    if (!guidelineExists(canvas, "vertical-right")) {
      const line = createVerticalGuideline(
        canvas,
        canvas.width,
        "vertical-right"
      );
      newGuidelines.push(line);
      canvas.add(line);
    }
    snapped = true;
  }

  // bottom side line
  if (Math.abs(bottom - canvas.height) < snappingDistance) {
    obj.set({ top: canHeight - obj.height * obj.scaleY });
    if (!guidelineExists(canvas, "horizontal-bottom")) {
      const line = createHorizontalGuideline(
        canvas,
        canvas.height,
        "horizontal-bottom"
      );
      newGuidelines.push(line);
      canvas.add(line);
    }
    snapped = true;
  }

  // centerx side line
  if (Math.abs(centerX - canvasWidth / 2) < snappingDistance) {
    obj.set({ left: canvasWidth / 2 - (obj.width * obj.scaleX) / 2 });
    if (!guidelineExists(canvas, "vertical-center")) {
      const line = createVerticalGuideline(
        canvas,
        canvasWidth / 2,
        "vertical-center"
      );
      newGuidelines.push(line);
      canvas.add(line);
    }
    snapped = true;
  }

  // centerY side line
  if (Math.abs(centerY - canvas.height / 2) < snappingDistance) {
    obj.set({ top: canHeight / 2 - (obj.height * obj.scaleY) / 2 });
    if (!guidelineExists(canvas, "horizontal-center")) {
      const line = createHorizontalGuideline(
        canvas,
        canHeight / 2,
        "horizontal-center"
      );
      newGuidelines.push(line);
      canvas.add(line);
    }
    snapped = true;
  }
};

export default snappingHelper;
