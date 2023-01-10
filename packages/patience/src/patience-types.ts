import type { Deck } from "./deck";

export interface TableauSource {
  type: "tableau";
  column: number;
  index: number;
}

export interface TableauDestination {
  type: "tableau";
  column: number;
}

export interface FoundationLocation {
  type: "foundation";
  column: number;
}

export interface StockLocation {
  type: "stock";
}

export interface DiscardSource {
  type: "discard";
}

export type Source = TableauSource | DiscardSource;

export type Destination =
  | TableauDestination
  | FoundationLocation
  | StockLocation;

/**
 * The foundations are the four piles at the top of the game. They are
 * built up in suit, starting with the ace.
 */
export type Foundations = [Deck, Deck, Deck, Deck];

/**
 * The tableau is the main area of the game. It consists of 7 columns.
 * Each column has a number of cards, some of which are face up and some
 * of which are face down. The top card of each column is always face up.
 * The cards in the tableau are arranged in descending order, alternating
 * colors. When a column is empty, a king can be placed in it.
 */
export type Tableau = [Column, Column, Column, Column, Column, Column, Column];

/**
 * A column is a deck of cards that are arranged in a column. The top
 * card is always face up. The other cards are face down.
 */
export interface Column {
  open: Deck;
  closed: Deck;
}

export interface GameState {
  foundations: Foundations;
  stock: Deck;
  discard: Deck;
  tableau: Tableau;
}
