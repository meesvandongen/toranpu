import {
  Card,
  create,
  Deck,
  draw,
  drawMultiple,
  getRank,
  getCardValue,
  getSuit,
  place,
  placeMultiple,
  Rank,
  shuffle,
} from "./deck";

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

interface DiscardSource {
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

function empty(): GameState {
  return {
    foundations: [[], [], [], []],
    stock: [],
    discard: [],
    tableau: [
      { open: [], closed: [] },
      { open: [], closed: [] },
      { open: [], closed: [] },
      { open: [], closed: [] },
      { open: [], closed: [] },
      { open: [], closed: [] },
      { open: [], closed: [] },
    ],
  };
}

export function setupGame(): GameState {
  const layout = empty();
  let deck = shuffle(create());

  for (let columnIndex = 0; columnIndex < 7; columnIndex++) {
    let [newDeck, card] = draw(deck);
    layout.tableau[columnIndex].open.push(card);
    deck = newDeck;

    for (let j = 0; j < columnIndex; j++) {
      let [newDeck, card] = draw(deck);
      // TODO remove push
      layout.tableau[columnIndex].closed.push(card);
      deck = newDeck;
    }
  }

  layout.stock = deck;

  return layout;
}

export function drawFromStock(state: GameState): GameState {
  if (state.stock.length === 0) {
    throw new Error("There are no cards left in the stock");
  }

  const [newStock, card] = draw(state.stock);
  const newDiscard = place(state.discard, card);

  return {
    ...state,
    stock: newStock,
    discard: newDiscard,
  };
}

function drawTableauCards(
  state: GameState,
  columnIndex: number,
  deckIndex: number
): [GameState, Deck] {
  let deckOpen = state.tableau[columnIndex].open;
  let deckClosed = state.tableau[columnIndex].closed;

  const amountToDraw = deckOpen.length - deckIndex;
  const [deck, drawnCards] = drawMultiple(deckOpen, amountToDraw);
  deckOpen = deck;

  if (deckOpen.length === 0) {
    let [newColumnDeckClosed, drawnCard] = draw(deckClosed);
    deckOpen = place(deckOpen, drawnCard);
    deckClosed = newColumnDeckClosed;
  }

  return [
    {
      ...state,
      tableau: state.tableau.map((column, _columnIndex) => {
        if (columnIndex === _columnIndex) {
          return {
            open: deckOpen,
            closed: deckClosed,
          };
        }
        return column;
      }) as Tableau,
    },
    drawnCards,
  ];
}

export function moveFromTableau(
  state: GameState,
  source: TableauSource,
  destination: Destination
): GameState {
  const [newState, drawnCards] = drawTableauCards(
    state,
    source.column,
    source.index
  );

  if (destination.type === "tableau") {
    return placeOnTableau(newState, drawnCards, destination.column);
  }

  if (drawnCards.length !== 1) {
    throw Error("Can only move one card to a foundation");
  }
  const card = drawnCards[0];

  if (destination.type === "foundation") {
    return placeToFoundation(state, card, destination.column);
  }

  throw Error("invalid move");
}

function placeOnTableau(
  state: GameState,
  cards: Deck,
  targetIndex: number
): GameState {
  const deck = placeMultiple(state.tableau[targetIndex].open, cards);
  return {
    ...state,
    tableau: state.tableau.map((column, columnIndex) => {
      if (columnIndex === targetIndex) {
        return {
          ...column,
          open: deck,
        };
      }
      return column;
    }) as Tableau,
  };
}

function placeToFoundation(
  state: GameState,
  card: Card,
  foundationColumn: number
): GameState {
  const foundation = state.foundations[foundationColumn];
  const parentCard = foundation[foundation.length - 1];

  const cardSuit = getSuit(card);
  const cardRank = getRank(card);
  const cardValue = getCardValue(card);

  if (!parentCard) {
    if (cardRank === Rank.ace) {
      return {
        ...state,
        foundations: state.foundations.map((foundation, index) => {
          if (index === foundationColumn) {
            return place(foundation, card);
          }
          return foundation;
        }) as Foundations,
      };
    }
    throw Error("Cannot place card on empty foundation");
  }

  const parentCardSuit = getSuit(parentCard);
  const parentCardValue = getCardValue(parentCard);

  if (cardSuit === parentCardSuit && cardValue === parentCardValue + 1) {
    return {
      ...state,
      foundations: state.foundations.map((foundation, index) => {
        if (index === foundationColumn) {
          return place(foundation, card);
        }
        return foundation;
      }) as Foundations,
    };
  }

  throw Error("Invalid move");
}

export function restoreStock(state: GameState): GameState {
  if (state.stock.length > 0) {
    throw Error("There are still cards in the stock");
  }

  const newStock = state.discard.slice(0, state.discard.length - 1);
  const newDiscard = [];

  return {
    ...state,
    stock: newStock,
    discard: newDiscard,
  };
}

export function moveFromStock(
  state: GameState,
  destination: Destination
): GameState {
  const [newStock, card] = draw(state.stock);

  const newState = {
    ...state,
    stock: newStock,
  };

  if (destination.type === "tableau") {
    return placeOnTableau(newState, [card], destination.column);
  }

  if (destination.type === "foundation") {
    return placeToFoundation(newState, card, destination.column);
  }

  throw Error("Invalid move");
}

export function isWinningState(state: GameState): boolean {
  return state.foundations.every((foundation) => foundation.length === 13);
}
