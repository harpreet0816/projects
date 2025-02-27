import React, { useEffect, useState } from "react";
import * as fabric from "fabric";
import Setting from "./Setting";
import CanvasSetting from "./CanvasSetting";
import handleObjectMoving, {
  clearGuidelines,
} from "./components/snappingHelper";

const App = () => {
  const [fabricCanvas, setFabricCanvas] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [guidelines, setGuidelines] = useState([]);

  const enableDrawingMode = (brushType) => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = true;
    if (brushType === "pencil") {
      fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
    } else if (brushType === "spray") {
      fabricCanvas.freeDrawingBrush = new fabric.SprayBrush(fabricCanvas);
    }

    setDrawing(true);
    fabricCanvas.freeDrawingCursor = "auto";

    fabricCanvas.freeDrawingBrush.color = "#ff1000";
    fabricCanvas.freeDrawingBrush.width = 5;
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
    if (!fabricCanvas) return;

    const canvas = fabricCanvas;

    // Attach event listeners using Fabric.js
    const allowedTypes = new Set(["rect", "circle", "group", "path"]);

    // Remove previous event listeners
    canvas.off("mouse:down");
    canvas.off("mouse:up");

    canvas.on("mouse:down", ({ target }) => {
      console.log(drawing, "--");
      // if (target && allowedTypes.has(target.type)) return;
      if (drawing) {
        canvas.isDrawingMode = true;

        // Disable object selection while drawing
        fabricCanvas.selection = false;
        fabricCanvas.forEachObject((obj) => (obj.selectable = false));
      }
    });

    canvas.on("mouse:up", () => {
      // if (!canvas.isDrawingMode) return;

      if (drawing) {
        setDrawing(false);
        canvas.isDrawingMode = false;
        canvas.selection = true;
        canvas.forEachObject((obj) => (obj.selectable = true));
        canvas.renderAll();
      }
    });

    return () => {
      canvas.off("mouse:down");
      canvas.off("mouse:up");
    };
  }, [drawing]);

  useEffect(() => {
    const canvas = new fabric.Canvas("canvas", {
      width: 500,
      height: 500,
      backgroundColor: "gray",
    });
    canvas.renderAll();
    setFabricCanvas(canvas);

    console.log(canvas.width, "--");
    canvas.on("object:moving", (event) => {
      const obj = event.target;
      if (!obj) return;

      obj.setCoords();

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Ensure object stays within bounds
      if (obj.left < 0) obj.left = 0;
      if (obj.top < 0) obj.top = 0;
      if (obj.left + obj.width * obj.scaleX > canvasWidth)
        obj.left = canvasWidth - obj.width * obj.scaleX;
      if (obj.top + obj.height * obj.scaleY > canvasHeight)
        obj.top = canvasHeight - obj.height * obj.scaleY;
      handleObjectMoving({
        canvas,
        obj: event.target,
        guidelines,
        setGuidelines,
      });
    });

    canvas.on("object:modified", (event) => {
      clearGuidelines(canvas, guidelines, setGuidelines);
    });

    return () => {
      canvas.dispose(); // Clean up on unmount
    };
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Fabric.js Canvas
      </h1>

      <div className="flex gap-3 mb-4 justify-center">
        <button
          onClick={() => addFabricElem("circle")}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Circle
        </button>

        <button
          onClick={() => addFabricElem("rect")}
          className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Add Rect
        </button>

        <button
          onClick={() => addFabricElem("brush")}
          className="px-4 py-2 bg-purple-600 text-white font-medium rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Freehand Brush
        </button>

        <button
          onClick={() => addFabricElem("spray")}
          className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Spray Brush
        </button>
      </div>

      <div className="flex flex-row justify-between gap-4">
        <CanvasSetting canvas={fabricCanvas} />
        <Setting canvas={fabricCanvas} />
      </div>

      <div className="flex justify-center mt-5">
        <canvas
          id="canvas"
          className="border border-gray-300 shadow-lg rounded-lg"
        ></canvas>
      </div>
    </>
  );
};

export default App;
