import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  GameState,
  getIsWinningState,
  setupGame,
  solveNeutral,
  Source,
} from "toranpu";
import { proxy, subscribe } from "valtio";
import { useProxy } from "valtio/utils";
import { proxyWithHistory } from "./proxy-with-history-storage";
import { useEvent } from "./use-event";

export type Hand = { source: Source | null };
const HandContext = createContext<Hand | null>(null);

interface HandProviderProps {
  children?: ReactNode;
}
export function HandProvider({ children }: HandProviderProps) {
  const [handProxy] = useState<Hand>(() =>
    proxy({
      source: null,
    }),
  );

  return (
    <HandContext.Provider value={handProxy}>{children}</HandContext.Provider>
  );
}

export function useHandContext() {
  const hand = useContext(HandContext);
  if (!hand) {
    throw new Error("useHand must be used within a HandProvider");
  }
  return hand;
}

export function useHandState() {
  const handProxy = useHandContext();
  return useProxy(handProxy);
}

type GameStateContextType = ReturnType<typeof proxyWithHistory<GameState>>;
const GameStateContext = createContext<GameStateContextType | null>(null);

interface GameStateProviderProps {
  seed?: string;
  children?: ReactNode;
  onWin?: () => void;
}
export function GameStateProvider({
  seed = new Date().toLocaleDateString("nl-NL"),
  children,
  onWin = () => {},
}: GameStateProviderProps) {
  const _onWin = useEvent(onWin);

  const [gameStateProxy] = useState<GameStateContextType>(() => {
    const storedState = localStorage.getItem("toranpu-state");
    if (storedState) {
      const parsedState = JSON.parse(storedState);
      if (parsedState.seed === seed) {
        return proxyWithHistory(parsedState.gameState, parsedState.history);
      }
    }
    return proxyWithHistory(setupGame(seed));
  });

  useEffect(() => {
    if (getIsWinningState(gameStateProxy.value)) {
      _onWin();
    }
    const sub = subscribe(gameStateProxy, () => {
      if (getIsWinningState(gameStateProxy.value)) {
        _onWin();
      }
      localStorage.setItem(
        "toranpu-state",
        JSON.stringify({
          seed,
          gameState: gameStateProxy.value,
          history: gameStateProxy.history,
        }),
      );
    });

    return sub;
  }, [_onWin, gameStateProxy, seed]);

  useEffect(() => {
    const sub = subscribe(gameStateProxy, () => {
      // We are at the end of the history, so we can try auto solving.
      if (!gameStateProxy.canRedo()) {
        solveNeutral(gameStateProxy.value);
      }
    });

    return sub;
  }, [gameStateProxy]);

  return (
    <GameStateContext.Provider value={gameStateProxy}>
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameStateContext() {
  const gameStateProxy = useContext(GameStateContext);
  if (!gameStateProxy) {
    throw new Error(
      "useGameStateProxy must be used within a GameStateProvider",
    );
  }
  return gameStateProxy;
}

export function useGameState() {
  const gameStateProxy = useGameStateContext();
  return useProxy(gameStateProxy);
}

interface ToranpuProviderProps {
  seed?: string;
  children: ReactNode;
  onWin?: () => void;
}
/**
 * The ToranpuProvider is the Provider for the state. This component should be
 * used if you make use of the hooks.
 *
 * @category Components
 *
 * @param ToranpuProviderProps The props for the ToranpuProvider
 * @returns A JSX Element
 */
export function ToranpuProvider({
  children,
  seed,
  onWin,
}: ToranpuProviderProps) {
  return (
    <GameStateProvider seed={seed} onWin={onWin}>
      <HandProvider>{children}</HandProvider>
    </GameStateProvider>
  );
}
