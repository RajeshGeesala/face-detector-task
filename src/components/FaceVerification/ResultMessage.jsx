const ResultMessage = ({ result }) => {
  if (!result) return null;
  return (
    <p style={{ color: result.includes("✅") ? "green" : "red", fontWeight: "bold", marginTop: 20 }}>
      {result}
    </p>
  );
};

export default ResultMessage;
