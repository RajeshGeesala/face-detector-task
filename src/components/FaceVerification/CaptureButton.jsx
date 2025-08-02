import React from "react";

const CaptureButton = ({ step, onCapture }) => {
  return (
    <button
      onClick={onCapture}
      style={{ marginTop: "15px", padding: "10px 20px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
    >
      {step === "face" ? "Capture Face" : "Capture Document"}
    </button>
  );
};

export default CaptureButton;
