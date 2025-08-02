import React from "react";

const Webcam = ({ videoRef }) => {
  return (
    <div style={{ marginTop: "20px" }}>
      {/* Webcam preview */}
      <video ref={videoRef} autoPlay muted playsInline style={{ width: "400px", border: "2px solid #ddd", borderRadius: "10px" }} />
    </div>
  );
};

export default Webcam;
