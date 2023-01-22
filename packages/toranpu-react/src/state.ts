import { setupGame } from "toranpu";
import { derive, proxyWithHistory, useProxy } from "valtio/utils";

export const gameStateProxy = proxyWithHistory(setupGame());

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
