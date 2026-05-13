"use client";

import { useEffect, useState } from "react";
import { getPuzzleState } from "@/lib/puzzle-storage";
import { titleForRating } from "@/lib/tokens";

export default function PuzzlesClientHeader() {
  const [stats, setStats] = useState<{ rating: number; streak: number; longest: number; solved: number } | null>(null);

  useEffect(() => {
    const state = getPuzzleState();
    setStats({
      rating: state.rating.rating,
      streak: state.currentStreak,
      longest: state.longestStreak,
      solved: state.solves.filter((s) => s.correct).length,
    });
  }, []);

  if (!stats) {
    // Render a stable placeholder during SSR / pre-hydration so layout doesn't shift.
    return (
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <StatCard label="Your puzzle rating" value="—" />
        <StatCard label="Current streak" value="—" />
        <StatCard label="Longest streak" value="—" />
        <StatCard label="Solved" value="—" />
      </div>
    );
  }

  const title = titleForRating(stats.rating);

  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
      <StatCard
        label="Your puzzle rating"
        value={stats.rating.toFixed(0)}
        badge={<span className={`title-badge ${title.tier}`} style={{ marginLeft: 6 }}>{title.label.replace(" Closer", "")}</span>}
      />
      <StatCard label="Current streak" value={`${stats.streak}d`} accent={stats.streak > 0 ? "brand" : undefined} />
      <StatCard label="Longest streak" value={`${stats.longest}d`} />
      <StatCard label="Solved" value={stats.solved.toString()} />
    </div>
  );
}

function StatCard({ label, value, badge, accent }: { label: string; value: string; badge?: React.ReactNode; accent?: "brand" }) {
  return (
    <div style={{ background: "var(--bg-panel)", border: "1px solid var(--border)", borderRadius: 4, padding: "10px 14px", minWidth: 140 }}>
      <div style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: 4 }}>
        {label}
      </div>
      <div className="tabular" style={{ fontSize: 22, fontWeight: 800, color: accent === "brand" ? "var(--brand-green-600)" : "var(--text-primary)", letterSpacing: "-0.01em" }}>
        {value}
        {badge}
      </div>
    </div>
  );
}
