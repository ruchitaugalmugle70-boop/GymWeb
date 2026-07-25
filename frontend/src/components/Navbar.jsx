import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Dumbbell, LayoutDashboard, Compass, LogOut, 
  User, Menu, X, ChevronDown, Bell
} from "lucide-react";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [userName, setUserName] = useState("Athlete");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (name) setUserName(name);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserDropdown(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: "/dashboard", icon: <LayoutDashboard size={16} />, label: "Dashboard" },
    { to: "/workouts", icon: <Dumbbell size={16} />, label: "Workouts" },
    { to: "/exercises", icon: <Compass size={16} />, label: "Exercises" },
    { to: "/profile", icon: <User size={16} />, label: "Profile" },
  ];

  const initials = userName
    .split(" ")
    .map(w => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <nav
        className="glass"
        style={{
          position: "sticky",
          top: "12px",
          left: 0,
          right: 0,
          zIndex: 1000,
          margin: "0 auto 24px",
          maxWidth: "1600px",
          width: "95%",
          padding: "10px 20px",
          borderRadius: "var(--radius-lg)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transition: "all var(--duration-normal) var(--ease-out)",
          boxShadow: scrolled
            ? "0 12px 40px rgba(132, 120, 105, 0.15)"
            : "var(--shadow-glass)",
          borderColor: scrolled
            ? "rgba(132, 98, 63, 0.1)"
            : "var(--glass-border)",
        }}
      >
        {/* Logo */}
        <Link
          to="/dashboard"
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
          <div
            className="flex-center"
            style={{
              background: "linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))",
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              boxShadow: "var(--shadow-neon-purple)",
            }}
          >
            <Dumbbell size={18} color="white" />
          </div>
          <span
            className="heading-display"
            style={{
              fontSize: "18px",
              fontWeight: 800,
              background: "linear-gradient(135deg, var(--text-primary) 40%, var(--text-secondary))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "0.5px",
            }}
          >
            KINETIC<span style={{ WebkitTextFillColor: "var(--accent-cyan)" }}>3D</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="nav-links-desktop">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                padding: "8px 14px",
                borderRadius: "var(--radius-md)",
                color: isActive(link.to) ? "#06b6d4" : "var(--text-secondary)",
                background: isActive(link.to) ? "rgba(6, 182, 212, 0.12)" : "transparent",
                border: isActive(link.to) ? "1px solid rgba(6, 182, 212, 0.3)" : "1px solid transparent",
                fontWeight: isActive(link.to) ? 700 : 500,
                transition: "all var(--duration-normal) var(--ease-out)",
                fontSize: "13px",
                position: "relative",
              }}
            >
              {link.icon}
              {link.label}
              {isActive(link.to) && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "-2px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "20px",
                    height: "2px",
                    borderRadius: "1px",
                    background: "var(--accent-cyan)",
                    boxShadow: "0 0 8px var(--accent-cyan)",
                  }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Right side: avatar + mobile toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Notification bell */}
          <button
            style={{
              background: "rgba(132, 120, 105, 0.05)",
              border: "1px solid rgba(132, 120, 105, 0.12)",
              borderRadius: "var(--radius-md)",
              padding: "8px",
              cursor: "pointer",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              position: "relative",
              transition: "all var(--duration-normal) var(--ease-out)",
            }}
          >
            <Bell size={16} />
            <span
              style={{
                position: "absolute",
                top: "6px",
                right: "6px",
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--accent-green)",
                boxShadow: "0 0 6px var(--accent-green)",
              }}
            />
          </button>

          {/* User avatar + dropdown */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setUserDropdown(!userDropdown)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(132, 120, 105, 0.05)",
                border: "1px solid rgba(132, 120, 105, 0.12)",
                borderRadius: "var(--radius-md)",
                padding: "6px 12px 6px 6px",
                cursor: "pointer",
                transition: "all var(--duration-normal) var(--ease-out)",
              }}
            >
              <div
                className="flex-center"
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, var(--accent-purple), var(--accent-pink))",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "white",
                  flexShrink: 0,
                }}
              >
                {initials}
              </div>
              <span
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "13px",
                  fontWeight: 500,
                  maxWidth: "100px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {userName}
              </span>
              <ChevronDown
                size={14}
                color="var(--text-muted)"
                style={{
                  transition: "transform var(--duration-normal) ease",
                  transform: userDropdown ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>

            {/* Dropdown */}
            {userDropdown && (
              <>
                <div
                  style={{ position: "fixed", inset: 0, zIndex: 998 }}
                  onClick={() => setUserDropdown(false)}
                />
                <div
                  className="glass animate-slide-down"
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    minWidth: "180px",
                    borderRadius: "var(--radius-md)",
                    padding: "6px",
                    zIndex: 999,
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                    boxShadow: "var(--shadow-elevated)",
                  }}
                >
                  <Link
                    to="/profile"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 12px",
                      borderRadius: "var(--radius-sm)",
                      color: "var(--text-secondary)",
                      fontSize: "13px",
                      fontWeight: 500,
                      transition: "background var(--duration-fast) ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(132, 120, 105, 0.06)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <User size={14} />
                    My Profile
                  </Link>
                  <div style={{ height: "1px", background: "var(--glass-border)", margin: "4px 8px" }} />
                  <button
                    onClick={handleLogout}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 12px",
                      borderRadius: "var(--radius-sm)",
                      color: "var(--accent-red)",
                      fontSize: "13px",
                      fontWeight: 500,
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      width: "100%",
                      transition: "background var(--duration-fast) ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.06)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="nav-mobile-toggle"
            onClick={() => setMobileOpen(true)}
            style={{
              background: "rgba(132, 120, 105, 0.05)",
              border: "1px solid rgba(132, 120, 105, 0.12)",
              borderRadius: "var(--radius-md)",
              padding: "8px",
              cursor: "pointer",
              color: "var(--text-secondary)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Menu size={18} />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div
            className="nav-mobile-overlay"
            onClick={() => setMobileOpen(false)}
          />
          <div className="nav-mobile-drawer">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <span className="heading-display" style={{ fontSize: "18px", color: "var(--text-primary)" }}>
                Menu
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                <X size={20} />
              </button>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "14px 16px",
                  borderRadius: "var(--radius-md)",
                  color: isActive(link.to) ? "var(--accent-purple)" : "var(--text-secondary)",
                  background: isActive(link.to) ? "rgba(168, 85, 247, 0.08)" : "transparent",
                  fontWeight: isActive(link.to) ? 600 : 500,
                  fontSize: "15px",
                  transition: "all var(--duration-normal) var(--ease-out)",
                }}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}

            <div style={{ flex: 1 }} />

            <button
              onClick={handleLogout}
              className="cyber-btn-danger"
              style={{ width: "100%", justifyContent: "center" }}
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default Navbar;
