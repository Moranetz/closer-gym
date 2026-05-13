import Link from "next/link";

export default function Analysis() {
  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: "24px 24px 64px" }}>
      <div className="flex items-baseline gap-4 mb-3">
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em" }}>Analysis</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Upload a real call · get an engine report</p>
      </div>
      <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24, maxWidth: 720, lineHeight: 1.55 }}>
        Drop a recording (audio or transcript). The detector tags every operator utterance with Atlas technique IDs. The eval function scores each move. You get the same blunder-marked review you&apos;d get after a bot game — but on a real call.
      </p>

      <div className="tile" style={{ padding: 32, marginBottom: 24, borderStyle: "dashed", borderColor: "var(--border-strong)", textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.5 }}>📁</div>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Drop call recording or transcript</h2>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20, maxWidth: 480, margin: "0 auto 20px" }}>
          .mp3 / .m4a / .wav (auto-transcribed via Whisper) or .txt / .vtt / .srt
        </p>
        <button className="btn btn-secondary btn-lg" disabled>
          Upload · v0.2
        </button>
      </div>

      <div className="panel" style={{ padding: 20, marginBottom: 24, borderColor: "rgba(229,165,10,0.4)" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--warning)", fontWeight: 700, marginBottom: 8 }}>
          Two-party consent required
        </p>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
          Many jurisdictions require all parties to consent to recordings. Uploading constitutes your attestation that consent was obtained from every participant. closer.gym stores no audio after transcription; transcripts are processed in your browser, scoped to your local rating bucket.
        </p>
      </div>

      <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="tile" style={{ padding: 16 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: 8 }}>
            What you get back
          </p>
          <ul style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>
            <li>· ELO of your performance (vs your current Game rating)</li>
            <li>· Opening you ran (detected, named, ECO-coded)</li>
            <li>· Top 3 blunders with engine alternatives</li>
            <li>· Recommended training (specific puzzles + lessons)</li>
          </ul>
        </div>
        <div className="tile" style={{ padding: 16 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: 8 }}>
            How it&apos;s scored
          </p>
          <ul style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>
            <li>· Same detector as bot games</li>
            <li>· Same eval function — heuristic v1</li>
            <li>· No persona schema, so eval is rougher than bot games</li>
            <li>· Tracked under your <strong>Analysis</strong> rating bucket</li>
          </ul>
        </div>
      </div>

      <Link href="/play" className="btn btn-primary">Play a bot game first →</Link>
    </div>
  );
}
