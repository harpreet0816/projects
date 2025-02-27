import React, { useEffect, useState } from "react";

const Setting = ({ canvas }) => {
  const [selectedObject, setSelectedObject] = useState(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [diameter, setDiameter] = useState("");
  const [color, setColor] = useState("");

  useEffect(() => {
    if (canvas) {
      canvas.on("selection:created", (event) => {
        handleObjectSelection(event.selected[0]);
      });

      canvas.on("selection:updated", (event) => {
        // canvas.isDrawingMode = false;
        // canvas.selection = true;
        // canvas.forEachObject((obj) => (obj.selectable = true));
        // canvas.renderAll();
        handleObjectSelection(event.selected[0]);
      });

      canvas.on("selection:cleared", (event) => {
        setSelectedObject(null);
        clearSettings();
      });

      canvas.on("object:modified", (event) => {
        handleObjectSelection(event.target);
      });

      canvas.on("object:scaling", (event) => {
        handleObjectSelection(event.target);
      });
    }

    return () => {
      // second
    };
  }, [canvas]);

  const handleObjectSelection = (object) => {
    if (!object) return;
    setSelectedObject(object);
    if (object.type === "rect") {
      setWidth(Math.round(object.width * object.scaleX));
      setHeight(Math.round(object.height * object.scaleY));
      setDiameter("");
      setColor(object.fill);
    } else if (object.type === "circle") {
      setDiameter(Math.round(object.radius * 2 * object.scaleY));
      setColor(object.fill);
      setWidth("");
      setHeight("");
    }
  };

  const clearSettings = () => {
    setHeight("");
    setWidth("");
    setDiameter("");
    setColor("");
  };

  const handleWidthChange = (e) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = parseInt(value, 10);

    setWidth(intValue);

    if (selectedObject && selectedObject.type === "rect") {
      selectedObject.set({ width: intValue / selectedObject.scaleX });
      selectedObject.setCoords();
      canvas.renderAll();
    }
  };

  const handleHeightChange = (e) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = parseInt(value, 10);

    setHeight(intValue);
    // selectedObject.setControlsVisibility({
    //   mt: true, // Top middle
    //   mb: true, // Bottom middle
    //   ml: true, // Left middle
    //   mr: true, // Right middle
    //   tl: true, // Top left
    //   tr: true, // Top right
    //   bl: true, // Bottom left
    //   br: true, // Bottom right
    //   mtr: true, // Rotate
    // });
    if (selectedObject && selectedObject.type === "rect") {
      selectedObject.set({ height: intValue / selectedObject.scaleY });
      selectedObject.setCoords();
      canvas.renderAll();
    }
  };

  const handleColorChange = (e) => {
    const value = e.target.value;

    setColor(value);

    if (selectedObject) {
      selectedObject.set({ fill: value });
      canvas.renderAll();
    }
  };

  const handleDiameterChange = (e) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = parseInt(value, 10);

    setDiameter(intValue);

    if (selectedObject && selectedObject.type === "circle") {
      selectedObject.set({ radius: intValue / 2 / selectedObject.scaleX });
      selectedObject.setCoords();
      canvas.renderAll();
    }
  };

  if (!selectedObject) return;

  return (
    <div className="basic-[500px] w-[500px] bg-gray-100 backdrop-blur-md shadow-lg rounded-lg p-4 border border-gray-300">
      {selectedObject && (
        <>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Settings</h2>

          {selectedObject.type === "rect" && (
            <>
              <label className="flex flex-col text-sm font-medium text-gray-600">
                Width
                <input
                  type="number"
                  aria-label="width"
                  value={width}
                  onChange={handleWidthChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </label>

              <label className="flex flex-col text-sm font-medium text-gray-600">
                Height
                <input
                  type="number"
                  aria-label="height"
                  value={height}
                  onChange={handleHeightChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </label>

              <label className="flex flex-col text-sm font-medium text-gray-600">
                Color
                <input
                  type="color"
                  aria-label="color"
                  value={color}
                  onChange={handleColorChange}
                  className="mt-1 w-full h-10 cursor-pointer rounded-md border border-gray-300"
                />
              </label>
            </>
          )}

          {selectedObject.type === "circle" && (
            <>
              <label className="flex flex-col text-sm font-medium text-gray-600">
                Color
                <input
                  type="color"
                  aria-label="color"
                  value={color}
                  onChange={handleColorChange}
                  className="mt-1 w-full h-10 cursor-pointer rounded-md border border-gray-300"
                />
              </label>

              <label className="flex flex-col text-sm font-medium text-gray-600">
                Diameter
                <input
                  type="number"
                  aria-label="diameter"
                  value={diameter}
                  onChange={handleDiameterChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </label>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Setting;
