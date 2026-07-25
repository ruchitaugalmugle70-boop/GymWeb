import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, RefreshCw, Film } from "lucide-react";

const NEW_GYM_VIDEOS = [
  { id: 1, name: "Full HD Cinematic Gym Workout", src: "/gym_v1.mp4" },
  { id: 2, name: "Heavy Barbell & Powerlifting", src: "/gym_v2.mp4" },
  { id: 3, name: "Dumbbell & Muscle Sculpting", src: "/gym_v3.mp4" },
  { id: 4, name: "High-Intensity Fitness", src: "/gym_v4.mp4" },
];

export default function GymBackgroundVideo() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const activeVideo = NEW_GYM_VIDEOS[currentVideoIndex];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch((err) => {
        console.log("Video playback note:", err);
      });
    }
  }, [currentVideoIndex]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % NEW_GYM_VIDEOS.length);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        zIndex: 0,
        pointerEvents: "none",
        backgroundColor: "#0a0c14",
      }}
    >
      {/* ── 100% Fullscreen Cinematic Gym Video ── */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        key={activeVideo.src}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          minWidth: "100vw",
          minHeight: "100vh",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: "translate(-50%, -50%) scale(1.08)",
          filter: "brightness(0.78) contrast(1.16) saturate(1.25)",
          transition: "opacity 0.4s ease",
        }}
      >
        <source src={activeVideo.src} type="video/mp4" />
      </video>

      {/* ── Dark Vignette & Ambient Cyber Glow Overlay ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse at center, rgba(10, 12, 20, 0.25) 0%, rgba(10, 12, 20, 0.65) 70%, rgba(10, 12, 20, 0.88) 100%),
            linear-gradient(135deg, rgba(147, 51, 234, 0.2) 0%, transparent 50%, rgba(6, 182, 212, 0.15) 100%)
          `,
        }}
      />

      {/* ── Ambient Mesh Overlay ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 0.4,
        }}
      />

    </div>
  );
}
