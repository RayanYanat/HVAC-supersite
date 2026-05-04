export default function GlobalTexture() {
  return (
    <>
      {/* Film grain — persistent across entire page */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 9000,
          opacity: 0.038,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
          animation: "grain 0.5s steps(1) infinite",
        }}
        aria-hidden
      />

      {/* Scanlines */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 9001,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.028) 3px, rgba(0,0,0,0.028) 4px)",
        }}
        aria-hidden
      />
    </>
  );
}
