export default function ThermalDivider() {
  return (
    <div className="relative w-full overflow-hidden" style={{ backgroundColor: "#0A0C0F" }}>
      {/* Gradient line warm → cold */}
      <div
        className="w-full h-px"
        style={{
          background:
            "linear-gradient(to right, rgba(255,107,26,0.6) 0%, rgba(255,107,26,0.3) 25%, rgba(56,189,248,0.3) 75%, rgba(56,189,248,0.6) 100%)",
        }}
      />

      {/* Label strip */}
      <div
        className="w-full flex items-center justify-center gap-0 py-4 overflow-hidden"
        style={{ backgroundColor: "#090B0E" }}
      >
        {[
          { label: "HEATING",       warm: true  },
          { label: "·",             warm: null  },
          { label: "AIR CONDITIONING", warm: false },
          { label: "·",             warm: null  },
          { label: "VENTILATION",   warm: false },
          { label: "·",             warm: null  },
          { label: "MAINTENANCE",   warm: null  },
        ].map((item, i) => (
          <span
            key={i}
            className="font-data text-[9px] tracking-[0.3em] uppercase px-3"
            style={{
              color:
                item.warm === true
                  ? "rgba(255,107,26,0.45)"
                  : item.warm === false
                  ? "rgba(56,189,248,0.45)"
                  : "rgba(255,255,255,0.12)",
            }}
          >
            {item.label}
          </span>
        ))}
      </div>

      {/* Gradient line cold → warm (inverted, softer) */}
      <div
        className="w-full h-px"
        style={{
          background:
            "linear-gradient(to right, rgba(56,189,248,0.15) 0%, transparent 40%, transparent 60%, rgba(255,107,26,0.15) 100%)",
        }}
      />
    </div>
  );
}
