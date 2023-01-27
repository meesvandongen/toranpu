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
