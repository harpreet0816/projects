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
      canvas.renderAll();
    }
  };

  const handleHeightChange = (e) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = parseInt(value, 10);

    setHeight(intValue);

    if (selectedObject && selectedObject.type === "rect") {
      selectedObject.set({ height: intValue / selectedObject.scaleY });
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
      canvas.renderAll();
    }
  };
  return (
    <div style={{
    position: 'fixed',
    width: '500px',
    top: '20px',
    right: '0',
    display: 'flex',
    background: '#b7b7c7',
    justifyContent: 'space-between',
    alignItems: 'center',
}}>
      {selectedObject && selectedObject.type === "rect" && (
        <>
        <h2>Settings</h2>
          <input
            type="number"
            aria-label="width"
            value={width}
            onChange={handleWidthChange}
          />
          <input
            type="number"
            aria-label="height"
            value={height}
            onChange={handleHeightChange}
          />
          <input
            type="color"
            aria-label="color"
            value={color}
            onChange={handleColorChange}
          />
        </>
      )}
      {selectedObject && selectedObject.type === "circle" && (
        <>
        <h2>Settings</h2>
          <input
            type="color"
            aria-label="color"
            value={color}
            onChange={handleColorChange}
          />
          <input
            type="number"
            aria-label="diameter"
            value={diameter}
            onChange={handleDiameterChange}
          />
        </>
      )}
    </div>
  );
};

export default Setting;
