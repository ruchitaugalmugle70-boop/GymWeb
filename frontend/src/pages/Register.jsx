import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dumbbell, User, Mail, Lock, UserPlus, ArrowLeft } from "lucide-react";
import { registerUser, googleLogin } from "../services/api";
import { signInWithGoogle, checkRedirectResult } from "../firebase";
import GymBackgroundVideo from "../components/GymBackgroundVideo";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Handle redirect sign-in result (fires when popup was blocked)
  useEffect(() => {
    const handleRedirect = async () => {
      setGoogleLoading(true);
      try {
        const result = await checkRedirectResult();
        if (result) {
          const data = await googleLogin(result.idToken);
          localStorage.setItem("token", data.token);
          localStorage.setItem("userName", data.name);
          navigate("/dashboard");
        }
      } catch (err) {
        console.error("Redirect sign-in error:", err);
        setErrorMsg("Google sign-up failed after redirect. Try again.");
      } finally {
        setGoogleLoading(false);
      }
    };
    handleRedirect();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (formData.password !== formData.confirmPassword) {
      return setErrorMsg("Passwords do not match");
    }

    try {
      setLoading(true);
      const data = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // Auto-login: save token & name, go straight to dashboard
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.name);

      setSuccessMsg("Profile registered! Taking you to your dashboard...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle Firebase Google credential response
  const handleGoogleSignIn = async () => {
    setErrorMsg("");
    setGoogleLoading(true);
    try {
      const result = await signInWithGoogle();
      if (!result) return;
      const data = await googleLogin(result.idToken);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.name);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      if (error.message === "POPUP_CLOSED") {
        setErrorMsg("");
      } else {
        setErrorMsg(
          error.response?.data?.message ||
          "Google sign-up failed. Please try again."
        );
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes cardSlideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(147, 51, 234, 0.35); }
          50%       { box-shadow: 0 0 35px rgba(6, 182, 212, 0.5); }
        }
        .reg-input {
          width: 100%;
          padding: 13px 14px 13px 42px;
          background: rgba(15, 20, 34, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 12px;
          color: #ffffff;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: all 0.25s ease;
          box-sizing: border-box;
        }
        .reg-input:focus {
          border-color: var(--accent-cyan);
          box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.25);
          background: rgba(20, 26, 44, 0.9);
        }
        .reg-input::placeholder { color: #64748b; }
        
        .reg-btn {
          width: 100%;
          height: 50px;
          background: linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-cyan) 100%);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          font-family: 'Outfit', sans-serif;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.25s ease;
          box-shadow: 0 8px 25px rgba(147, 51, 234, 0.4);
        }
        .reg-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(6, 182, 212, 0.5);
          filter: brightness(1.1);
        }
        .reg-btn:active:not(:disabled) { transform: translateY(1px); }
        .reg-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        
        .custom-google-btn {
          width: 100%;
          height: 48px;
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 12px;
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s ease;
        }
        .custom-google-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.14);
          border-color: var(--accent-cyan);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(6, 182, 212, 0.2);
        }
        .custom-google-btn:active:not(:disabled) {
          transform: translateY(1px);
        }
        .or-divider {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .or-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
        }
        .or-text {
          font-size: 10px;
          font-weight: 700;
          color: #94a3b8;
          font-family: 'Inter', sans-serif;
          letter-spacing: 2px;
          text-transform: uppercase;
          white-space: nowrap;
        }
      `}</style>

      {/* Background Video */}
      <GymBackgroundVideo />

      {/* Page Wrapper */}
      <div style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px 20px",
        position: "relative",
        zIndex: 10,
        boxSizing: "border-box",
      }}>

        {/* Register Glass Card */}
        <div style={{
          width: "100%", maxWidth: "480px",
          background: "rgba(13, 17, 28, 0.82)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: "28px",
          border: "1px solid rgba(255, 255, 255, 0.14)",
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.85)",
          padding: "46px 40px",
          animation: "cardSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          boxSizing: "border-box",
        }}>

          {/* Brand Logo */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div style={{
              background: "linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))",
              width: "60px", height: "60px",
              borderRadius: "18px",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 14px",
              animation: "pulseGlow 3s infinite alternate",
            }}>
              <Dumbbell size={28} color="white" />
            </div>
            <h2 style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800, fontSize: "28px",
              color: "#ffffff", margin: "0 0 6px",
              letterSpacing: "-0.3px",
            }}>
              CREATE <span style={{ color: "var(--accent-cyan)" }}>PROFILE</span>
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0, fontFamily: "'Inter', sans-serif" }}>
              Establish your athletic credentials
            </p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div style={{
              background: "rgba(239, 68, 68, 0.12)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#fca5a5",
              padding: "10px 14px", borderRadius: "10px",
              fontSize: "13px", marginBottom: "18px",
              textAlign: "center", fontFamily: "'Inter', sans-serif",
            }}>
              {errorMsg}
            </div>
          )}

          {/* Success Banner */}
          {successMsg && (
            <div style={{
              background: "rgba(16, 185, 129, 0.12)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              color: "#6ee7b7",
              padding: "10px 14px", borderRadius: "10px",
              fontSize: "13px", marginBottom: "18px",
              textAlign: "center", fontFamily: "'Inter', sans-serif",
            }}>
              {successMsg}
            </div>
          )}

          {/* Google Sign-Up Button */}
          <div style={{ marginBottom: "18px" }}>
            <button
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="custom-google-btn"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" style={{ marginRight: "12px" }}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.62-.63-1.09-1.39-1.37-2.21z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              {googleLoading ? "Connecting to Google..." : "Continue with Google"}
            </button>
          </div>

          {/* OR Divider */}
          <div className="or-divider" style={{ marginBottom: "18px" }}>
            <div className="or-line" />
            <span className="or-text">or register with email</span>
            <div className="or-line" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>

            {/* Username */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontSize: "11px", color: "#cbd5e1", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", fontFamily: "'Inter', sans-serif" }}>
                Username
              </span>
              <div style={{ position: "relative" }}>
                <User size={16} color="#64748b"
                  style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="text" name="name"
                  placeholder="Athlete name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="reg-input"
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontSize: "11px", color: "#cbd5e1", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", fontFamily: "'Inter', sans-serif" }}>
                Email Address
              </span>
              <div style={{ position: "relative" }}>
                <Mail size={16} color="#64748b"
                  style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="email" name="email"
                  placeholder="athlete@domain.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="reg-input"
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontSize: "11px", color: "#cbd5e1", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", fontFamily: "'Inter', sans-serif" }}>
                Password
              </span>
              <div style={{ position: "relative" }}>
                <Lock size={16} color="#64748b"
                  style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="password" name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="reg-input"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontSize: "11px", color: "#cbd5e1", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", fontFamily: "'Inter', sans-serif" }}>
                Confirm Password
              </span>
              <div style={{ position: "relative" }}>
                <Lock size={16} color="#64748b"
                  style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="password" name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="reg-input"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="reg-btn"
              style={{ marginTop: "8px" }}
            >
              {loading ? "Creating Profile..." : (
                <>
                  <UserPlus size={17} />
                  REGISTER ACCOUNT
                </>
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div style={{ textAlign: "center", marginTop: "22px" }}>
            <Link
              to="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: "#94a3b8",
                textDecoration: "none",
                fontSize: "13px",
                fontFamily: "'Inter', sans-serif",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent-cyan)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
            >
              <ArrowLeft size={15} />
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;