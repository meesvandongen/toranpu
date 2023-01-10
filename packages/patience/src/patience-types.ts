import type { Deck } from "./deck";

export interface Column {
  open: Deck;
  closed: Deck;
}

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

export type Foundations = [Deck, Deck, Deck, Deck];

export type Tableau = [Column, Column, Column, Column, Column, Column, Column];

export interface GameState {
  foundations: Foundations;
  stock: Deck;
  discard: Deck;
  tableau: Tableau;
}
