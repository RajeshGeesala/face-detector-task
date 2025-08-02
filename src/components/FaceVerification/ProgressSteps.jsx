import React from "react";

const ProgressSteps = ({ step, faceImage, docImage, result }) => {
  // Define steps and their status
  const steps = [
    { title: "Face Capture", description: "Capture your face using the webcam", status: step === "face" ? "in-progress" : faceImage ? "completed" : "pending" },
    { title: "Document Capture", description: "Capture your Aadhar/PAN card", status: step === "document" ? "in-progress" : docImage ? "completed" : "pending" },
    { title: "Face Matching", description: "Verify face match with document", status: step === "result" ? "in-progress" : result ? "completed" : "pending" },
  ];

  // Get icon based on status
  const getStatusIcon = (status) => {
    if (status === "completed") return <span style={{ color: "green" }}>✔</span>;
    if (status === "in-progress") return <span style={{ color: "#2563eb" }}>⏳</span>;
    return <span style={{ color: "gray" }}>○</span>;
  };

  return (
    <div style={{ backgroundColor: "white", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", width: "400px", padding: "20px", marginTop: "20px" }}>
      <h3 style={{ fontSize: "16px", marginBottom: "10px" }}>Verification Progress</h3>
      {steps.map((s, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < steps.length - 1 ? "1px solid #eee" : "none" }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {getStatusIcon(s.status)}
            <div>
              <p style={{ margin: 0, fontWeight: "bold", color: s.status === "completed" ? "green" : s.status === "in-progress" ? "#2563eb" : "#555" }}>{s.title}</p>
              <p style={{ margin: 0, fontSize: "12px", color: "#777" }}>{s.description}</p>
            </div>
          </div>
          {s.status === "completed" && (
            <span style={{ backgroundColor: "#d1fae5", color: "#065f46", fontSize: "11px", padding: "2px 6px", borderRadius: "12px" }}>Completed</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgressSteps;
