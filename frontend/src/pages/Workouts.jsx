import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ThreeDCard from "../components/ThreeDCard";
import WorkoutPlayer from "../components/WorkoutPlayer";
import SkeletonCard from "../components/SkeletonCard";
import { getAllWorkouts } from "../services/api";
import {
  Dumbbell, Clock, Flame, ChevronRight, Zap, Target, Star,
  Search, Bookmark, BookmarkCheck, LayoutGrid, List
} from "lucide-react";

const DIFFICULTY_COLORS = {
  Beginner: "var(--accent-green)",
  Intermediate: "var(--accent-yellow)",
  Advanced: "var(--accent-red)",
};

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid | list
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("workoutBookmarks")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    fetchWorkouts();
  }, []);

  useEffect(() => {
    localStorage.setItem("workoutBookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const res = await getAllWorkouts();
      setWorkouts(res.data || []);
    } catch (err) {
      console.error("Error fetching workouts:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = (id, e) => {
    e.stopPropagation();
    setBookmarks(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const getDifficultyStars = (difficulty) => {
    const counts = { Beginner: 1, Intermediate: 2, Advanced: 3 };
    const stars = counts[difficulty] || 1;
    const color = DIFFICULTY_COLORS[difficulty] || "var(--accent-cyan)";
    return (
      <div style={{ display: "flex", gap: "2px" }}>
        {[...Array(3)].map((_, i) => (
          <Star
            key={i}
            size={12}
            fill={i < stars ? color : "transparent"}
            color={i < stars ? color : "var(--text-muted)"}
          />
        ))}
      </div>
    );
  };

  const calculateWorkoutStats = (workout) => {
    let estCalories = 0;
    let estMinutes = 0;

    workout.exercises.forEach(link => {
      const sets = link.sets || 3;
      const rest = link.restTime || 45;
      const calsPerMin = link.exercise.caloriesBurnedPerMinute || 8;
      const timeSpentInSecs = sets * (45 + rest);
      estMinutes += timeSpentInSecs / 60;
      estCalories += (timeSpentInSecs / 60) * calsPerMin;
    });

    return {
      exercisesCount: workout.exercises.length,
      calories: Math.round(estCalories),
      duration: Math.round(estMinutes),
    };
  };

  const filteredWorkouts = workouts.filter(w => {
    const matchesSearch = !searchQuery ||
      w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const difficultyMatch = difficultyFilter === "All" || w.difficulty === difficultyFilter;
    const categoryMatch = categoryFilter === "All" || w.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && difficultyMatch && categoryMatch;
  });

  // Get unique categories from data
  const categories = ["All", ...new Set(workouts.map(w => w.category))];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", paddingBottom: "60px" }} className="cyber-grid">
      <Navbar />

      <main className="page-container">

        {/* Title Banner */}
        <div className="animate-slide-up">
          <span style={{ color: "var(--accent-purple)", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2.5px" }}>
            Training Modules
          </span>
          <h1 className="heading-display" style={{ fontSize: "34px", color: "var(--text-primary)", margin: "4px 0 0" }}>
            Workout <span className="text-gradient-purple-cyan">Routines</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "6px" }}>
            Browse and deploy advanced full-body training programs.
          </p>
        </div>

        {/* Search + Filter Bar */}
        <div
          className="glass animate-slide-up"
          style={{
            padding: "16px 24px",
            borderRadius: "var(--radius-lg)",
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            alignItems: "center",
            animationDelay: "40ms",
          }}
        >
          {/* Search */}
          <div style={{ position: "relative", flex: "1", minWidth: "200px" }}>
            <Search size={16} color="var(--text-muted)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              placeholder="Search workouts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="cyber-input"
              style={{ paddingLeft: "36px", fontSize: "13px" }}
            />
          </div>

          <div style={{ height: "28px", width: "1px", background: "var(--glass-border)" }} />

          {/* Difficulty */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>Level:</span>
            <div style={{ display: "flex", gap: "4px" }}>
              {["All", "Beginner", "Intermediate", "Advanced"].map(diff => {
                const color = DIFFICULTY_COLORS[diff] || "var(--accent-purple)";
                const isActive = difficultyFilter === diff;
                return (
                  <button
                    key={diff}
                    onClick={() => setDifficultyFilter(diff)}
                    style={{
                      background: isActive ? `${color}18` : "rgba(132, 120, 105, 0.04)",
                      border: isActive ? `1px solid ${color}40` : "1px solid var(--glass-border)",
                      color: isActive ? color : "var(--text-secondary)",
                      padding: "5px 10px",
                      borderRadius: "var(--radius-sm)",
                      cursor: "pointer",
                      fontSize: "11px",
                      fontWeight: 600,
                      transition: "all var(--duration-fast) ease",
                    }}
                  >
                    {diff}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ height: "28px", width: "1px", background: "var(--glass-border)" }} />

          {/* Category */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>Type:</span>
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  style={{
                    background: categoryFilter === cat ? "rgba(87, 109, 95, 0.1)" : "rgba(132, 120, 105, 0.04)",
                    border: categoryFilter === cat ? "1px solid rgba(87, 109, 95, 0.25)" : "1px solid var(--glass-border)",
                    color: categoryFilter === cat ? "var(--accent-cyan)" : "var(--text-secondary)",
                    padding: "5px 10px",
                    borderRadius: "var(--radius-sm)",
                    cursor: "pointer",
                    fontSize: "11px",
                    fontWeight: 600,
                    transition: "all var(--duration-fast) ease",
                    textTransform: "capitalize",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* View Toggle */}
          <div style={{ display: "flex", gap: "4px", marginLeft: "auto" }}>
            <button
              onClick={() => setViewMode("grid")}
              style={{
                padding: "6px 8px", borderRadius: "var(--radius-sm)",
                background: viewMode === "grid" ? "rgba(168,85,247,0.1)" : "transparent",
                border: viewMode === "grid" ? "1px solid rgba(168,85,247,0.2)" : "1px solid transparent",
                color: viewMode === "grid" ? "var(--accent-purple)" : "var(--text-muted)",
                cursor: "pointer", display: "flex",
              }}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              style={{
                padding: "6px 8px", borderRadius: "var(--radius-sm)",
                background: viewMode === "list" ? "rgba(168,85,247,0.1)" : "transparent",
                border: viewMode === "list" ? "1px solid rgba(168,85,247,0.2)" : "1px solid transparent",
                color: viewMode === "list" ? "var(--accent-purple)" : "var(--text-muted)",
                cursor: "pointer", display: "flex",
              }}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Results count */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            Showing {filteredWorkouts.length} of {workouts.length} routines
          </span>
        </div>

        {/* Workouts Grid / List */}
        {loading ? (
          <div className="workouts-grid">
            <SkeletonCard height={320} count={6} />
          </div>
        ) : filteredWorkouts.length === 0 ? (
          <div
            className="glass"
            style={{
              padding: "60px 40px",
              textAlign: "center",
              borderRadius: "var(--radius-lg)",
              border: "1px dashed rgba(132, 120, 105, 0.15)",
            }}
          >
            <Dumbbell size={36} color="var(--text-muted)" style={{ marginBottom: "16px" }} />
            <h3 style={{ color: "var(--text-primary)", fontSize: "16px", fontWeight: 700 }}>No training modules found</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginTop: "4px" }}>
              Adjust your filters to retrieve other routines.
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="workouts-grid stagger-children">
            {filteredWorkouts.map(w => {
              const stats = calculateWorkoutStats(w);
              const isBookmarked = bookmarks.includes(w._id);
              const diffColor = DIFFICULTY_COLORS[w.difficulty] || "var(--accent-cyan)";

              return (
                <ThreeDCard
                  key={w._id}
                  className="glass"
                  style={{
                    borderRadius: "var(--radius-lg)",
                    overflow: "hidden",
                    border: "1px solid var(--glass-border)",
                    background: "var(--bg-card)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Card Header */}
                  <div style={{ padding: "22px 22px 16px", borderBottom: "1px solid var(--glass-border)", position: "relative" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{
                        fontSize: "10px", fontWeight: 700, textTransform: "uppercase",
                        background: `${diffColor}15`, border: `1px solid ${diffColor}35`,
                        color: diffColor, padding: "3px 8px", borderRadius: "var(--radius-full)", letterSpacing: "0.5px",
                      }}>
                        {w.category}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        {getDifficultyStars(w.difficulty)}
                        <button
                          onClick={(e) => toggleBookmark(w._id, e)}
                          style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", display: "flex" }}
                        >
                          {isBookmarked ? (
                            <BookmarkCheck size={16} color="var(--accent-purple)" fill="var(--accent-purple)" />
                          ) : (
                            <Bookmark size={16} color="var(--text-muted)" />
                          )}
                        </button>
                      </div>
                    </div>
                    <h3 className="heading-display" style={{ fontSize: "18px", color: "var(--text-primary)", margin: 0 }}>
                      {w.title}
                    </h3>
                  </div>

                  {/* Body */}
                  <div style={{ padding: "20px 22px", flex: 1, display: "flex", flexDirection: "column", gap: "14px" }}>
                    <p style={{ color: "var(--text-secondary)", fontSize: "13px", lineHeight: "1.6", margin: 0 }}>
                      {w.description}
                    </p>

                    {/* Stats Row */}
                    <div style={{
                      display: "flex", gap: "10px",
                      background: "rgba(132, 120, 105, 0.04)",
                      border: "1px solid var(--glass-border)",
                      borderRadius: "var(--radius-md)",
                      padding: "10px",
                    }}>
                      <div style={{ flex: 1, textAlign: "center" }}>
                        <Clock size={14} color="var(--accent-cyan)" style={{ marginBottom: "3px" }} />
                        <span style={{ display: "block", fontSize: "9px", color: "var(--text-muted)", textTransform: "uppercase" }}>Time</span>
                        <strong style={{ fontSize: "12px", color: "var(--text-primary)" }}>{stats.duration}m</strong>
                      </div>
                      <div style={{ width: "1px", background: "var(--glass-border)" }} />
                      <div style={{ flex: 1, textAlign: "center" }}>
                        <Flame size={14} color="var(--accent-pink)" style={{ marginBottom: "3px" }} />
                        <span style={{ display: "block", fontSize: "9px", color: "var(--text-muted)", textTransform: "uppercase" }}>Burn</span>
                        <strong style={{ fontSize: "12px", color: "var(--text-primary)" }}>{stats.calories} kcal</strong>
                      </div>
                      <div style={{ width: "1px", background: "var(--glass-border)" }} />
                      <div style={{ flex: 1, textAlign: "center" }}>
                        <Target size={14} color="var(--accent-purple)" style={{ marginBottom: "3px" }} />
                        <span style={{ display: "block", fontSize: "9px", color: "var(--text-muted)", textTransform: "uppercase" }}>Moves</span>
                        <strong style={{ fontSize: "12px", color: "var(--text-primary)" }}>{stats.exercisesCount}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <div style={{ padding: "0 22px 22px" }}>
                    <button
                      onClick={() => setActiveWorkout(w)}
                      className="cyber-btn"
                      style={{ width: "100%", height: "44px", fontSize: "12px" }}
                    >
                      Start Session
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </ThreeDCard>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }} className="stagger-children">
            {filteredWorkouts.map(w => {
              const stats = calculateWorkoutStats(w);
              const isBookmarked = bookmarks.includes(w._id);
              const diffColor = DIFFICULTY_COLORS[w.difficulty] || "var(--accent-cyan)";
              return (
                <div
                  key={w._id}
                  className="glass glass-hover"
                  style={{
                    padding: "18px 22px",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    cursor: "pointer",
                  }}
                  onClick={() => setActiveWorkout(w)}
                >
                  <div
                    className="flex-center"
                    style={{
                      width: "42px", height: "42px", borderRadius: "12px",
                      background: `${diffColor}15`, border: `1px solid ${diffColor}30`,
                      flexShrink: 0,
                    }}
                  >
                    <Dumbbell size={18} color={diffColor} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <h4 style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "14px", margin: 0 }}>{w.title}</h4>
                      <span className="stat-badge" style={{ background: `${diffColor}12`, border: `1px solid ${diffColor}30`, color: diffColor }}>
                        {w.difficulty}
                      </span>
                    </div>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      {stats.exercisesCount} exercises • {stats.duration}m • {stats.calories} kcal
                    </span>
                  </div>
                  <button
                    onClick={(e) => toggleBookmark(w._id, e)}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex" }}
                  >
                    {isBookmarked ? (
                      <BookmarkCheck size={18} color="var(--accent-purple)" fill="var(--accent-purple)" />
                    ) : (
                      <Bookmark size={18} color="var(--text-muted)" />
                    )}
                  </button>
                  <ChevronRight size={18} color="var(--text-muted)" />
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Fullscreen player overlay */}
      {activeWorkout && (
        <WorkoutPlayer
          workout={activeWorkout}
          onClose={() => setActiveWorkout(null)}
        />
      )}
    </div>
  );
}

export default Workouts;
