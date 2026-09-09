import { DAYS_TO_MONITOR } from "../../constants";
import { INCIDENT_DAY } from "../networks";

export default function Timeline({ day, onDay }: { day: number; onDay: (day: number) => void }) {
  const days = Number(DAYS_TO_MONITOR);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "10px 20px",
        borderBottom: "1px solid rgba(29,31,32,.16)",
        background: "#e9e9ea",
        position: "sticky",
        top: 0,
        zIndex: 20,
        flexWrap: "wrap",
      }}
    >
      <div style={{ fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "#5d5d60", flex: "none" }}>
        Timeline
      </div>
      <input
        type="range"
        aria-label="Snapshot day"
        min={1}
        max={days}
        step={1}
        value={day}
        onChange={(e) => onDay(Number(e.target.value))}
        style={{ flex: "1 1 260px", minWidth: 180, height: 20 }}
      />
      <div style={{ display: "flex", gap: 6, flex: "none" }}>
        <button className="btn btn-secondary" onClick={() => onDay(1)} style={{ fontSize: 11, padding: "4px 9px" }}>
          start
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => onDay(INCIDENT_DAY)}
          style={{ fontSize: 11, padding: "4px 9px" }}
        >
          burn day
        </button>
        <button className="btn btn-secondary" onClick={() => onDay(days)} style={{ fontSize: 11, padding: "4px 9px" }}>
          latest
        </button>
      </div>
    </div>
  );
}
