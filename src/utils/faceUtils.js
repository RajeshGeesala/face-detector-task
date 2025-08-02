import * as faceapi from "face-api.js";

// Load models from CDN
export const loadModels = async () => {
  const MODEL_URL = "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js/weights";
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
  await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
};

// Start webcam
export const startVideo = async (videoElement) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoElement) {
      videoElement.srcObject = stream;
    }
  } catch (error) {
    console.error("Camera access denied:", error);
  }
};

// Capture a screenshot from webcam
export const captureImage = (videoElement) => {
  const canvas = document.createElement("canvas");
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  const context = canvas.getContext("2d");
  context.drawImage(videoElement, 0, 0);
  return canvas.toDataURL("image/png");
};

// Extract face descriptor
export const getFaceDescriptor = async (videoElement) => {
  const detection = await faceapi
    .detectSingleFace(
      videoElement,
      new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.4 })
    )
    .withFaceLandmarks()
    .withFaceDescriptor();

  return detection ? detection.descriptor : null;
};

// Compare two face descriptors
export const compareFaces = (descriptor1, descriptor2) => {
  if (!(descriptor1 instanceof Float32Array) || !(descriptor2 instanceof Float32Array)) {
    console.error("Invalid descriptors for comparison");
    return false;
  }
  const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
  console.log("Face match distance:", distance);
  return distance < 0.45; // Stricter threshold
};
