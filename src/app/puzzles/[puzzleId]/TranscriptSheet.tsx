"use client";

import { useEffect } from "react";
import type { Transcript } from "@/lib/transcripts";

interface Props {
  transcript: Transcript;
  onClose: () => void;
}

export default function TranscriptSheet({ transcript, onClose }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="scroll-slim"
        style={{
          maxWidth: 760,
          width: "100%",
          maxHeight: "85vh",
          overflowY: "auto",
          background: "var(--bg-panel)",
          border: "1px solid var(--border-strong)",
          borderRadius: 10,
          padding: 28,
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 18 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--brand-green-600)", fontWeight: 700, marginBottom: 8 }}>
            Read full transcript
          </p>
          <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.01em", marginBottom: 4 }}>
            {transcript.speaker}: {transcript.title}
          </h2>
          <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
            {transcript.source}
          </p>
        </div>

        {/* Scenario */}
        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.55, marginBottom: 20, paddingBottom: 14, borderBottom: "1px solid var(--border)" }}>
          {transcript.scenario}
        </p>

        {/* Turns */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {transcript.turns.map((t, i) => {
            const isOperator = t.role === "operator";
            const isNarrator = t.role === "narrator";
            if (isNarrator) {
              return (
                <p key={i} style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic", textAlign: "center", padding: "4px 0" }}>
                  {t.text}
                </p>
              );
            }
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: isOperator ? "flex-end" : "flex-start",
                }}
              >
                <p style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: 4 }}>
                  {isOperator ? "Operator" : "Counterparty"}
                </p>
                <div
                  style={{
                    maxWidth: "85%",
                    padding: "10px 14px",
                    borderRadius: 6,
                    background: isOperator ? "rgba(129,182,76,0.14)" : "var(--bg-rail)",
                    border: `1px solid ${isOperator ? "rgba(129,182,76,0.32)" : "var(--border-strong)"}`,
                    fontSize: 14,
                    color: isOperator ? "var(--text-primary)" : "var(--text-secondary)",
                    lineHeight: 1.5,
                  }}
                >
                  {t.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Technique note */}
        <div style={{ background: "var(--bg-rail)", borderLeft: "3px solid var(--brand-green-600)", padding: 14, borderRadius: 4, marginBottom: 18 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--brand-green-600)", fontWeight: 700, marginBottom: 6 }}>
            Move sequence
          </p>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.55 }}>
            {transcript.techniqueNote}
          </p>
        </div>

        {/* Disclosure for paraphrased material */}
        {transcript.paraphrased && (
          <p style={{ fontSize: 11, color: "var(--warning)", marginBottom: 14, padding: "8px 12px", border: "1px solid rgba(229,165,10,0.3)", borderRadius: 4 }}>
            Paraphrased reconstruction. Not a verbatim recovered transcript. Sourced from the speaker&apos;s published teaching material plus widely-cited reconstructions.
          </p>
        )}

        {/* Source link */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
          <a
            href={transcript.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 12, color: "var(--brand-green-600)", textDecoration: "underline" }}
          >
            View source →
          </a>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ fontSize: 13, padding: "6px 14px" }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
