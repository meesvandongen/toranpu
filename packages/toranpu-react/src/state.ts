import { setupGame, Source } from "toranpu";
import { proxy } from "valtio";
import { useProxy } from "valtio/utils";

const today = new Date();
const seed = today.toLocaleDateString("nl-NL");

document.title = `Toranpu ${seed}`;

export const gameStateProxy = proxy(setupGame(seed));

export function useGameState() {
  return useProxy(gameStateProxy);
}

const initialHand: { source: Source | null } = {
  source: null,
};

export const handProxy = proxy(initialHand);

export function useHand() {
  return useProxy(handProxy);
}
