import { useLayoutEffect, useRef } from "react";
import { Card, getColor, getRank, getSuit, Suit } from "toranpu";

/**
 * A convenience function to get the info of a card in one go
 *
 * @param card The card to get the info of
 * @returns The info of a card
 */
export function getCardInfo(card: Card) {
  const rank = getRank(card);
  const suit = getSuit(card);
  const color = getColor(card);

  const symbols: Record<Suit, string> = {
    c: "♣",
    d: "♦",
    h: "♥",
    s: "♠",
  };
  const symbol = symbols[suit];

  const rankFull: string = rank === "T" ? "10" : rank;

  return {
    rank,
    suit,
    color,
    symbol,
    rankFull,
  };
}

/**
 * Similar to useCallback, with a few subtle differences:
 * - The returned function is a stable reference, and will always be the same between renders
 * - No dependency lists required
 * - Properties or state accessed within the callback will always be "current"
 */
export function useEvent<TCallback extends (...args: any[]) => any>(
  callback: TCallback,
): TCallback {
  // Keep track of the latest callback:
  const latestRef = useRef<TCallback>(null as any);
  useLayoutEffect(() => {
    latestRef.current = callback;
  }, [callback]);

  // Create a stable callback that always calls the latest callback:
  // using useRef instead of useCallback avoids creating and empty array on every render
  const stableRef = useRef<TCallback>(null as any);
  if (!stableRef.current) {
    stableRef.current = function (this: any) {
      return latestRef.current.apply(this, arguments as any);
    } as TCallback;
  }

  return stableRef.current;
}
