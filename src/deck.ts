export enum Rank {
  ace = "A",
  two = "2",
  three = "3",
  four = "4",
  five = "5",
  six = "6",
  seven = "7",
  eight = "8",
  nine = "9",
  ten = "T",
  jack = "J",
  queen = "Q",
  king = "K",
}

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

export enum Suit {
  clubs = "c",
  spades = "s",
  diamonds = "d",
  hearts = "h",
}

export const suits = [Suit.clubs, Suit.spades, Suit.diamonds, Suit.hearts];

export type Card = `${Rank}${Suit}`;
export type Deck = Card[];

export function create(): Deck {
  return suits.flatMap((suit) => ranks.map((rank): Card => `${rank}${suit}`));
}

export function shuffle(deck: Deck): Deck {
  return deck.slice().sort(() => Math.random() - 0.5);
}

export function draw(deck: Deck): [Deck, Card] {
  const card = deck[0];
  const newDeck = deck.slice(1);

  return [newDeck, card];
}
