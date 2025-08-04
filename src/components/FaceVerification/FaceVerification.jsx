import React, { useEffect, useRef, useState } from "react";
import { loadModels, startVideo, captureImage, getFaceDescriptor, compareFaces } from "../../utils/faceUtils";
import * as faceapi from "face-api.js";
import Tesseract from "tesseract.js";
import ProgressSteps from "./ProgressSteps";
import CaptureButton from "./CaptureButton";
import ResultMessage from "./ResultMessage";
import WebCam from "./WebCam";

const FaceVerification = () => {
  const videoRef = useRef(null);
  const [step, setStep] = useState("face");
  const [faceDescriptor, setFaceDescriptor] = useState(null);
  const [faceImage, setFaceImage] = useState(null);
  const [docImage, setDocImage] = useState(null);
  const [result, setResult] = useState(null);
  const [liveFaceMatchResult, setLiveFaceMatchResult] = useState(null);
  const [ocrText, setOcrText] = useState("");

  useEffect(() => {
    loadModels().then(() => {
      if (videoRef.current) startVideo(videoRef.current);
    });
  }, []);

  const handleCapture = async () => {
    if (!videoRef.current) return;

    if (step === "face") {
      const descriptor = await getFaceDescriptor(videoRef.current);
      if (!descriptor) return alert("No face detected. Try again.");

      setFaceDescriptor(descriptor);
      setFaceImage(captureImage(videoRef.current));
      setStep("document");

    } else if (step === "document") {
      const capturedDoc = captureImage(videoRef.current);
      setDocImage(capturedDoc);

      Tesseract.recognize(capturedDoc, "eng")
        .then(({ data: { text } }) => {
          setOcrText(text);

          const hasIndia = /INDIA/i.test(text); // checks if "INDIA" is present
    if (!hasIndia) {
      alert("❌ Please show a valid document with the word 'INDIA'.");
      return;
    }
          const img = new Image();
          img.src = capturedDoc;
          img.onload = async () => {
            const detection = await faceapi
              .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
              .withFaceLandmarks()
              .withFaceDescriptor();

            if (!detection?.descriptor) {
              alert("❌ No face detected in document. Try again.");
              return;
            }

            const isMatch = compareFaces(faceDescriptor, detection.descriptor);
            setResult(isMatch ? "✅ Face matched with document." : "❌ Face mismatch with document.");
            setStep("live"); // Go to final verification step
          };
        })
        .catch(() => {
          alert("OCR failed. Try again.");
        });

    } else if (step === "live") {
      const descriptor = await getFaceDescriptor(videoRef.current);
      if (!descriptor) return alert("No face detected. Try again.");

      const isMatch = compareFaces(faceDescriptor, descriptor);
      setLiveFaceMatchResult(isMatch ? "✅ Final face match successful." : "❌ Final face mismatch.");
      setStep("result");
    }
  };

  return (
    <div
      style={{
        fontFamily: "Arial",
        background: "#f2f2f4ff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <h2 style={{ color: "#1e3a8a" }}>🔐 Face & Document Verification</h2>
      <p style={{ color: "#333" }}>Complete all steps for secure access.</p>

      <ProgressSteps step={step} faceImage={faceImage} docImage={docImage} result={result} />
      <WebCam videoRef={videoRef} />

      {step === "live" && (
        <p style={{ color: "#555", marginTop: 10 }}>
          📸 Please face the camera again for final verification.
        </p>
      )}

      {step !== "result" && (
        <CaptureButton step={step} onCapture={handleCapture} />
      )}

      {step === "result" && (
        <>
          <ResultMessage result={result} />
          {liveFaceMatchResult && (
            <div
              style={{
                marginTop: 10,
                color: liveFaceMatchResult.includes("✅") ? "green" : "red",
              }}
            >
              {liveFaceMatchResult}
            </div>
          )}
        </>
      )}

      {docImage && (
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <h4 style={{ color: "#1e3a8a" }}>📄 Captured Document</h4>
          <img
            src={docImage}
            alt="Captured Document"
            style={{
              maxWidth: "300px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          />
        </div>
      )}

      {ocrText && (
        <pre
          style={{
            background: "#eee",
            padding: 10,
            marginTop: 20,
            maxWidth: "90%",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
          }}
        >
          {ocrText}
        </pre>
      )}
    </div>
  );
};

export default FaceVerification;
