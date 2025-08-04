const WebCam = ({ videoRef }) => (
  <div style={{ marginTop: 20 }}>
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      style={{ width: "400px", border: "2px solid #ddd", borderRadius: 10 }}
    />
  </div>
);

export default WebCam;
