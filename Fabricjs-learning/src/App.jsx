import React, { useEffect, useState } from "react";
import * as fabric from "fabric";
import Setting from "./Setting";

const App = () => {
  const [fabricCanvas, setFabricCanvas] = useState(null);

  const enableDrawingMode = (brushType) => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = true;
    if (brushType === "pencil") {
      fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
    } else if (brushType === "spray") {
      fabricCanvas.freeDrawingBrush = new fabric.SprayBrush(fabricCanvas);
    }

    fabricCanvas.freeDrawingBrush.color = "#ff1000";
    fabricCanvas.freeDrawingBrush.width = 5; 

    // Disable object selection while drawing
    fabricCanvas.selection = false;
    fabricCanvas.forEachObject((obj) => (obj.selectable = false));
  };

  const addFabricElem = (type) => {
    if (!fabricCanvas) return;

    if (type === "circle") {
      const circle = new fabric.Circle({
        radius: 50,
        fill: "#ff1000",
        left: 100,
        top: 100,
        selectable: true,
      });
      fabricCanvas.add(circle);
    } else if (type === "rect") {
      const rect = new fabric.Rect({
        width: 50,
        height: 50,
        left: 100,
        top: 100,
        fill: "#ff1000",
        selectable: true,
      });
      fabricCanvas.add(rect);
    } else if (type === "brush") {
      enableDrawingMode("pencil");
    } else if (type === "spray") {
      enableDrawingMode("spray");
    }
  };

  useEffect(() => {
    const canvas = new fabric.Canvas("canvas", {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: "gray",
    });
    canvas.renderAll();
    setFabricCanvas(canvas);

    // Attach event listeners using Fabric.js
    const allowedTypes = new Set(["rect", "circle", "group", "path"]);

    canvas.on("mouse:down", ({ target }) => {
      if (target && allowedTypes.has(target.type)) return;

      console.log(
        "Drawing mode enabled on:",
        target ? target.type : "empty canvas"
      );
      canvas.isDrawingMode = true;
    });

    canvas.on("mouse:up", () => {
      if (!canvas.isDrawingMode) return;

      canvas.isDrawingMode = false;
      canvas.selection = true;
      canvas.forEachObject((obj) => (obj.selectable = true));
      canvas.renderAll();
    });

    return () => {
      canvas.dispose(); // Clean up on unmount
    };
  }, []);

  return (
    <>
      <h1>Fabric.js Canvas</h1>
      <button onClick={() => addFabricElem("circle")}>Add Circle</button>
      <button onClick={() => addFabricElem("rect")}>Add Rect</button>
      <button onClick={() => addFabricElem("brush")}>Freehand Brush</button>
      <button onClick={() => addFabricElem("spray")}>Spray Brush</button>
      <Setting canvas={fabricCanvas} />
      <canvas id="canvas"></canvas>
    </>
  );
};

export default App;
