import { useState } from "react";

const muscles = [
  { id: "Chest", label: "Chest", color: "var(--accent-purple)" },
  { id: "Back", label: "Back", color: "var(--accent-cyan)" },
  { id: "Legs", label: "Legs", color: "var(--accent-pink)" },
  { id: "Arms", label: "Arms", color: "var(--accent-orange)" },
  { id: "Abs", label: "Core / Abs", color: "var(--accent-green)" },
  { id: "Cardio", label: "Cardio", color: "#eab308" }
];

function MuscleSelector({ selectedMuscle, onSelectMuscle }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div 
      className="glass" 
      style={{
        padding: "24px",
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        alignItems: "center"
      }}
    >
      <h3 className="heading-display" style={{ fontSize: "18px", color: "white", width: "100%", textAlign: "left" }}>
        Target <span className="text-gradient-purple-cyan">Muscle Group</span>
      </h3>

      <div style={{ display: "flex", width: "100%", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
        {/* Futuristic SVG Silhouette */}
        <div 
          style={{
            position: "relative",
            width: "140px",
            height: "220px",
            background: "rgba(10, 11, 20, 0.5)",
            borderRadius: "12px",
            padding: "10px",
            border: "1px solid rgba(255, 255, 255, 0.04)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <svg viewBox="0 0 100 200" width="100%" height="100%">
            {/* Background silhouette */}
            <path 
              d="M 50 15 C 44 15, 42 22, 45 28 C 47 31, 53 31, 55 28 C 58 22, 56 15, 50 15 Z" 
              fill="rgba(255, 255, 255, 0.05)"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="0.5"
            />
            {/* Body Shape */}
            <path
              d="M 45 32 C 40 32, 32 36, 28 42 C 26 45, 28 48, 29 48 C 31 48, 33 42, 37 40 L 37 65 C 32 80, 24 95, 20 115 C 18 125, 22 128, 24 125 C 27 120, 33 100, 38 85 L 38 120 C 38 140, 32 165, 28 190 C 27 195, 31 198, 33 198 C 38 190, 44 150, 48 135 L 50 135 L 52 135 C 56 150, 62 190, 67 198 C 69 198, 73 195, 72 190 C 68 165, 62 140, 62 120 L 62 85 C 67 100, 73 120, 76 125 C 78 128, 82 125, 80 115 C 76 95, 68 80, 63 65 L 63 40 C 67 42, 69 48, 71 48 C 72 48, 74 45, 72 42 C 68 36, 60 32, 55 32 Z"
              fill="rgba(255, 255, 255, 0.08)"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="0.5"
            />

            {/* Clickable/Interactive Muscle Hotspots */}
            
            {/* Chest */}
            <path
              d="M 39 42 C 43 41, 47 41, 50 42 C 53 41, 57 41, 61 42 C 60 48, 57 52, 50 52 C 43 52, 40 48, 39 42 Z"
              fill={selectedMuscle === "Chest" ? "var(--accent-purple)" : (hovered === "Chest" ? "rgba(168, 85, 247, 0.4)" : "rgba(255,255,255,0.15)")}
              stroke="rgba(168, 85, 247, 0.5)"
              strokeWidth="0.5"
              style={{ cursor: "pointer", transition: "all 0.3s ease" }}
              onClick={() => onSelectMuscle(selectedMuscle === "Chest" ? null : "Chest")}
              onMouseEnter={() => setHovered("Chest")}
              onMouseLeave={() => setHovered(null)}
            />

            {/* Abs / Core */}
            <path
              d="M 42 54 L 58 54 L 56 78 L 44 78 Z"
              fill={selectedMuscle === "Abs" ? "var(--accent-green)" : (hovered === "Abs" ? "rgba(16, 185, 129, 0.4)" : "rgba(255,255,255,0.15)")}
              stroke="rgba(16, 185, 129, 0.5)"
              strokeWidth="0.5"
              style={{ cursor: "pointer", transition: "all 0.3s ease" }}
              onClick={() => onSelectMuscle(selectedMuscle === "Abs" ? null : "Abs")}
              onMouseEnter={() => setHovered("Abs")}
              onMouseLeave={() => setHovered(null)}
            />

            {/* Arms (Left & Right Bicep/Tricep regions) */}
            <path
              d="M 32 46 L 36 43 L 36 60 L 32 63 Z M 64 43 L 68 46 L 68 63 L 64 60 Z"
              fill={selectedMuscle === "Arms" ? "var(--accent-orange)" : (hovered === "Arms" ? "rgba(249, 115, 22, 0.4)" : "rgba(255,255,255,0.15)")}
              stroke="rgba(249, 115, 22, 0.5)"
              strokeWidth="0.5"
              style={{ cursor: "pointer", transition: "all 0.3s ease" }}
              onClick={() => onSelectMuscle(selectedMuscle === "Arms" ? null : "Arms")}
              onMouseEnter={() => setHovered("Arms")}
              onMouseLeave={() => setHovered(null)}
            />

            {/* Legs (Quads) */}
            <path
              d="M 36 85 C 38 100, 42 115, 46 125 C 47 125, 48 115, 48 85 Z M 52 85 C 52 115, 53 125, 54 125 C 58 115, 62 100, 64 85 Z"
              fill={selectedMuscle === "Legs" ? "var(--accent-pink)" : (hovered === "Legs" ? "rgba(236, 72, 153, 0.4)" : "rgba(255,255,255,0.15)")}
              stroke="rgba(236, 72, 153, 0.5)"
              strokeWidth="0.5"
              style={{ cursor: "pointer", transition: "all 0.3s ease" }}
              onClick={() => onSelectMuscle(selectedMuscle === "Legs" ? null : "Legs")}
              onMouseEnter={() => setHovered("Legs")}
              onMouseLeave={() => setHovered(null)}
            />

            {/* Back (Stylized Rear Back, shown overlapping upper body) */}
            <path
              d="M 43 32 L 57 32 L 61 38 L 39 38 Z"
              fill={selectedMuscle === "Back" ? "var(--accent-cyan)" : (hovered === "Back" ? "rgba(6, 182, 212, 0.4)" : "rgba(255,255,255,0.1)")}
              stroke="rgba(6, 182, 212, 0.5)"
              strokeWidth="0.5"
              style={{ cursor: "pointer", transition: "all 0.3s ease" }}
              onClick={() => onSelectMuscle(selectedMuscle === "Back" ? null : "Back")}
              onMouseEnter={() => setHovered("Back")}
              onMouseLeave={() => setHovered(null)}
            />
          </svg>
        </div>

        {/* Quick Filter Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1, minWidth: "160px" }}>
          {muscles.map((muscle) => {
            const active = selectedMuscle === muscle.id;
            return (
              <button
                key={muscle.id}
                onClick={() => onSelectMuscle(active ? null : muscle.id)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  background: active ? muscle.color : "rgba(255, 255, 255, 0.03)",
                  border: active ? `1px solid ${muscle.color}` : "1px solid rgba(255, 255, 255, 0.05)",
                  color: active ? "#000" : "var(--text-primary)",
                  fontWeight: "600",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "13px"
                }}
              >
                <span>{muscle.label}</span>
                <span 
                  style={{
                    display: "inline-block",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: active ? "#000" : muscle.color,
                    boxShadow: active ? "none" : `0 0 8px ${muscle.color}`
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>
      
      {selectedMuscle && (
        <button 
          onClick={() => onSelectMuscle(null)}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--accent-purple)",
            fontSize: "12px",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          Clear Filter
        </button>
      )}
    </div>
  );
}

export default MuscleSelector;
