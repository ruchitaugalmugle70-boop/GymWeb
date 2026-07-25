import { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipForward, CheckCircle, Volume2, Trophy, Clock, Flame, Zap } from "lucide-react";
import { logProgress } from "../services/api";

function WorkoutPlayer({ workout, onClose, onComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [status, setStatus] = useState("work"); // 'work', 'rest', 'completed'
  
  // Timer States
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);
  
  // Stats accumulators
  const [elapsedTime, setElapsedTime] = useState(0); // in seconds
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  
  const timerRef = useRef(null);
  const audioContextRef = useRef(null);

  const currentExerciseLink = workout.exercises[currentIdx];
  const exercise = currentExerciseLink?.exercise;
  const isLastExercise = currentIdx === workout.exercises.length - 1;
  const isLastSet = currentSet === currentExerciseLink?.sets;

  // Synthesize beep sound using Web Audio API
  const playBeep = (freq = 600, duration = 0.15) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio Context could not start", e);
    }
  };

  // Main tick hook
  useEffect(() => {
    if (status === "completed") return;

    if (isActive) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
        
        // Accumulate calorie burn rate
        if (status === "work" && exercise) {
          const calsPerSec = (exercise.caloriesBurnedPerMinute || 8) / 60;
          setCaloriesBurned(prev => prev + calsPerSec);
        }

        if (status === "rest") {
          setSeconds(prev => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              playBeep(880, 0.4); // High alert beep
              handleResumeWork();
              return 0;
            }
            if (prev <= 4) {
              playBeep(440, 0.1); // Countdown beep
            }
            return prev - 1;
          });
        } else {
          setSeconds(prev => prev + 1);
        }
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, status, currentIdx, currentSet]);

  const handleResumeWork = () => {
    setStatus("work");
    setIsActive(true);
    setSeconds(0);
  };

  const handleNextStep = () => {
    // If working, move to rest or next set
    if (status === "work") {
      playBeep(523.25, 0.2); // Beep C5
      
      if (isLastSet) {
        if (isLastExercise) {
          // Workout completed!
          handleCompleteWorkout();
        } else {
          // Go to rest then next exercise
          setStatus("rest");
          setSeconds(currentExerciseLink.restTime || 45);
        }
      } else {
        // Go to rest then next set of same exercise
        setStatus("rest");
        setSeconds(currentExerciseLink.restTime || 45);
      }
    }
  };

  const handleSkipRest = () => {
    playBeep(659.25, 0.2); // Beep E5
    if (isLastSet) {
      setCurrentIdx(prev => prev + 1);
      setCurrentSet(1);
    } else {
      setCurrentSet(prev => prev + 1);
    }
    handleResumeWork();
  };

  // When timer triggers resume work
  useEffect(() => {
    if (status === "work" && seconds === 0 && elapsedTime > 0) {
      // Transition from rest completed
      if (isLastSet) {
        setCurrentIdx(prev => prev + 1);
        setCurrentSet(1);
      } else {
        setCurrentSet(prev => prev + 1);
      }
    }
  }, [status]);

  const handleCompleteWorkout = async () => {
    setIsActive(false);
    setStatus("completed");
    playBeep(880, 0.25);
    setTimeout(() => playBeep(1100, 0.4), 200);

    try {
      const minutes = Math.max(1, Math.round(elapsedTime / 60));
      await logProgress({
        workoutId: workout._id,
        completed: true,
        caloriesBurned: Math.round(caloriesBurned),
        workoutDuration: minutes
      });
      if (onComplete) onComplete();
    } catch (err) {
      console.error("Error logging workout progress:", err);
    }
  };

  const formatTime = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!exercise && status !== "completed") return null;

  return (
    <div 
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--bg-primary)",
        zIndex: 1500,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto"
      }}
      className="cyber-grid"
    >
      {/* Top Header */}
      <div 
        style={{
          padding: "20px 40px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div>
          <span style={{ color: "var(--accent-purple)", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1.5px" }}>
            Active Session
          </span>
          <h1 className="heading-display" style={{ fontSize: "24px", color: "white", margin: "4px 0 0" }}>
            {workout.title}
          </h1>
        </div>

        <button 
          onClick={onClose}
          style={{
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            color: "var(--text-secondary)",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.4)"}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)"}
        >
          Quit Workout
        </button>
      </div>

      {status !== "completed" ? (
        <div style={{ flex: 1, display: "flex", flexWrap: "wrap", padding: "40px", gap: "40px", maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
          
          {/* Left Panel: Exercise Video and Info */}
          <div style={{ flex: "1.4", minWidth: "320px", display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Embedded Video */}
            <div 
              className="glass" 
              style={{ 
                borderRadius: "16px", 
                overflow: "hidden", 
                border: "1px solid rgba(255, 255, 255, 0.06)",
                position: "relative",
                paddingTop: "56.25%",
                background: "#000"
              }}
            >
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
                <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Zap size={40} className="animate-pulse-slow" color="var(--accent-purple)" />
                </div>
              )}
            </div>

            {/* Exercise Details Card */}
            <div className="glass" style={{ padding: "24px", borderRadius: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div>
                  <h2 className="heading-display" style={{ fontSize: "22px", color: "white" }}>
                    {exercise.name}
                  </h2>
                  <span style={{ fontSize: "13px", color: "var(--accent-cyan)", fontWeight: "600", textTransform: "uppercase", marginTop: "4px", display: "inline-block" }}>
                    Target: {exercise.muscleGroup}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "12px", background: "rgba(255, 255, 255, 0.02)", padding: "8px 16px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                  <div style={{ textAlign: "center" }}>
                    <span style={{ display: "block", fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase" }}>Set</span>
                    <span style={{ fontSize: "16px", fontWeight: "700", color: "var(--accent-purple)" }}>
                      {currentSet} / {currentExerciseLink.sets}
                    </span>
                  </div>
                  <div style={{ width: "1px", background: "rgba(255, 255, 255, 0.1)" }} />
                  <div style={{ textAlign: "center" }}>
                    <span style={{ display: "block", fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase" }}>Reps</span>
                    <span style={{ fontSize: "16px", fontWeight: "700", color: "white" }}>
                      {currentExerciseLink.reps}
                    </span>
                  </div>
                </div>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6" }}>
                {exercise.description}
              </p>
            </div>
          </div>

          {/* Right Panel: Workout Dashboard Console */}
          <div style={{ flex: "1", minWidth: "300px", display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Live Stats */}
            <div style={{ display: "flex", gap: "16px" }}>
              <div className="glass" style={{ flex: 1, padding: "16px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "12px" }}>
                <Clock size={24} color="var(--accent-cyan)" />
                <div>
                  <span style={{ display: "block", fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase" }}>Duration</span>
                  <span style={{ fontSize: "18px", fontWeight: "800", color: "white" }}>
                    {formatTime(elapsedTime)}
                  </span>
                </div>
              </div>
              <div className="glass" style={{ flex: 1, padding: "16px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "12px" }}>
                <Flame size={24} color="var(--accent-pink)" />
                <div>
                  <span style={{ display: "block", fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase" }}>Est. Burn</span>
                  <span style={{ fontSize: "18px", fontWeight: "800", color: "white" }}>
                    {Math.round(caloriesBurned)} kcal
                  </span>
                </div>
              </div>
            </div>

            {/* Timer Controller */}
            <div 
              className="glass" 
              style={{ 
                padding: "40px 24px", 
                borderRadius: "16px", 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                justifyContent: "center",
                gap: "24px",
                border: status === "rest" ? "1px solid rgba(6, 182, 212, 0.4)" : "1px solid var(--glass-border)",
                boxShadow: status === "rest" ? "0 0 30px rgba(6, 182, 212, 0.15)" : "var(--shadow-glass)"
              }}
            >
              {status === "work" ? (
                <>
                  <span style={{ color: "var(--text-secondary)", fontSize: "14px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: "600" }}>
                    Working Sets
                  </span>
                  
                  <div style={{ fontSize: "64px", fontWeight: "800", color: "white", fontFamily: "var(--font-display)" }}>
                    {formatTime(seconds)}
                  </div>

                  <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                    <button
                      onClick={() => setIsActive(!isActive)}
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "50%",
                        border: "none",
                        background: "white",
                        color: "black",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                    >
                      {isActive ? <Pause size={24} fill="black" /> : <Play size={24} fill="black" />}
                    </button>

                    <button
                      onClick={handleNextStep}
                      className="cyber-btn"
                      style={{
                        padding: "16px 28px",
                        height: "56px"
                      }}
                    >
                      <CheckCircle size={18} />
                      Set Complete
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--accent-cyan)" }} className="glow-cyan animate-pulse-slow">
                    <Volume2 size={20} />
                    <span style={{ fontSize: "14px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: "700" }}>
                      Take a Rest
                    </span>
                  </div>

                  <div style={{ fontSize: "72px", fontWeight: "800", color: "var(--accent-cyan)", fontFamily: "var(--font-display)" }}>
                    {seconds}
                  </div>

                  <div style={{ color: "var(--text-secondary)", fontSize: "14px", textAlign: "center" }}>
                    Next up: <strong style={{ color: "white" }}>{isLastSet ? workout.exercises[currentIdx + 1]?.exercise.name : exercise.name}</strong>
                  </div>

                  <button
                    onClick={handleSkipRest}
                    className="cyber-btn-outline"
                    style={{
                      borderColor: "var(--accent-cyan)",
                      color: "var(--accent-cyan)",
                      padding: "12px 24px",
                      width: "100%",
                      maxWidth: "200px"
                    }}
                  >
                    <SkipForward size={16} />
                    Skip Rest
                  </button>
                </>
              )}
            </div>

            {/* Exercise Timeline Checklist */}
            <div className="glass" style={{ padding: "24px", borderRadius: "16px", flex: 1 }}>
              <h3 className="heading-display" style={{ fontSize: "16px", color: "white", marginBottom: "16px" }}>
                Workout Timeline
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {workout.exercises.map((link, idx) => {
                  const active = idx === currentIdx;
                  const completed = idx < currentIdx;
                  return (
                    <div 
                      key={link._id || idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px",
                        borderRadius: "10px",
                        background: active ? "rgba(168, 85, 247, 0.06)" : "transparent",
                        border: active ? "1px solid rgba(168, 85, 247, 0.2)" : "1px solid transparent",
                        opacity: completed ? 0.5 : 1,
                        transition: "all 0.3s ease"
                      }}
                    >
                      <div 
                        className="flex-center" 
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          background: completed ? "var(--accent-green)" : (active ? "var(--accent-purple)" : "rgba(255, 255, 255, 0.05)"),
                          color: completed || active ? "black" : "var(--text-secondary)",
                          fontSize: "12px",
                          fontWeight: "700"
                        }}
                      >
                        {completed ? "✓" : idx + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ display: "block", fontSize: "14px", fontWeight: active ? "700" : "500", color: active ? "white" : "var(--text-secondary)" }}>
                          {link.exercise.name}
                        </span>
                        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                          {link.sets} sets x {link.reps} reps
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* Completed Screen */
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "40px" }}>
          <div 
            className="glass" 
            style={{ 
              width: "100%", 
              maxWidth: "500px", 
              borderRadius: "24px", 
              padding: "40px", 
              textAlign: "center",
              border: "1px solid var(--accent-purple)",
              boxShadow: "var(--shadow-neon-purple)",
              animation: "float 6s ease-in-out infinite"
            }}
          >
            <div 
              className="flex-center animate-pulse-slow" 
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))",
                boxShadow: "0 0 30px rgba(168, 85, 247, 0.4)",
                margin: "0 auto 24px"
              }}
            >
              <Trophy size={40} color="white" />
            </div>

            <h2 className="heading-display" style={{ fontSize: "28px", color: "white", marginBottom: "8px" }}>
              Workout Completed!
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "30px" }}>
              Fantastic effort! Your stats have been recorded in your progress profile. Keep pushing!
            </p>

            {/* Workout Summary metrics */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "30px" }}>
              <div style={{ flex: 1, background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.05)", padding: "16px 8px", borderRadius: "12px" }}>
                <Clock size={20} color="var(--accent-cyan)" style={{ marginBottom: "6px" }} />
                <span style={{ display: "block", fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase" }}>Duration</span>
                <span style={{ fontSize: "18px", fontWeight: "800", color: "white" }}>
                  {Math.round(elapsedTime / 60)} min
                </span>
              </div>

              <div style={{ flex: 1, background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.05)", padding: "16px 8px", borderRadius: "12px" }}>
                <Flame size={20} color="var(--accent-pink)" style={{ marginBottom: "6px" }} />
                <span style={{ display: "block", fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase" }}>Calories</span>
                <span style={{ fontSize: "18px", fontWeight: "800", color: "white" }}>
                  {Math.round(caloriesBurned)} kcal
                </span>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="cyber-btn"
              style={{ width: "100%" }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkoutPlayer;
