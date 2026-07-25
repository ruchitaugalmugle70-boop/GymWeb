import { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import MuscleSelector from "../components/MuscleSelector";
import ThreeDCard from "../components/ThreeDCard";
import VideoPlayer from "../components/VideoPlayer";
import SkeletonCard from "../components/SkeletonCard";
import { getAllExercises } from "../services/api";
import {
  Search, Compass, Eye, Flame, Dumbbell, Sparkles,
  ArrowUpDown, Filter, ChevronRight, CheckCircle
} from "lucide-react";

const DIFFICULTY_ORDER = { Beginner: 1, Intermediate: 2, Advanced: 3 };

function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [equipmentFilter, setEquipmentFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name"); // name | difficulty | calories
  const [selectedExercise, setSelectedExercise] = useState(null);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const res = await getAllExercises();
      setExercises(res.data || []);
    } catch (err) {
      console.error("Error retrieving exercises:", err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique equipments in data (handling the DB schema spelling: equipement)
  const equipmentOptions = useMemo(() => {
    const list = exercises.map(ex => ex.equipement || "Bodyweight");
    return ["All", ...new Set(list)];
  }, [exercises]);

  const processedExercises = useMemo(() => {
    // 1. Filter
    const filtered = exercises.filter((ex) => {
      const matchesSearch =
        !searchQuery ||
        ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesMuscle =
        !selectedMuscle ||
        ex.muscleGroup.toLowerCase() === selectedMuscle.toLowerCase();

      const matchesDifficulty =
        difficultyFilter === "All" ||
        ex.difficulty === difficultyFilter;

      const matchesEquipment =
        equipmentFilter === "All" ||
        (ex.equipement || "Bodyweight") === equipmentFilter;

      return matchesSearch && matchesMuscle && matchesDifficulty && matchesEquipment;
    });

    // 2. Sort
    return [...filtered].sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "difficulty") {
        const orderA = DIFFICULTY_ORDER[a.difficulty] || 1;
        const orderB = DIFFICULTY_ORDER[b.difficulty] || 1;
        return orderA - orderB;
      }
      if (sortBy === "calories") {
        return (b.caloriesBurnedPerMinute || 0) - (a.caloriesBurnedPerMinute || 0);
      }
      return 0;
    });
  }, [exercises, searchQuery, selectedMuscle, difficultyFilter, equipmentFilter, sortBy]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", paddingBottom: "60px" }} className="cyber-grid">
      <Navbar />

      <main className="page-container">
        
        {/* Banner Title */}
        <div className="animate-slide-up">
          <span style={{ color: "var(--accent-cyan)", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2.5px" }}>
            Movement Libraries
          </span>
          <h1 className="heading-display" style={{ fontSize: "34px", color: "var(--text-primary)", margin: "4px 0 0" }}>
            Exercise <span className="text-gradient-purple-cyan">Dictionary</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "6px" }}>
            Browse bio-mechanical breakdowns, equipment metrics, and HD video guides.
          </p>
        </div>

        {/* Layout Grid */}
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          
          {/* Side Panels: Filter & Muscle Map */}
          <div style={{ flex: "1", minWidth: "280px", display: "flex", flexDirection: "column", gap: "20px" }}>
            
            {/* Search Input Panel */}
            <div className="glass animate-slide-up" style={{ padding: "20px", borderRadius: "var(--radius-lg)" }}>
              <span style={{ display: "block", fontSize: "11px", color: "var(--text-secondary)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
                Search Movements
              </span>
              <div style={{ position: "relative" }}>
                <Search size={16} color="var(--text-muted)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="text"
                  placeholder="e.g. Squat, Push-up..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="cyber-input"
                  style={{ width: "100%", paddingLeft: "36px", fontSize: "13px" }}
                />
              </div>
            </div>

            {/* Difficulty Filter Panel */}
            <div className="glass animate-slide-up" style={{ padding: "20px", borderRadius: "var(--radius-lg)", animationDelay: "40ms" }}>
              <span style={{ display: "block", fontSize: "11px", color: "var(--text-secondary)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>
                Skill Level
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {["All", "Beginner", "Intermediate", "Advanced"].map(level => {
                  const isActive = difficultyFilter === level;
                  return (
                    <button
                      key={level}
                      onClick={() => setDifficultyFilter(level)}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "var(--radius-md)",
                        background: isActive ? "rgba(132, 98, 63, 0.08)" : "rgba(132, 120, 105, 0.04)",
                        border: isActive ? "1px solid var(--accent-purple)" : "1px solid var(--glass-border)",
                        color: isActive ? "var(--accent-purple)" : "var(--text-secondary)",
                        fontWeight: isActive ? "700" : "500",
                        textAlign: "left",
                        cursor: "pointer",
                        fontSize: "13px",
                        transition: "all var(--duration-fast) ease",
                      }}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Equipment Filter Panel */}
            <div className="glass animate-slide-up" style={{ padding: "20px", borderRadius: "var(--radius-lg)", animationDelay: "80ms" }}>
              <span style={{ display: "block", fontSize: "11px", color: "var(--text-secondary)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>
                Equipment Required
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {equipmentOptions.map(eq => {
                  const isActive = equipmentFilter === eq;
                  return (
                    <button
                      key={eq}
                      onClick={() => setEquipmentFilter(eq)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "var(--radius-sm)",
                        background: isActive ? "rgba(87, 109, 95, 0.08)" : "rgba(132, 120, 105, 0.04)",
                        border: isActive ? "1px solid var(--accent-cyan)" : "1px solid var(--glass-border)",
                        color: isActive ? "var(--accent-cyan)" : "var(--text-secondary)",
                        fontWeight: "600",
                        cursor: "pointer",
                        fontSize: "11px",
                        transition: "all var(--duration-fast) ease",
                      }}
                    >
                      {eq}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SVG Anatomy Map */}
            <MuscleSelector 
              selectedMuscle={selectedMuscle}
              onSelectMuscle={setSelectedMuscle}
            />

          </div>

          {/* Right Panel: Exercise Cards list */}
          <div style={{ flex: "2.5", minWidth: "320px", display: "flex", flexDirection: "column", gap: "20px" }}>
            
            {/* Toolbar Stats & Sorting */}
            <div
              className="glass animate-slide-up"
              style={{
                padding: "12px 20px",
                borderRadius: "var(--radius-lg)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="stat-badge" style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)", color: "var(--accent-cyan)" }}>
                  {processedExercises.length} Movements Found
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <ArrowUpDown size={14} color="var(--text-muted)" />
                <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="cyber-input"
                  style={{ width: "130px", padding: "6px 12px", fontSize: "12px" }}
                >
                  <option value="name">Name</option>
                  <option value="difficulty">Difficulty</option>
                  <option value="calories">Calories</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
                <SkeletonCard height={280} count={6} />
              </div>
            ) : processedExercises.length === 0 ? (
              <div 
                className="glass"
                style={{
                  padding: "60px 40px",
                  textAlign: "center",
                  borderRadius: "var(--radius-lg)",
                  border: "1px dashed rgba(132, 120, 105, 0.15)",
                }}
              >
                <Compass size={36} color="var(--text-muted)" style={{ marginBottom: "16px" }} />
                <h3 style={{ color: "var(--text-primary)", fontSize: "16px", fontWeight: "700" }}>No exercises match your query</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginTop: "4px" }}>
                  Broaden your filters or rewrite the query parameters.
                </p>
              </div>
            ) : (
              <div className="stagger-children" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
                {processedExercises.map((ex) => (
                  <ThreeDCard
                    key={ex._id}
                    className="glass"
                    onClick={() => setSelectedExercise(ex)}
                    style={{
                      borderRadius: "var(--radius-lg)",
                      overflow: "hidden",
                      border: "1px solid var(--glass-border)",
                      background: "var(--bg-card)",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      cursor: "pointer",
                    }}
                  >
                    {/* Image Area */}
                    <div style={{ position: "relative", width: "100%", height: "140px", overflow: "hidden" }}>
                      <img 
                        src={ex.imageUrl || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop"} 
                        alt={ex.name} 
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      <div 
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "linear-gradient(to top, rgba(6, 8, 18, 0.95) 15%, transparent 90%)",
                        }}
                      />
                      
                      {/* Difficulty overlay badge */}
                      <span 
                        style={{
                          position: "absolute",
                          top: "12px",
                          right: "12px",
                          fontSize: "10px",
                          fontWeight: "700",
                          background: "rgba(6, 8, 18, 0.6)",
                          border: "1px solid rgba(132, 120, 105, 0.15)",
                          padding: "3px 8px",
                          borderRadius: "var(--radius-full)",
                          color: "var(--text-primary)",
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        {ex.difficulty}
                      </span>
                    </div>

                    {/* Content Area */}
                    <div style={{ padding: "16px 20px 20px", flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
                      <div>
                        <span style={{ fontSize: "10px", color: "var(--accent-cyan)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          {ex.muscleGroup}
                        </span>
                        <h3 className="heading-display" style={{ fontSize: "16px", color: "var(--text-primary)", marginTop: "2px", margin: 0 }}>
                          {ex.name}
                        </h3>
                      </div>

                      <p style={{ color: "var(--text-secondary)", fontSize: "12.5px", lineHeight: "1.5", margin: 0 }}>
                        {ex.description.substring(0, 75)}...
                      </p>

                      <div style={{ flex: 1 }} />

                      {/* Specs and trigger */}
                      <div 
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          borderTop: "1px solid var(--glass-border)",
                          paddingTop: "12px",
                          marginTop: "4px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--text-muted)" }}>
                          <Flame size={13} color="var(--accent-pink)" />
                          <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{ex.caloriesBurnedPerMinute} c/m</span>
                        </div>

                        <div 
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            color: "var(--accent-purple)",
                            fontSize: "12px",
                            fontWeight: "700",
                          }}
                        >
                          <Eye size={13} />
                          Tutorial
                        </div>
                      </div>
                    </div>
                  </ThreeDCard>
                ))}
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Video Demonstration Modal Overlay */}
      {selectedExercise && (
        <VideoPlayer 
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}
    </div>
  );
}

export default Exercises;
