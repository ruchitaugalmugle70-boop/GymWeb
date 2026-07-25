function SkeletonCard({ height = 200, count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{
            height: `${height}px`,
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--glass-border)",
          }}
        />
      ))}
    </>
  );
}

export function SkeletonText({ lines = 3, width }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton skeleton-text"
          style={{
            width: width || (i === lines - 1 ? "50%" : `${80 + Math.random() * 20}%`),
          }}
        />
      ))}
    </div>
  );
}

export function SkeletonStatCard({ count = 3 }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))`, gap: "20px" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{
            height: "140px",
            borderRadius: "var(--radius-lg)",
          }}
        />
      ))}
    </div>
  );
}

export default SkeletonCard;
