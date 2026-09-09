import { RED, RED_INK } from "../palette";

export default function ErrorBanner({ message }: { message: string }) {
  return (
    <div style={{ margin: 20, padding: 14, border: `1px solid ${RED}`, color: RED_INK }}>
      <strong>Cannot read snapshot history.</strong>
      <span className="mono" style={{ marginLeft: 8 }}>
        {message}
      </span>
      <div style={{ marginTop: 6, fontSize: 12, color: "#5d5d60" }}>
        Monitoring degrades to unknown — no check is reported as passing while the source is unreadable.
      </div>
    </div>
  );
}
