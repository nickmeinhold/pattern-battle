/**
 * Serves the game as a static HTML file.
 * All game logic lives in public/game.html — this just redirects to it.
 */
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/game.html");
}
