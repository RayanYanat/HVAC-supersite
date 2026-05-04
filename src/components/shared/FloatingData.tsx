/* Ambient data fragments — subliminal control-room layer
   Drift slowly, barely visible, reinforce the "live system" feel */

interface DataPoint {
  text: string;
  x: string; y: string;
  delay: string;
  duration: string;
  opacity: number;
}

interface Props {
  points: DataPoint[];
}

export default function FloatingData({ points }: Props) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden>
      {points.map((d, i) => (
        <span
          key={i}
          className="absolute font-data text-[9px] tracking-[0.2em] uppercase whitespace-nowrap"
          style={{
            left: d.x,
            top:  d.y,
            color: "rgba(255,255,255,1)",
            ["--d-op" as string]: d.opacity,
            opacity: d.opacity,
            animation: `float-data ${d.duration} ease-in-out ${d.delay} infinite`,
          }}
        >
          {d.text}
        </span>
      ))}
    </div>
  );
}
