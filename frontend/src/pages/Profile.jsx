import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { getProfile, updateProfile } from "../services/api";
import { useToast } from "../components/Toast";
import {
  User, Mail, Scale, Ruler, Target, Activity,
  Save, Heart, Flame, Shield, TrendingUp
} from "lucide-react";

const FITNESS_GOALS = [
  { value: "lose_weight", label: "Lose Weight", icon: <Flame size={16} />, color: "var(--accent-pink)" },
  { value: "build_muscle", label: "Build Muscle", icon: <Shield size={16} />, color: "var(--accent-purple)" },
  { value: "maintain", label: "Maintain Fitness", icon: <Heart size={16} />, color: "var(--accent-green)" },
  { value: "improve_endurance", label: "Endurance", icon: <TrendingUp size={16} />, color: "var(--accent-cyan)" },
];

const AVATAR_COLORS = [
  "#a855f7", "#ec4899", "#06b6d4", "#10b981",
  "#f97316", "#3b82f6", "#eab308", "#ef4444",
];

function getBMI(weight, height) {
  if (!weight || !height) return null;
  const heightM = height / 100;
  return (weight / (heightM * heightM)).toFixed(1);
}

function getBMICategory(bmi) {
  if (bmi < 18.5) return { label: "Underweight", color: "var(--accent-cyan)" };
  if (bmi < 25) return { label: "Normal", color: "var(--accent-green)" };
  if (bmi < 30) return { label: "Overweight", color: "var(--accent-orange)" };
  return { label: "Obese", color: "var(--accent-red)" };
}

function getBMIPosition(bmi) {
  // Map BMI 14–40 to 0%–100%
  const clamped = Math.max(14, Math.min(40, parseFloat(bmi)));
  return ((clamped - 14) / (40 - 14)) * 100;
}

