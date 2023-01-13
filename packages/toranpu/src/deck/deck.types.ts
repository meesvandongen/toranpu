export const enum Rank {
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

export const enum Suit {
  clubs = "c",
  spades = "s",
  diamonds = "d",
  hearts = "h",
}

export const enum Color {
  black = "black",
  red = "red",
}

export type Card = `${Rank}${Suit}`;
export type Deck = Card[];
