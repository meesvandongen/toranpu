import {
  Card,
  create,
  Deck,
  draw,
  drawMultiple,
  getCardValue,
  getColor,
  getRank,
  place,
  placeMultiple,
  Rank,
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
    moveFromTableau(
      state,
      { type: "tableau", column: 0, index: 2 },
      { type: "tableau", column: 1 }
    );

    expect(state.tableau[0].open.length).toBe(2);
    expect(state.tableau[1].open).toEqual(["4c", "2c", "3c"]);
  });
}

function placeOnTableau(state: GameState, cards: Deck, colIndex: number): void {
  placeMultiple(state.tableau[colIndex].open, cards);
}

if (import.meta.vitest) {
  it("places multiple cards on the tableau", () => {
    const state = empty();
    placeOnTableau(state, ["2s", "As"], 0);

    expect(state.tableau[0].open).toEqual(["2s", "As"]);
  });
}

/**
 * Checks if the card may be placed on the tableau.
 */
export function getMayPlaceOnTableau(
  state: GameState,
  cards: Deck,
  colIndex: number
): boolean {
  const tableau = state.tableau[colIndex];

  const tableauTopCard = tableau.open[tableau.open.length - 1];
  const tableauTopCardColor = getColor(tableauTopCard);
  const tableauTopCardValue = getCardValue(tableauTopCard);

  const topCard = cards[0];
  const topCardRank = getRank(topCard);
  const topCardColor = getColor(topCard);
  const topCardValue = getCardValue(topCard);

  if (tableauTopCard === undefined) {
    if (topCardRank !== Rank.king) {
      return false;
    }
    return true;
  }

  if (topCardValue !== tableauTopCardValue - 1) {
    return false;
  }

  if (topCardColor === tableauTopCardColor) {
    return false;
  }

  return true;
}

if (import.meta.vitest) {
  it("checks if a card may be placed on the tableau", () => {
    const state = empty();
    state.tableau[0].open = ["Ks", "Qd"];

    expect(getMayPlaceOnTableau(state, ["Js"], 0)).toBe(true);
    expect(getMayPlaceOnTableau(state, ["Jc"], 0)).toBe(true);
    expect(getMayPlaceOnTableau(state, ["Jd"], 0)).toBe(false);
    expect(getMayPlaceOnTableau(state, ["Jh"], 0)).toBe(false);
  });
}

function placeOnFoundation(
  state: GameState,
  card: Card,
  colIndex: number
): void {
  const foundation = state.foundations[colIndex];
  place(foundation, card);
}

if (import.meta.vitest) {
  it("places a card on the foundation", () => {
    const state = empty();
    placeOnFoundation(state, "2s", 0);

    expect(state.foundations[0]).toEqual(["2s"]);
  });
}

export function restoreStock(state: GameState): void {
  const cards = drawMultiple(state.discard, state.discard.length);
  placeMultiple(state.stock, cards);
}

if (import.meta.vitest) {
  it("restores the stock", () => {
    const state = empty();
    state.stock = ["2s", "As", "2c"];

    drawFromStock(state);
    expect(state.stock).toEqual(["As", "2c"]);
    expect(state.discard).toEqual(["2s"]);

    drawFromStock(state);
    expect(state.stock).toEqual(["2c"]);
    expect(state.discard).toEqual(["2s", "As"]);

    drawFromStock(state);
    expect(state.stock).toEqual([]);
    expect(state.discard).toEqual(["2s", "As", "2c"]);

    restoreStock(state);
    expect(state.stock).toEqual(["2s", "As", "2c"]);
    expect(state.discard).toEqual([]);
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

if (import.meta.vitest) {
  it("moves a card from the stock to the tableau", () => {
    const state = setupGame();
    moveFromStock(state, { type: "tableau", column: 0 });

    expect(state.stock.length).toBe(23);
    expect(state.tableau[0].open.length).toBe(2);
  });

  it("moves a card from the stock to the foundation", () => {
    const state = setupGame();
    moveFromStock(state, { type: "foundation", column: 0 });

    expect(state.stock.length).toBe(23);
    expect(state.foundations[0].length).toBe(1);
  });
}

export function isWinningState(state: GameState): boolean {
  return state.foundations.every((foundation) => foundation.length === 13);
}

if (import.meta.vitest) {
  it("checks if the game is won", () => {
    const state = empty();
    state.foundations = [
      [
        "As",
        "2s",
        "3s",
        "4s",
        "5s",
        "6s",
        "7s",
        "8s",
        "9s",
        "Ts",
        "Js",
        "Qs",
        "Ks",
      ],
      [
        "Ah",
        "2h",
        "3h",
        "4h",
        "5h",
        "6h",
        "7h",
        "8h",
        "9h",
        "Th",
        "Jh",
        "Qh",
        "Kh",
      ],
      [
        "Ad",
        "2d",
        "3d",
        "4d",
        "5d",
        "6d",
        "7d",
        "8d",
        "9d",
        "Td",
        "Jd",
        "Qd",
        "Kd",
      ],
      [
        "Ac",
        "2c",
        "3c",
        "4c",
        "5c",
        "6c",
        "7c",
        "8c",
        "9c",
        "Tc",
        "Jc",
        "Qc",
        "Kc",
      ],
    ];

    expect(isWinningState(state)).toBe(true);
  });

  it("checks if the game is not won", () => {
    const state = empty();
    state.foundations = [
      [
        "As",
        "2s",
        "3s",
        "4s",
        "5s",
        "6s",
        "7s",
        "8s",
        "9s",
        "Ts",
        "Js",
        "Qs",
        "Ks",
      ],
      [
        "Ah",
        "2h",
        "3h",
        "4h",
        "5h",
        "6h",
        "7h",
        "8h",
        "9h",
        "Th",
        "Jh",
        "Qh",
        "Kh",
      ],
      [
        "Ad",
        "2d",
        "3d",
        "4d",
        "5d",
        "6d",
        "7d",
        "8d",
        "9d",
        "Td",
        "Jd",
        "Qd",
        "Kd",
      ],
      ["Ac", "2c", "3c", "4c", "5c", "6c", "7c", "8c", "9c", "Tc", "Jc", "Qc"],
    ];

    expect(isWinningState(state)).toBe(false);
  });
}
