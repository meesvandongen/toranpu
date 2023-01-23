import { setupGame, Source } from "toranpu";
import { proxy } from "valtio";
import { derive, proxyWithHistory, useProxy } from "valtio/utils";

const today = new Date();
const seed = today.toLocaleDateString("nl-NL");

document.title = `Toranpu ${seed}`;

export const gameStateProxy = proxyWithHistory(setupGame(seed));

export const discardProxy = derive({
  value: (get) => get(gameStateProxy).value.discard,
});
export const foundationsProxy = derive({
  value: (get) => get(gameStateProxy).value.foundations,
});
export const stockProxy = derive({
  value: (get) => get(gameStateProxy).value.stock,
});
export const tableauProxy = derive({
  value: (get) => get(gameStateProxy).value.tableau,
});

export function useGameState() {
  return useProxy(gameStateProxy.value);
}

const initialHand: { source: Source | null } = {
  source: null,
};

export const handProxy = proxy(initialHand);

export function useHand() {
  return useProxy(handProxy);
}
