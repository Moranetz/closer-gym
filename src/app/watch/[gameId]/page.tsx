import { notFound } from "next/navigation";
import { getMasterGame, MASTER_GAMES } from "@/lib/master-games";
import MasterGameViewer from "./MasterGameViewer";

interface Params {
  params: Promise<{ gameId: string }>;
}

export async function generateStaticParams() {
  return MASTER_GAMES.map((g) => ({ gameId: g.id }));
}

export default async function MasterGamePage({ params }: Params) {
  const { gameId } = await params;
  const game = getMasterGame(gameId);
  if (!game) notFound();
  return <MasterGameViewer game={game} />;
}
