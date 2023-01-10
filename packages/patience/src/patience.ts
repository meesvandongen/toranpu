import {
  Card,
  create,
  Deck,
  draw,
  drawMultiple,
  place,
  placeMultiple,
  shuffle,
} from "./deck";

import type { GameState, TableauSource, Destination } from "./patience-types";

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

if (import.meta.vitest) {
  it("generates an empty game state", () => {
    const state = empty();

    expect(state.foundations).toEqual([[], [], [], []]);
    expect(state.stock).toEqual([]);
    expect(state.discard).toEqual([]);
    expect(state.tableau).toEqual([
      { open: [], closed: [] },
      { open: [], closed: [] },
      { open: [], closed: [] },
      { open: [], closed: [] },
      { open: [], closed: [] },
      { open: [], closed: [] },
      { open: [], closed: [] },
    ]);
  });
}

export function setupGame(): GameState {
  const game = empty();
  const deck = create();
  shuffle(deck);

  for (let columnIndex = 0; columnIndex < 7; columnIndex++) {
    const tableauColumn = game.tableau[columnIndex];
    const card = draw(deck);
    place(tableauColumn.open, card);

    for (let j = 0; j < columnIndex; j++) {
      const card = draw(deck);
      place(tableauColumn.closed, card);
    }
  }

  game.stock = deck;
  return game;
}

if (import.meta.vitest) {
  it("sets up a game", () => {
    const state = setupGame();

    expect(state.stock.length).toEqual(24);
    expect(state.discard.length).toEqual(0);
    expect(state.tableau.length).toEqual(7);

    expect(state.foundations[0].length).toEqual(0);
    expect(state.foundations[1].length).toEqual(0);
    expect(state.foundations[2].length).toEqual(0);
    expect(state.foundations[3].length).toEqual(0);

    expect(state.tableau[0].open.length).toEqual(1);
    expect(state.tableau[1].open.length).toEqual(1);
    expect(state.tableau[2].open.length).toEqual(1);
    expect(state.tableau[3].open.length).toEqual(1);
    expect(state.tableau[4].open.length).toEqual(1);
    expect(state.tableau[5].open.length).toEqual(1);
    expect(state.tableau[6].open.length).toEqual(1);

    expect(state.tableau[0].closed.length).toEqual(0);
    expect(state.tableau[1].closed.length).toEqual(1);
    expect(state.tableau[2].closed.length).toEqual(2);
    expect(state.tableau[3].closed.length).toEqual(3);
    expect(state.tableau[4].closed.length).toEqual(4);
    expect(state.tableau[5].closed.length).toEqual(5);
    expect(state.tableau[6].closed.length).toEqual(6);
  });
}

export function drawFromStock(state: GameState): void {
  if (state.stock.length === 0) {
    throw new Error("There are no cards left in the stock");
  }

  const card = draw(state.stock);
  place(state.discard, card);
}

if (import.meta.vitest) {
  it("draws from the stock", () => {
    const state = setupGame();
    drawFromStock(state);

    const currentTopCard = state.discard[state.discard.length - 1];

    expect(state.stock.length).toEqual(23);
    expect(state.discard.length).toEqual(1);

    expect(state.discard[0]).toEqual(currentTopCard);
  });
}

function drawTableauCards(
  state: GameState,
  columnIndex: number,
  cardIndex: number
): Deck {
  let deckOpen = state.tableau[columnIndex].open;
  let deckClosed = state.tableau[columnIndex].closed;

  const amountToDraw = deckOpen.length - cardIndex;
  const cards = drawMultiple(deckOpen, amountToDraw);

  if (deckOpen.length === 0 && deckClosed.length > 0) {
    let drawnCard = draw(deckClosed);
    place(deckOpen, drawnCard);
  }

  return cards;
}

if (import.meta.vitest) {
  it("draws cards from the tableau", () => {
    const state = setupGame();
    const cards = drawTableauCards(state, 0, 0);

    expect(cards.length).toEqual(1);
    expect(state.tableau[0].open.length).toEqual(0);
    expect(state.tableau[0].closed.length).toEqual(0);
  });

  it("flips a card from the closed deck to the open deck", () => {
    const state = setupGame();
    const cards = drawTableauCards(state, 1, 0);

    expect(cards.length).toEqual(1);
    expect(state.tableau[1].open.length).toEqual(1);
    expect(state.tableau[1].closed.length).toEqual(0);
  });
}

export function moveFromTableau(
  state: GameState,
  source: TableauSource,
  destination: Destination
): void {
  const drawnCards = drawTableauCards(state, source.column, source.index);

  if (destination.type === "tableau") {
    placeOnTableau(state, drawnCards, destination.column);
    return;
  }

  if (destination.type === "foundation") {
    if (drawnCards.length !== 1) {
      throw Error("Can only move one card to a foundation");
    }
    const card = drawnCards[0];
    placeOnFoundation(state, card, destination.column);
    return;
  }

  throw Error("invalid move");
}

if (import.meta.vitest) {
  it("moves a card from the tableau to tableau", () => {
    const state = setupGame();
    moveFromTableau(
      state,
      { type: "tableau", column: 0, index: 0 },
      { type: "tableau", column: 1 }
    );

    expect(state.tableau[0].open.length).toBe(0);
    expect(state.tableau[0].closed.length).toBe(0);
    expect(state.tableau[1].open.length).toBe(2);
    expect(state.tableau[1].closed.length).toBe(1);
  });

  it("moves multiple cards from the tableau to tableau", () => {
    const state: GameState = empty();
    state.tableau[0].open = ["2s", "As", "2c", "3c"];
    state.tableau[1].open = ["4c"];
    console.dir(state, { depth: null });
    moveFromTableau(
      state,
      { type: "tableau", column: 0, index: 2 },
      { type: "tableau", column: 1 }
    );
    console.dir(state, { depth: null });

    expect(state.tableau[0].open.length).toBe(2);
    expect(state.tableau[1].open).toEqual(["4c", "2c", "3c"]);
  });
}

function placeOnTableau(state: GameState, cards: Deck, colIndex: number): void {
  placeMultiple(state.tableau[colIndex].open, cards);
}

function placeOnFoundation(
  state: GameState,
  card: Card,
  colIndex: number
): void {
  const foundation = state.foundations[colIndex];

  place(foundation, card);
}

export function restoreStock(state: GameState): void {
  const cards = drawMultiple(state.discard, state.discard.length);
  cards.reverse();
  placeMultiple(state.stock, cards);
}

if (import.meta.vitest) {
  it("restores the stock", () => {
    const state = setupGame();
    drawFromStock(state);
    expect(state.stock.length).toBe(23);
    expect(state.discard.length).toBe(1);

    restoreStock(state);

    expect(state.stock.length).toBe(24);
    expect(state.discard.length).toBe(0);
  });
}

export function moveFromStock(s: GameState, destination: Destination): void {
  const card = draw(s.stock);

  if (destination.type === "tableau") {
    placeOnTableau(s, [card], destination.column);
    return;
  }

  if (destination.type === "foundation") {
    placeOnFoundation(s, card, destination.column);
    return;
  }

  throw Error("Invalid move");
}

export function isWinningState(state: GameState): boolean {
  return state.foundations.every((foundation) => foundation.length === 13);
}