function Profile() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    goalWeight: "",
    fitnessGoal: "",
    avatarColor: "#a855f7",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      setProfile({
        name: data.name || "",
        email: data.email || "",
        age: data.age || "",
        gender: data.gender || "",
        height: data.height || "",
        weight: data.weight || "",
        goalWeight: data.goalWeight || "",
        fitnessGoal: data.fitnessGoal || "",
        avatarColor: data.avatarColor || "#a855f7",
      });
    } catch (err) {
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { email, ...updateData } = profile;
      // Convert numeric fields
      const payload = {
        ...updateData,
        age: updateData.age ? Number(updateData.age) : undefined,
        height: updateData.height ? Number(updateData.height) : undefined,
        weight: updateData.weight ? Number(updateData.weight) : undefined,
        goalWeight: updateData.goalWeight ? Number(updateData.goalWeight) : undefined,
      };
      await updateProfile(payload);
      // Update localStorage name
      if (profile.name) localStorage.setItem("userName", profile.name);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const bmi = getBMI(profile.weight, profile.height);
  const bmiCategory = bmi ? getBMICategory(parseFloat(bmi)) : null;

  const initials = profile.name
    ? profile.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }} className="cyber-grid">
        <Navbar />
        <main className="page-container" style={{ paddingBottom: "60px" }}>
          <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
            <Activity size={32} color="var(--accent-purple)" className="animate-spin" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", paddingBottom: "60px" }} className="cyber-grid">
      <Navbar />

      <main className="page-container">
        {/* Page Header */}
        <div className="animate-slide-up">
          <span style={{ color: "var(--accent-purple)", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2.5px" }}>
            Account Settings
          </span>
          <h1 className="heading-display" style={{ fontSize: "34px", color: "var(--text-primary)", margin: "4px 0 0" }}>
            My <span className="text-gradient-purple-cyan">Profile</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "6px" }}>
            Manage your personal information and fitness preferences.
          </p>
        </div>

        <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
          {/* Left: Avatar & Quick Info */}
          <div style={{ flex: "1", minWidth: "280px", display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Avatar Card */}
            <div
              className="glass animate-slide-up"
              style={{
                padding: "32px",
                borderRadius: "var(--radius-xl)",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <div
                className="flex-center"
                style={{
                  width: "88px",
                  height: "88px",
                  borderRadius: "20px",
                  background: `linear-gradient(135deg, ${profile.avatarColor}, ${profile.avatarColor}88)`,
                  fontSize: "28px",
                  fontWeight: 800,
                  color: "#fff",
                  fontFamily: "var(--font-display)",
                  boxShadow: `0 8px 24px ${profile.avatarColor}40`,
                }}
              >
                {initials}
              </div>

              <div>
                <h2 className="heading-display" style={{ fontSize: "20px", color: "var(--text-primary)" }}>
                  {profile.name || "User"}
                </h2>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "center", marginTop: "4px" }}>
                  <Mail size={13} color="var(--text-muted)" />
                  <span style={{ color: "var(--text-secondary)", fontSize: "13px" }}>{profile.email}</span>
                </div>
              </div>

              {/* Avatar color picker */}
              <div>
                <span style={{ display: "block", fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>
                  Avatar Color
                </span>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                  {AVATAR_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => updateField("avatarColor", color)}
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "8px",
                        background: color,
                        border: profile.avatarColor === color ? "2px solid white" : "2px solid transparent",
                        cursor: "pointer",
                        transition: "all var(--duration-fast) ease",
                        boxShadow: profile.avatarColor === color ? `0 0 12px ${color}` : "none",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* BMI Widget */}
            <div
              className="glass animate-slide-up"
              style={{
                padding: "24px",
                borderRadius: "var(--radius-xl)",
                animationDelay: "100ms",
              }}
            >
              <h3 className="heading-display" style={{ fontSize: "16px", color: "var(--text-primary)", marginBottom: "16px" }}>
                BMI <span className="text-gradient-green-cyan">Calculator</span>
              </h3>

              {bmi ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ textAlign: "center" }}>
                    <span style={{ fontSize: "42px", fontWeight: 800, color: bmiCategory.color, fontFamily: "var(--font-display)" }}>
                      {bmi}
                    </span>
                    <div
                      className="stat-badge"
                      style={{
                        background: `${bmiCategory.color}18`,
                        border: `1px solid ${bmiCategory.color}40`,
                        color: bmiCategory.color,
                        margin: "8px auto 0",
                      }}
                    >
                      {bmiCategory.label}
                    </div>
                  </div>

                  <div className="bmi-gauge">
                    <div className="bmi-indicator" style={{ left: `${getBMIPosition(bmi)}%` }} />
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--text-muted)" }}>
                    <span>14</span>
                    <span>18.5</span>
                    <span>25</span>
                    <span>30</span>
                    <span>40</span>
                  </div>
                </div>
              ) : (
                <div style={{ padding: "24px", textAlign: "center", color: "var(--text-secondary)", fontSize: "13px" }}>
                  Enter your height and weight to calculate BMI
                </div>
              )}
            </div>

            {/* Fitness Goal */}
            <div
              className="glass animate-slide-up"
              style={{
                padding: "24px",
                borderRadius: "var(--radius-xl)",
                animationDelay: "200ms",
              }}
            >
              <h3 className="heading-display" style={{ fontSize: "16px", color: "var(--text-primary)", marginBottom: "16px" }}>
                Fitness <span className="text-gradient-purple-cyan">Goal</span>
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {FITNESS_GOALS.map((goal) => (
                  <button
                    key={goal.value}
                    onClick={() => updateField("fitnessGoal", goal.value)}
                    style={{
                      padding: "14px 12px",
                      borderRadius: "var(--radius-md)",
                      background: profile.fitnessGoal === goal.value ? `${goal.color}15` : "rgba(132, 120, 105, 0.04)",
                      border: profile.fitnessGoal === goal.value ? `1px solid ${goal.color}40` : "1px solid var(--glass-border)",
                      color: profile.fitnessGoal === goal.value ? goal.color : "var(--text-secondary)",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "12px",
                      fontWeight: 600,
                      transition: "all var(--duration-normal) var(--ease-out)",
                    }}
                  >
                    {goal.icon}
                    {goal.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Form Fields */}
          <div style={{ flex: "2", minWidth: "320px", display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Personal Info */}
            <div
              className="glass animate-slide-up"
              style={{ padding: "28px", borderRadius: "var(--radius-xl)", animationDelay: "60ms" }}
            >
              <h3 className="heading-display" style={{ fontSize: "16px", color: "var(--text-primary)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                <User size={18} color="var(--accent-purple)" />
                Personal Information
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {/* Name */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Full Name
                  </label>
                  <input
                    className="cyber-input"
                    value={profile.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="John Doe"
                  />
                </div>

                {/* Age */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Age
                  </label>
                  <input
                    className="cyber-input"
                    type="number"
                    value={profile.age}
                    onChange={(e) => updateField("age", e.target.value)}
                    placeholder="25"
                    min="13"
                    max="120"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Gender
                  </label>
                  <select
                    className="cyber-input"
                    value={profile.gender}
                    onChange={(e) => updateField("gender", e.target.value)}
                    style={{ cursor: "pointer" }}
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Body Metrics */}
            <div
              className="glass animate-slide-up"
              style={{ padding: "28px", borderRadius: "var(--radius-xl)", animationDelay: "120ms" }}
            >
              <h3 className="heading-display" style={{ fontSize: "16px", color: "var(--text-primary)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                <Scale size={18} color="var(--accent-cyan)" />
                Body Metrics
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {/* Height */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Height (cm)
                  </label>
                  <div style={{ position: "relative" }}>
                    <Ruler size={16} color="var(--text-muted)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      className="cyber-input"
                      type="number"
                      value={profile.height}
                      onChange={(e) => updateField("height", e.target.value)}
                      placeholder="175"
                      style={{ paddingLeft: "38px" }}
                    />
                  </div>
                </div>

                {/* Weight */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Current Weight (kg)
                  </label>
                  <div style={{ position: "relative" }}>
                    <Scale size={16} color="var(--text-muted)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      className="cyber-input"
                      type="number"
                      value={profile.weight}
                      onChange={(e) => updateField("weight", e.target.value)}
                      placeholder="70"
                      style={{ paddingLeft: "38px" }}
                    />
                  </div>
                </div>

                {/* Goal Weight */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Goal Weight (kg)
                  </label>
                  <div style={{ position: "relative" }}>
                    <Target size={16} color="var(--text-muted)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      className="cyber-input"
                      type="number"
                      value={profile.goalWeight}
                      onChange={(e) => updateField("goalWeight", e.target.value)}
                      placeholder="65"
                      style={{ paddingLeft: "38px" }}
                    />
                  </div>
                  {profile.weight && profile.goalWeight && (
                    <div style={{ marginTop: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-muted)", marginBottom: "6px" }}>
                        <span>Current: {profile.weight} kg</span>
                        <span>Goal: {profile.goalWeight} kg</span>
                      </div>
                      <div className="progress-bar-track">
                        <div
                          className="progress-bar-fill"
                          style={{
                            width: `${Math.min(100, Math.max(0,
                              profile.goalWeight < profile.weight
                                ? ((profile.weight - profile.goalWeight) / profile.weight) * 100
                                : ((profile.weight / profile.goalWeight) * 100)
                            ))}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div
              className="glass animate-slide-up"
              style={{ padding: "28px", borderRadius: "var(--radius-xl)", animationDelay: "180ms" }}
            >
              <h3 className="heading-display" style={{ fontSize: "16px", color: "var(--text-primary)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                <Mail size={18} color="var(--accent-green)" />
                Account
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderRadius: "var(--radius-md)", background: "rgba(132, 120, 105, 0.04)", border: "1px solid var(--glass-border)" }}>
                  <div>
                    <span style={{ display: "block", fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Email Address</span>
                    <span style={{ fontSize: "14px", color: "var(--text-primary)", fontWeight: 500 }}>{profile.email}</span>
                  </div>
                  <div className="stat-badge" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "var(--accent-green)" }}>
                    Verified
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="cyber-btn animate-slide-up"
              style={{
                width: "100%",
                height: "52px",
                fontSize: "14px",
                animationDelay: "240ms",
              }}
            >
              {saving ? (
                <Activity size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {saving ? "Saving Changes..." : "Save Profile"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
