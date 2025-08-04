import * as faceapi from "face-api.js";

export const loadModels = async () => {
  const MODEL_URL = "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js/weights";
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
  ]);
};

export const startVideo = (videoRef) => {
  navigator.mediaDevices
    .getUserMedia({ video: {} })
    .then((stream) => (videoRef.srcObject = stream))
    .catch((err) => console.error("Camera error:", err));
};

export const captureImage = (video) => {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);
  return canvas.toDataURL("image/jpeg");
};

export const getFaceDescriptor = async (video) => {
  const detection = await faceapi
    .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor();

  return detection?.descriptor || null;
};

export const compareFaces = (descriptor1, descriptor2) => {
  const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
  return distance < 0.5; // Lower threshold = stricter match
};

