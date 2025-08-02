import React from "react";

const ResultMessage = ({ result }) => {
  if (!result) return null;
  return (
    <p style={{ marginTop: "15px", fontWeight: "bold", color: result.includes("✅") ? "green" : "red" }}>
      {result}
    </p>
  );
};

export default ResultMessage;
