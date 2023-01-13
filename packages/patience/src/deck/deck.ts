import { Rank, Card, Suit, Deck, Color } from "./deck.types";
import { Random } from "../utils/random";

export const ranks = [
  Rank.ace,
  Rank.two,
  Rank.three,
  Rank.four,
  Rank.five,
  Rank.six,
  Rank.seven,
  Rank.eight,
  Rank.nine,
  Rank.ten,
  Rank.jack,
  Rank.queen,
  Rank.king,
];

export const suits = [Suit.clubs, Suit.spades, Suit.diamonds, Suit.hearts];

export function getValueByRank(rank: Rank): number {
  switch (rank) {
    case Rank.ace:
      return 1;
    case Rank.king:
      return 13;
    case Rank.queen:
      return 12;
    case Rank.jack:
      return 11;
    case Rank.ten:
      return 10;
    default:
      return parseInt(rank, 10);
  }
}

export function getCardValue(card: Card): number {
  const rank = getRank(card);
  return getValueByRank(rank);
}

export function createDeck(): Deck {
  return suits.flatMap((suit) => ranks.map((rank): Card => `${rank}${suit}`));
}

export function shuffleDeck(
  deck: Deck,
  seed?: string | number | undefined,
): void {
  const rng = new Random(seed);
  deck.sort(() => rng.nextInt(0, 2) - 1);
}

export function getCard(deck: Deck): Card {
  return deck[deck.length - 1];
}

export function getCards(deck: Deck, count: number): Deck {
  return deck.slice(deck.length - count);
}

export function drawCard(deck: Deck): Card {
  const card = deck.pop()!;

  return card;
}

export function drawCards(deck: Deck, count: number): Deck {
  const drawFromIndex = deck.length - count;
  const cards = deck.splice(drawFromIndex, count);

  return cards;
}

export function placeCard(deck: Deck, card: Card): void {
  deck.push(card);
}

export function placeCards(deck: Deck, cards: Deck): void {
  deck.push(...cards);
}

/**
 * @returns The rank of a card
 */
export function getRank(card: Card): Rank {
  return card[0] as Rank;
}

/**
 * @returns The suit of a card
 */
export function getSuit(card: Card): Suit {
  return card[1] as Suit;
}

/**
 * @returns The color of a card
 */
export function getColor(card: Card): Color {
  const suit = getSuit(card);

  return suit === Suit.clubs || suit === Suit.spades ? Color.black : Color.red;
}

export function compareCardsByRank(a: Card, b: Card): number {
  const rankA = getRank(a);
  const rankB = getRank(b);

  return getValueByRank(rankA) - getValueByRank(rankB);
}
