import React, { useEffect, useRef, useState } from "react";
import { loadModels, startVideo, captureImage, getFaceDescriptor, compareFaces } from "../../utils/faceUtils";
import ProgressSteps from "./ProgressSteps";
import CaptureButton from "./CaptureButton";
import ResultMessage from "./ResultMessage";
import WebCam from './WebCam'
const FaceVerification = () => {
  const videoRef = useRef(null); // Webcam reference
  const [step, setStep] = useState("face"); // Steps: face → document → result
  const [faceDescriptor, setFaceDescriptor] = useState(null); // Store face descriptor
  const [faceImage, setFaceImage] = useState(null); // Screenshot of face
  const [docImage, setDocImage] = useState(null); // Screenshot of document
  const [result, setResult] = useState(null); // Face matching result

  // Load models and start webcam when component mounts
  useEffect(() => {
    loadModels().then(() => {
      if (videoRef.current) startVideo(videoRef.current);
    });
  }, []);

  // Capture handler for face and document
  const handleCapture = async () => {
    if (!videoRef.current) return;

    const descriptor = await getFaceDescriptor(videoRef.current); // Get face descriptor

    if (!descriptor) {
      alert(step === "face" ? "No face detected. Please try again." : "No face detected on document. Please try again.");
      return;
    }

    if (step === "face") {
      // Step 1: Capture user's face
      setFaceDescriptor(descriptor);
      setFaceImage(captureImage(videoRef.current));
      setStep("document");
    } else if (step === "document") {
      // Step 2: Capture document and compare faces
      setDocImage(captureImage(videoRef.current));

      const isMatch = compareFaces(faceDescriptor, descriptor);
      setResult(isMatch ? "✅ Face match successful. You may proceed to Step 3." : "❌ Face mismatch. Access denied.");
      setStep("result");
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f9fbff", minHeight: "100vh", padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Title */}
      <h2 style={{ color: "#1e3a8a", fontWeight: "bold" }}>🔒 Secure Verification Portal</h2>
      <p style={{ color: "#555", maxWidth: "500px", textAlign: "center" }}>
        Please complete the verification steps to access your assignment.
      </p>

      {/* Progress tracker */}
      <ProgressSteps step={step} faceImage={faceImage} docImage={docImage} result={result} />

      {/* Webcam view */}
      <WebCam videoRef={videoRef} />

      {/* Capture button */}
      {step !== "result" && <CaptureButton step={step} onCapture={handleCapture} />}

      {/* Result message */}
      {step === "result" && <ResultMessage result={result} />}
    </div>
  );
};

export default FaceVerification;
