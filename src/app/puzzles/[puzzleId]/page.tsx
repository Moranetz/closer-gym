import { notFound } from "next/navigation";
import { getPuzzle, dailyPuzzleId } from "@/lib/puzzle-library";
import PuzzleSolver from "./PuzzleSolver";

interface Params {
  params: Promise<{ puzzleId: string }>;
  searchParams: Promise<{ daily?: string }>;
}

export default async function PuzzlePage({ params, searchParams }: Params) {
  const { puzzleId } = await params;
  const { daily } = await searchParams;

  // Special path: /puzzles/today resolves to the deterministic daily.
  const resolvedId = puzzleId === "today" ? dailyPuzzleId() : puzzleId;
  const puzzle = getPuzzle(resolvedId);
  if (!puzzle) notFound();

  return (
    <PuzzleSolver
      puzzle={puzzle}
      isDaily={Boolean(daily) || puzzleId === "today"}
    />
  );
}
