const CaptureButton = ({ step, onCapture }) => (
  <button
    onClick={onCapture}
    style={{
      marginTop: 20,
      padding: "10px 20px",
      backgroundColor: "#2563eb",
      color: "#fff",
      border: "none",
      borderRadius: 6,
      cursor: "pointer",
    }}
  >
    {step === "face" ? "Capture Face" : "Capture Document"}
  </button>
);

export default CaptureButton;
