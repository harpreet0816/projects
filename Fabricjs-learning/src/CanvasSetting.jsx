import React, { useEffect, useState } from "react";

const CanvasSetting = ({ canvas }) => {
  const [canvasWidth, setCanvasWidth] = useState(500);
  const [canvasHeight, setCanvasHeight] = useState(500);

  useEffect(() => {
    if (canvas) {
      canvas.setWidth(canvasWidth);
      canvas.setHeight(canvasHeight);
      canvas.renderAll();
    }
  }, [canvasWidth, canvasHeight]);

  const handleWidthChange = (e) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = parseInt(value);
    if (intValue > 0) {
      setCanvasWidth(intValue);
    }
  };
  const handleheightChange = (e) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = parseInt(value);
    if (intValue > 0) {
      setCanvasHeight(intValue);
    }
  };

  return <>
<div className="basis-1/3 max-w-[500px] max-h-[175px] overflow-hidden flex flex-col gap-4 p-4 bg-gray-100 rounded-lg backdrop-blur-md shadow-lg border border-gray-300 mb-5">
  <label className="flex flex-col text-sm font-medium text-gray-700">
    Canvas Width
    <input
      type="number"
      value={canvasWidth}
      onChange={handleWidthChange}
      className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
    />
  </label>

  <label className="flex flex-col text-sm font-medium text-gray-700">
    Canvas Height
    <input
      type="number"
      value={canvasHeight}
      onChange={handleheightChange}
      className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
    />
  </label>
</div>

  </>;
};

export default CanvasSetting;
