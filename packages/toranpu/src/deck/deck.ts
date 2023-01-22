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

/**
 * Get card which will be drawn next
 *
 * @category Deck
 *
 * @param deck A deck of cards
 * @returns A card from the top of the deck or null if deck is empty
 */
export function getCard(deck: Deck): Card | null {
  if (deck.length === 0) {
    return null;
  }
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
 * Get the rank of a card
 *
 * @category Card
 *
 * @param card The card to get the rank of
 * @returns The rank of a card
 */
export function getRank(card: Card): Rank {
  return card[0] as Rank;
}

/**
 * Get the suit of a card
 *
 * @category Card
 *
 * @param card The card to get the suit of
 * @returns The suit of a card
 */
export function getSuit(card: Card): Suit {
  return card[1] as Suit;
}

/**
 * Get the color of a card
 *
 * @category Card
 *
 * @param card The card to get the color of
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
