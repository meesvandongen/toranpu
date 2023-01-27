import React, { useEffect } from "react";
import { GameState, getIsWinningState, setupGame, Source } from "toranpu";
import { proxy, subscribe } from "valtio";
import { proxyWithHistory, useProxy } from "valtio/utils";

export type Hand = { source: Source | null };
const HandContext = React.createContext<Hand | null>(null);

interface HandProviderProps {
  children?: React.ReactNode;
}
export function HandProvider({ children }: HandProviderProps) {
  const [handProxy] = React.useState<Hand>(() =>
    proxy({
      source: null,
    }),
  );

  return (
    <HandContext.Provider value={handProxy}>{children}</HandContext.Provider>
  );
}

export function useHandContext() {
  const hand = React.useContext(HandContext);
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
const GameStateContext = React.createContext<GameStateContextType | null>(null);

interface GameStateProviderProps {
  seed?: string;
  children?: React.ReactNode;
  onWin?: () => void;
}
export function GameStateProvider({
  seed = new Date().toLocaleDateString("nl-NL"),
  children,
  onWin = () => {},
}: GameStateProviderProps) {
  const [gameStateProxy] = React.useState<GameStateContextType>(() =>
    proxyWithHistory(setupGame(seed)),
  );

  useEffect(() =>
    subscribe(gameStateProxy, () => {
      if (getIsWinningState(gameStateProxy.value)) {
        onWin();
      }
    }),
  );

  return (
    <GameStateContext.Provider value={gameStateProxy}>
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameStateContext() {
  const gameStateProxy = React.useContext(GameStateContext);
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
  children: React.ReactNode;
}
export function ToranpuProvider({ children, seed }: ToranpuProviderProps) {
  return (
    <GameStateProvider seed={seed}>
      <HandProvider>{children}</HandProvider>
    </GameStateProvider>
  );
}
