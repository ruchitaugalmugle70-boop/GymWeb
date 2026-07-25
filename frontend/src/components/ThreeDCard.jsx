import { useState, useRef } from "react";

function ThreeDCard({ children, style = {}, className = "", onClick }) {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Width and height of card
    const width = rect.width;
    const height = rect.height;
    
    // Cursor position relative to card top-left
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Normalized coordinates (-0.5 to 0.5)
    const xVal = (mouseX / width) - 0.5;
    const yVal = (mouseY / height) - 0.5;
    
    setCoords({ x: xVal, y: yVal });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 0, y: 0 });
  };

  // Max tilt angle (degrees)
  const maxTilt = 12;
  
  // Calculate rotation:
  // - Moving mouse UP (negative yVal) tilts it FORWARD/UP (positive rotateX)
  // - Moving mouse RIGHT (positive xVal) tilts it RIGHT (positive rotateY)
  const rotateX = -coords.y * maxTilt;
  const rotateY = coords.x * maxTilt;

  const cardStyle = {
    ...style,
    transform: isHovered 
      ? `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
      : `perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
    transition: isHovered ? "transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)" : "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
    transformStyle: "preserve-3d",
    cursor: onClick ? "pointer" : "default"
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`${className}`}
      style={cardStyle}
    >
      <div 
        style={{ 
          transform: isHovered ? "translateZ(30px)" : "translateZ(0px)",
          transition: "transform 0.3s ease",
          height: "100%",
          width: "100%"
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default ThreeDCard;
