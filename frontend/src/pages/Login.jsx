import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dumbbell, Mail, Lock, ArrowRight, Zap, ShieldCheck } from "lucide-react";
import { loginUser, googleLogin } from "../services/api";
import { signInWithGoogle, checkRedirectResult } from "../firebase";
import GymBackgroundVideo from "../components/GymBackgroundVideo";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [emailFocus, setEmailFocus] = useState(false);
  const [passFocus, setPassFocus] = useState(false);

  // Handle redirect sign-in result (fires when popup was blocked and
  // we fell back to signInWithRedirect — the page reloads and lands here)
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
        setErrorMsg("Google sign-in failed after redirect. Try again.");
      } finally {
        setGoogleLoading(false);
      }
    };
    handleRedirect();
  }, [navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      const data = await loginUser(formData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.name);
      navigate("/dashboard");
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // Handle Firebase Google login
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
          "Google sign-in failed. Please try again."
        );
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <>
      {/* ── Injected Styles ── */}
      <style>{`
        @keyframes cardSlideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0;  }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(147, 51, 234, 0.35); }
          50%       { box-shadow: 0 0 35px rgba(6, 182, 212, 0.5); }
        }
        .login-input {
          width: 100%;
          padding: 14px 14px 14px 44px;
          background: rgba(15, 20, 34, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 12px;
          color: #ffffff;
          font-size: 15px;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: all 0.25s ease;
          box-sizing: border-box;
        }
        .login-input:focus {
          border-color: var(--accent-cyan);
          box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.25);
          background: rgba(20, 26, 44, 0.9);
        }
        .login-input::placeholder { color: #64748b; }
        
        .login-btn {
          width: 100%;
          height: 52px;
          background: linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-cyan) 100%);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Outfit', sans-serif;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.25s ease;
          box-shadow: 0 8px 25px rgba(147, 51, 234, 0.4);
          position: relative;
          overflow: hidden;
        }
        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(6, 182, 212, 0.5);
          filter: brightness(1.1);
        }
        .login-btn:active:not(:disabled) { transform: translateY(1px); }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        
        .custom-google-btn {
          width: 100%;
          height: 50px;
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 12px;
          color: #ffffff;
          font-size: 15px;
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
          gap: 14px;
        }
        .or-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
        }
        .or-text {
          font-size: 11px;
          font-weight: 700;
          color: #94a3b8;
          font-family: 'Inter', sans-serif;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
      `}</style>

      {/* Full-Screen Gym Background Video */}
      <GymBackgroundVideo />

      {/* ── Page Container ── */}
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

        {/* ── Main Glass Card ── */}
        <div style={{
          width: "100%",
          maxWidth: "480px",
          background: "rgba(13, 17, 28, 0.82)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: "28px",
          border: "1px solid rgba(255, 255, 255, 0.14)",
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.85)",
          padding: "48px 40px",
          animation: "cardSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          boxSizing: "border-box",
        }}>

          {/* Brand Header */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{
              width: "64px", height: "64px",
              background: "linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))",
              borderRadius: "20px",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
              animation: "pulseGlow 3s infinite alternate",
            }}>
              <Dumbbell size={30} color="white" />
            </div>
            <h1 style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              fontSize: "30px",
              color: "#ffffff",
              margin: "0 0 6px",
              letterSpacing: "-0.5px",
            }}>
              KINETIC<span style={{ color: "var(--accent-cyan)" }}>3D</span>
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0, fontFamily: "'Inter', sans-serif" }}>
              Enter your fitness core terminal
            </p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div style={{
              background: "rgba(239, 68, 68, 0.12)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#fca5a5",
              padding: "12px 16px",
              borderRadius: "10px",
              fontSize: "13px",
              marginBottom: "24px",
              textAlign: "center",
              fontFamily: "'Inter', sans-serif",
            }}>
              {errorMsg}
            </div>
          )}

          {/* ── Google Sign-In Button ── */}
          <div style={{ marginBottom: "22px" }}>
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

          {/* ── OR Divider ── */}
          <div className="or-divider" style={{ marginBottom: "22px" }}>
            <div className="or-line" />
            <span className="or-text">or sign in with email</span>
            <div className="or-line" />
          </div>

          {/* ── Email / Password Form ── */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

            {/* Email */}
            <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
              <label style={{
                fontSize: "11px", fontWeight: 700,
                color: "#cbd5e1",
                textTransform: "uppercase", letterSpacing: "1px",
                fontFamily: "'Inter', sans-serif",
              }}>Email Address</label>
              <div style={{ position: "relative" }}>
                <Mail size={18} color={emailFocus ? "var(--accent-cyan)" : "#64748b"}
                  style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", transition: "color 0.2s" }} />
                <input
                  type="email" name="email"
                  placeholder="athlete@domain.com"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                  required
                  className="login-input"
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
              <label style={{
                fontSize: "11px", fontWeight: 700,
                color: "#cbd5e1",
                textTransform: "uppercase", letterSpacing: "1px",
                fontFamily: "'Inter', sans-serif",
              }}>Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={18} color={passFocus ? "var(--accent-cyan)" : "#64748b"}
                  style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", transition: "color 0.2s" }} />
                <input
                  type="password" name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setPassFocus(true)}
                  onBlur={() => setPassFocus(false)}
                  required
                  className="login-input"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={loading} className="login-btn" style={{ marginTop: "8px" }}>
              {loading ? "Authenticating..." : (<>ENTER DASHBOARD <ArrowRight size={18} /></>)}
            </button>
          </form>

          {/* Register Link */}
          <p style={{
            textAlign: "center", marginTop: "26px",
            color: "#94a3b8", fontSize: "14px",
            fontFamily: "'Inter', sans-serif",
          }}>
            New user?{" "}
            <Link to="/register" style={{ color: "var(--accent-cyan)", textDecoration: "none", fontWeight: 700 }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent-purple)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--accent-cyan)"}
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;