import { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import WorkoutPlayer from "../components/WorkoutPlayer";
import { SkeletonStatCard } from "../components/SkeletonCard";
import { getMyProgress, getAllWorkouts } from "../services/api";
import {
  Flame, Clock, Calendar, ChevronRight, Zap, Target, Award,
  TrendingUp, Activity, Dumbbell, Play, BarChart3
} from "lucide-react";

const MOTIVATIONAL_QUOTES = [
  "The only bad workout is the one that didn't happen.",
  "Your body can stand almost anything. It's your mind you have to convince.",
  "Strength does not come from the body. It comes from the will.",
  "Push yourself, because no one else is going to do it for you.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "Don't limit your challenges — challenge your limits.",
  "Results happen over time, not overnight. Be patient and consistent.",
  "Your health is an investment, not an expense.",
];

function Dashboard() {
  const [userName, setUserName] = useState("Athlete");
  const [workouts, setWorkouts] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeWorkout, setActiveWorkout] = useState(null);

  const dailyQuote = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    return MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length];
  }, []);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [workoutsData, progressData] = await Promise.all([
        getAllWorkouts(),
        getMyProgress(),
      ]);
      setWorkouts(workoutsData.data || []);
      setProgress(progressData || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ── Aggregated stats ────────────────────────────────────────────────
  const totalWorkouts = progress.length;
  const totalCalories = progress.reduce((s, p) => s + (p.caloriesBurned || 0), 0);
  const totalMinutes = progress.reduce((s, p) => s + (p.workoutDuration || 0), 0);

  // ── Streak calculation ──────────────────────────────────────────────
  const streak = useMemo(() => {
    if (!progress.length) return 0;
    const dates = [...new Set(
      progress.map(p => new Date(p.createdAt || p.date).toDateString())
    )].sort((a, b) => new Date(b) - new Date(a));

    let count = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < dates.length; i++) {
      const expected = new Date(today);
      expected.setDate(expected.getDate() - i);
      if (new Date(dates[i]).toDateString() === expected.toDateString()) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }, [progress]);

  // ── Weekly chart data (last 7 days) ─────────────────────────────────
  const weeklyData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const result = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toDateString();
      const dayLabel = days[d.getDay()];

      const dayCals = progress
        .filter(p => new Date(p.createdAt || p.date).toDateString() === dateStr)
        .reduce((s, p) => s + (p.caloriesBurned || 0), 0);

      result.push({ day: dayLabel, cals: dayCals, isToday: i === 0 });
    }
    return result;
  }, [progress]);

  const maxCals = Math.max(...weeklyData.map(d => d.cals), 1);

  // ── Activity heatmap (last 12 weeks) ─────────────────────────────────
  const heatmapData = useMemo(() => {
    const cells = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 83; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toDateString();

      const count = progress.filter(
        p => new Date(p.createdAt || p.date).toDateString() === dateStr
      ).length;

      cells.push({ date: d, count });
    }
    return cells;
  }, [progress]);

  // ── Recent activity ──────────────────────────────────────────────────
  const recentActivity = useMemo(() => {
    return [...progress]
      .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
      .slice(0, 5);
  }, [progress]);

  // ── Smart workout recommendation ─────────────────────────────────────
  const recommendedWorkout = useMemo(() => {
    if (!workouts.length) return null;
    const recentWorkoutIds = new Set(
      progress.slice(-3).map(p => p.workoutId?._id || p.workoutId)
    );
    const fresh = workouts.find(w => !recentWorkoutIds.has(w._id));
    return fresh || workouts[0];
  }, [workouts, progress]);

  // ── Goal constants ──────────────────────────────────────────────────
  const calorieGoal = 600;
  const minuteGoal = 45;
  const caloriePercent = Math.min(100, Math.round((totalCalories / calorieGoal) * 100)) || 0;
  const minutePercent = Math.min(100, Math.round((totalMinutes / minuteGoal) * 100)) || 0;

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const formatRelativeTime = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  const statCards = [
    {
      icon: <Flame size={28} />,
      label: "Calories Burned",
      value: totalCalories,
      unit: "kcal",
      color: "var(--accent-pink)",
      percent: caloriePercent,
      goal: `${calorieGoal} kcal goal`,
    },
    {
      icon: <Clock size={28} />,
      label: "Active Minutes",
      value: totalMinutes,
      unit: "mins",
      color: "var(--accent-cyan)",
      percent: minutePercent,
      goal: `${minuteGoal} min goal`,
    },
    {
      icon: <Calendar size={28} />,
      label: "Workouts Done",
      value: totalWorkouts,
      unit: "sessions",
      color: "var(--accent-purple)",
      percent: Math.min(100, totalWorkouts * 20),
      goal: "5 per week",
    },
    {
      icon: <Zap size={28} />,
      label: "Current Streak",
      value: streak,
      unit: streak === 1 ? "day" : "days",
      color: "var(--accent-orange)",
      percent: Math.min(100, streak * 14),
      goal: "7 day target",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", paddingBottom: "60px" }} className="cyber-grid">
      <Navbar />

      <main className="page-container">

        {/* ── Hero Welcome Banner ──────────────────────────────────────── */}
        <div
          className="glass animate-slide-up"
          style={{
            padding: "32px 36px",
            borderRadius: "var(--radius-xl)",
            background: "linear-gradient(135deg, var(--bg-tertiary), var(--bg-secondary))",
            border: "1px solid var(--glass-border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative glow orb */}
          <div style={{
            position: "absolute", top: "-40px", right: "-40px",
            width: "160px", height: "160px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(132, 98, 63, 0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <span style={{ color: "var(--accent-cyan)", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2.5px" }}>
              {getGreeting()}
            </span>
            <h1 className="heading-display" style={{ fontSize: "34px", color: "var(--text-primary)", margin: "4px 0 0" }}>
              Welcome back, <span className="text-gradient-purple-cyan">{userName}</span>
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "8px", maxWidth: "500px", lineHeight: "1.6", fontStyle: "italic" }}>
              "{dailyQuote}"
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px", position: "relative", zIndex: 1 }}>
            {streak > 0 && (
              <div
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "12px 20px", borderRadius: "var(--radius-lg)",
                  background: "rgba(249, 115, 22, 0.08)",
                  border: "1px solid rgba(249, 115, 22, 0.2)",
                }}
              >
                <Zap size={22} color="var(--accent-orange)" className="glow-orange" />
                <div>
                  <span style={{ display: "block", fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase" }}>Streak</span>
                  <span style={{ fontSize: "20px", fontWeight: 800, color: "var(--accent-orange)", fontFamily: "var(--font-display)" }}>
                    {streak} {streak === 1 ? "Day" : "Days"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Stats Cards Grid ──────────────────────────────────────────── */}
        {loading ? (
          <SkeletonStatCard count={4} />
        ) : (
          <div className="stagger-children" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
            {statCards.map((card, idx) => (
              <div
                key={card.label}
                className="glass glass-hover"
                style={{
                  padding: "22px",
                  borderRadius: "var(--radius-lg)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  borderLeft: `3px solid ${card.color}`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ color: card.color }}>{card.icon}</div>
                  {/* Circular progress */}
                  <svg width="44" height="44">
                    <circle cx="22" cy="22" r="17" fill="transparent" stroke="rgba(132, 120, 105, 0.1)" strokeWidth="3.5" />
                    <circle
                      cx="22" cy="22" r="17"
                      fill="transparent"
                      stroke={card.color}
                      strokeWidth="3.5"
                      strokeDasharray={2 * Math.PI * 17}
                      strokeDashoffset={2 * Math.PI * 17 * (1 - card.percent / 100)}
                      strokeLinecap="round"
                      style={{ filter: `drop-shadow(0 0 4px ${card.color})`, transition: "stroke-dashoffset 0.8s ease", transform: "rotate(-90deg)", transformOrigin: "center" }}
                    />
                    <text x="22" y="26" fill="var(--text-primary)" fontSize="10" fontWeight="700" textAnchor="middle">
                      {card.percent}%
                    </text>
                  </svg>
                </div>

                <div>
                  <span style={{ display: "block", fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.5px" }}>
                    {card.label}
                  </span>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginTop: "2px" }}>
                    <span style={{ fontSize: "26px", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
                      {card.value}
                    </span>
                    <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 500 }}>
                      {card.unit}
                    </span>
                  </div>
                  <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>{card.goal}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Main Content Row ──────────────────────────────────────────── */}
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>

          {/* Left Column */}
          <div style={{ flex: "1.6", minWidth: "360px", display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Weekly Bar Chart */}
            <div className="glass animate-slide-up" style={{ padding: "24px", borderRadius: "var(--radius-lg)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                  <h3 className="heading-display" style={{ fontSize: "17px", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
                    <BarChart3 size={18} color="var(--accent-purple)" />
                    Weekly <span className="text-gradient-purple-cyan">Progress</span>
                  </h3>
                  <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Calories burned per day</span>
                </div>
                <div className="stat-badge" style={{ background: "rgba(132, 98, 63, 0.08)", border: "1px solid rgba(132, 98, 63, 0.18)", color: "var(--accent-purple)" }}>
                  Last 7 Days
                </div>
              </div>

              {/* Bar chart */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", height: "160px", padding: "0 8px" }}>
                {weeklyData.map((d, i) => {
                  const barHeight = maxCals > 0 ? (d.cals / maxCals) * 130 : 0;
                  return (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                      {d.cals > 0 && (
                        <span style={{ fontSize: "10px", color: "var(--text-secondary)", fontWeight: 600 }}>
                          {d.cals}
                        </span>
                      )}
                      <div
                        style={{
                          width: "100%",
                          maxWidth: "40px",
                          height: `${Math.max(barHeight, 4)}px`,
                          borderRadius: "6px 6px 3px 3px",
                          background: d.isToday
                            ? "linear-gradient(180deg, var(--accent-purple), var(--accent-cyan))"
                            : d.cals > 0
                              ? "rgba(132, 98, 63, 0.25)"
                              : "rgba(132, 120, 105, 0.08)",
                          transition: "height 0.6s var(--ease-out)",
                          boxShadow: d.isToday && d.cals > 0 ? "0 0 12px rgba(132, 98, 63, 0.3)" : "none",
                        }}
                      />
                      <span style={{
                        fontSize: "11px",
                        fontWeight: d.isToday ? 700 : 500,
                        color: d.isToday ? "var(--accent-purple)" : "var(--text-muted)",
                      }}>
                        {d.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Activity Heatmap */}
            <div className="glass animate-slide-up" style={{ padding: "24px", borderRadius: "var(--radius-lg)", animationDelay: "80ms" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 className="heading-display" style={{ fontSize: "17px", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Activity size={18} color="var(--accent-green)" />
                  Activity <span className="text-gradient-green-cyan">Heatmap</span>
                </h3>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Last 12 weeks</span>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(12, 1fr)",
                gridTemplateRows: "repeat(7, 1fr)",
                gap: "3px",
                gridAutoFlow: "column",
              }}>
                {heatmapData.map((cell, i) => {
                  const intensity = cell.count === 0 ? 0 : Math.min(cell.count, 3);
                  const colors = [
                    "rgba(132, 120, 105, 0.06)",
                    "rgba(21, 128, 61, 0.2)",
                    "rgba(21, 128, 61, 0.4)",
                    "rgba(21, 128, 61, 0.65)",
                  ];
                  return (
                    <div
                      key={i}
                      className="heatmap-cell"
                      title={`${cell.date.toLocaleDateString()}: ${cell.count} workout${cell.count !== 1 ? "s" : ""}`}
                      style={{ background: colors[intensity] }}
                    />
                  );
                })}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "12px", justifyContent: "flex-end" }}>
                <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>Less</span>
                {["rgba(132,120,105,0.06)", "rgba(21,128,61,0.2)", "rgba(21,128,61,0.4)", "rgba(21,128,61,0.65)"].map((c, i) => (
                  <div key={i} style={{ width: "12px", height: "12px", borderRadius: "3px", background: c }} />
                ))}
                <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>More</span>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ flex: "1", minWidth: "300px", display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Recommended Workout */}
            {recommendedWorkout && (
              <div
                className="glass animate-slide-up"
                style={{
                  padding: "24px",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--glass-border)",
                  animationDelay: "40ms",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                  <Target size={16} color="var(--accent-purple)" />
                  <span style={{ fontSize: "11px", color: "var(--accent-purple)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
                    Recommended For You
                  </span>
                </div>

                <h3 className="heading-display" style={{ fontSize: "18px", color: "var(--text-primary)", marginBottom: "6px" }}>
                  {recommendedWorkout.title}
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "13px", lineHeight: "1.5", marginBottom: "16px" }}>
                  {recommendedWorkout.description?.substring(0, 100)}...
                </p>

                <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Dumbbell size={14} color="var(--text-muted)" />
                    <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                      {recommendedWorkout.exercises?.length || 0} exercises
                    </span>
                  </div>
                  <div className="stat-badge" style={{ background: "rgba(132, 98, 63, 0.08)", border: "1px solid rgba(132, 98, 63, 0.18)", color: "var(--accent-purple)" }}>
                    {recommendedWorkout.difficulty}
                  </div>
                </div>

                <button
                  onClick={() => setActiveWorkout(recommendedWorkout)}
                  className="cyber-btn"
                  style={{ width: "100%", height: "46px" }}
                >
                  <Play size={16} />
                  Start Workout
                </button>
              </div>
            )}

            {/* Recent Activity Feed */}
            <div className="glass animate-slide-up" style={{ padding: "24px", borderRadius: "var(--radius-lg)", animationDelay: "120ms" }}>
              <h3 className="heading-display" style={{ fontSize: "17px", color: "var(--text-primary)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <TrendingUp size={18} color="var(--accent-cyan)" />
                Recent <span className="text-gradient-purple-cyan">Activity</span>
              </h3>

              {recentActivity.length === 0 ? (
                <div style={{ padding: "32px 16px", textAlign: "center" }}>
                  <Award size={32} color="var(--text-muted)" style={{ marginBottom: "12px", opacity: 0.5 }} />
                  <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                    No workouts yet. Complete your first session!
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {recentActivity.map((entry, i) => (
                    <div
                      key={entry._id || i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px",
                        borderRadius: "var(--radius-md)",
                        background: "rgba(132, 120, 105, 0.04)",
                        border: "1px solid var(--glass-border)",
                        transition: "all var(--duration-fast) ease",
                      }}
                    >
                      <div
                        className="flex-center"
                        style={{
                          width: "36px", height: "36px",
                          borderRadius: "10px",
                          background: "rgba(132, 98, 63, 0.08)",
                          flexShrink: 0,
                        }}
                      >
                        <Dumbbell size={16} color="var(--accent-purple)" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={{
                          display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-primary)",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {entry.workoutId?.title || "Workout Session"}
                        </span>
                        <div style={{ display: "flex", gap: "12px", marginTop: "2px" }}>
                          <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "3px" }}>
                            <Clock size={10} /> {entry.workoutDuration || 0}m
                          </span>
                          <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "3px" }}>
                            <Flame size={10} /> {entry.caloriesBurned || 0} kcal
                          </span>
                        </div>
                      </div>
                      <span style={{ fontSize: "10px", color: "var(--text-muted)", flexShrink: 0 }}>
                        {formatRelativeTime(entry.createdAt || entry.date)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Start — All Workouts */}
            <div className="glass animate-slide-up" style={{ padding: "24px", borderRadius: "var(--radius-lg)", animationDelay: "160ms" }}>
              <h3 className="heading-display" style={{ fontSize: "17px", color: "var(--text-primary)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Dumbbell size={18} color="var(--accent-pink)" />
                Quick <span className="text-gradient-pink-orange">Start</span>
              </h3>

              {loading ? (
                <div style={{ padding: "30px 0", textAlign: "center", color: "var(--text-secondary)" }}>
                  <Activity size={20} className="animate-spin" color="var(--accent-purple)" />
                </div>
              ) : workouts.length === 0 ? (
                <p style={{ color: "var(--text-secondary)", fontSize: "13px", textAlign: "center", padding: "20px 0" }}>
                  No workouts available yet.
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {workouts.slice(0, 4).map(w => (
                    <button
                      key={w._id}
                      onClick={() => setActiveWorkout(w)}
                      style={{
                        display: "flex", alignItems: "center", gap: "12px",
                        padding: "12px 14px", borderRadius: "var(--radius-md)",
                        background: "rgba(132, 120, 105, 0.04)",
                        border: "1px solid var(--glass-border)",
                        cursor: "pointer", width: "100%", textAlign: "left",
                        transition: "all var(--duration-normal) var(--ease-out)",
                        color: "var(--text-primary)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "rgba(132, 98, 63, 0.3)";
                        e.currentTarget.style.background = "rgba(132, 98, 63, 0.06)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--glass-border)";
                        e.currentTarget.style.background = "rgba(132, 120, 105, 0.04)";
                      }}
                    >
                      <div
                        className="flex-center"
                        style={{
                          width: "32px", height: "32px", borderRadius: "8px",
                          background: "linear-gradient(135deg, var(--accent-purple), var(--accent-pink))",
                          flexShrink: 0,
                        }}
                      >
                        <Play size={14} color="white" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ display: "block", fontSize: "13px", fontWeight: 600 }}>{w.title}</span>
                        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                          {w.exercises?.length || 0} exercises • {w.difficulty}
                        </span>
                      </div>
                      <ChevronRight size={16} color="var(--text-muted)" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </main>

      {/* Workout Player Overlay */}
      {activeWorkout && (
        <WorkoutPlayer
          workout={activeWorkout}
          onClose={() => {
            setActiveWorkout(null);
            fetchDashboardData();
          }}
          onComplete={() => fetchDashboardData()}
        />
      )}
    </div>
  );
}

export default Dashboard;