import { X, Play, Clock, Sparkles } from "lucide-react";

function VideoPlayer({ exercise, onClose }) {
  if (!exercise) return null;

  return (
    <div 
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(3, 4, 8, 0.85)",
        backdropFilter: "blur(8px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
        padding: "20px"
      }}
    >
      <div 
        className="glass"
        style={{
          width: "100%",
          maxWidth: "800px",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6), var(--shadow-neon-purple)",
          border: "1px solid rgba(168, 85, 247, 0.3)",
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh",
          position: "relative"
        }}
      >
        {/* Header bar */}
        <div 
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "rgba(20, 22, 33, 0.4)"
          }}
        >
          <div>
            <h2 className="heading-display" style={{ fontSize: "20px", color: "white", margin: 0 }}>
              {exercise.name}
            </h2>
            <div style={{ display: "flex", gap: "8px", marginTop: "4px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "12px", background: "rgba(168, 85, 247, 0.15)", color: "var(--accent-purple)", border: "1px solid rgba(168, 85, 247, 0.3)", padding: "2px 8px", borderRadius: "20px" }}>
                {exercise.muscleGroup}
              </span>
              <span style={{ fontSize: "12px", background: "rgba(6, 182, 212, 0.15)", color: "var(--accent-cyan)", border: "1px solid rgba(6, 182, 212, 0.3)", padding: "2px 8px", borderRadius: "20px" }}>
                {exercise.equipement || exercise.equipment || "Bodyweight"}
              </span>
              <span style={{ fontSize: "12px", background: "rgba(236, 72, 153, 0.15)", color: "var(--accent-pink)", border: "1px solid rgba(236, 72, 153, 0.3)", padding: "2px 8px", borderRadius: "20px" }}>
                {exercise.difficulty}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "white",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"}
          >
            <X size={20} />
          </button>
        </div>

        {/* Video Player Section */}
        <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", background: "#000" }}>
          {exercise.videoUrl ? (
            <iframe
              src={`${exercise.videoUrl}?autoplay=1&mute=1&loop=1&playlist=${exercise.videoUrl.split('/').pop()}`}
              title={exercise.name}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%"
              }}
            />
          ) : (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "var(--text-secondary)" }}>
              <Play size={48} color="var(--accent-purple)" style={{ marginBottom: "12px" }} />
              <span>No Video Tutorial Available</span>
            </div>
          )}
        </div>

        {/* Info & Details Section */}
        <div 
          style={{ 
            padding: "24px", 
            overflowY: "auto", 
            flex: 1, 
            background: "rgba(10, 11, 20, 0.3)",
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}
        >
          <div>
            <h4 className="heading-display" style={{ fontSize: "14px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>
              Exercise Guide
            </h4>
            <p style={{ color: "var(--text-primary)", fontSize: "15px", lineHeight: "1.6" }}>
              {exercise.description}
            </p>
          </div>

          <div 
            style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              padding: "16px",
              borderRadius: "12px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Sparkles size={20} color="var(--accent-pink)" />
              <div>
                <span style={{ display: "block", fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase" }}>Burn Rate</span>
                <span style={{ fontSize: "16px", fontWeight: "700", color: "white" }}>
                  {exercise.caloriesBurnedPerMinute || 8} kcal/min
                </span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Clock size={20} color="var(--accent-cyan)" />
              <div>
                <span style={{ display: "block", fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase" }}>Target Duration</span>
                <span style={{ fontSize: "16px", fontWeight: "700", color: "white" }}>45 - 60 sec/set</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
