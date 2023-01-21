import {
  Card,
  compareCardsByRank,
  createDeck,
  Deck,
  drawCard,
  drawCards,
  getCards,
  getCardValue,
  getColor,
  getRank,
  getSuit,
  placeCard,
  placeCards,
  Rank,
  shuffleDeck,
} from "../deck";

import type { GameState, TableauSource, Destination } from "./klondike.types";

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

/**
 * Setup a game of Klondike.
 */
export function setupGame(seed?: string): GameState {
  const game = empty();
  const deck = createDeck();
  shuffleDeck(deck, seed);

  for (let columnIndex = 0; columnIndex < 7; columnIndex++) {
    const tableauColumn = game.tableau[columnIndex];
    const card = drawCard(deck);
    placeCard(tableauColumn.open, card);

    for (let j = 0; j < columnIndex; j++) {
      const card = drawCard(deck);
      placeCard(tableauColumn.closed, card);
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

  it("sets up a game with a seed", () => {
    const state1 = setupGame("seed");
    const state2 = setupGame("seed");

    expect(state1).toEqual(state2);

    const state3 = setupGame("seed2");
    expect(state1).not.toEqual(state3);
  });
}

/**
 * Draws a single card from the stock and places it in the discard pile. If the
 * stock is empty, the discard pile is restored to the stock.
 */
export function drawFromStock(state: GameState): void {
  if (state.stock.length === 0) {
    restoreStock(state);
    return;
  }

  const card = drawCard(state.stock);
  placeCard(state.discard, card);
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

  it("restores the stock", () => {
    const state = setupGame();
    state.discard = state.stock;
    state.stock = [];

    drawFromStock(state);

    expect(state.stock.length).toEqual(24);
    expect(state.discard.length).toEqual(0);
  });
}

/**
 * @returns A list of cards from the tableau.
 */
export function getTableauCards(
  state: GameState,
  columnIndex: number,
  cardIndex: number,
): Deck {
  let deckOpen = state.tableau[columnIndex].open;

  const amountToDraw = deckOpen.length - cardIndex;
  const cards = getCards(deckOpen, amountToDraw);

  return cards;
}

if (import.meta.vitest) {
  it("gets cards from the tableau", () => {
    const state = setupGame();
    const cards = getTableauCards(state, 0, 0);

    expect(cards.length).toEqual(1);
    expect(state.tableau[0].open.length).toEqual(1);
  });
}

function drawTableauCards(
  state: GameState,
  columnIndex: number,
  cardIndex: number,
): Deck {
  let deckOpen = state.tableau[columnIndex].open;
  let deckClosed = state.tableau[columnIndex].closed;

  const amountToDraw = deckOpen.length - cardIndex;
  const cards = drawCards(deckOpen, amountToDraw);

  if (deckOpen.length === 0 && deckClosed.length > 0) {
    let drawnCard = drawCard(deckClosed);
    placeCard(deckOpen, drawnCard);
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

/**
 * Moves a card from the tableau to the foundation or another tableau column
 */
export function moveFromTableau(
  state: GameState,
  source: TableauSource,
  destination: Destination,
): void {
  if (!getCanMoveFromTableau(state, source, destination)) {
    return;
  }

  const drawnCards = drawTableauCards(state, source.column, source.index);

  if (destination.type === "tableau") {
    placeOnTableau(state, drawnCards, destination.column);
    return;
  }

  placeOnFoundation(state, drawnCards[0], destination.column);
}

if (import.meta.vitest) {
  it("moves a card from the tableau to tableau", () => {
    const state: GameState = empty();
    state.tableau[0].open = ["7h"];
    state.tableau[1].open = ["8c"];

    moveFromTableau(
      state,
      { type: "tableau", column: 0, index: 0 },
      { type: "tableau", column: 1 },
    );

    expect(state.tableau[0].open.length).toBe(0);
    expect(state.tableau[1].open.length).toBe(2);
  });

  it("moves multiple cards from the tableau to tableau", () => {
    const state: GameState = empty();
    state.tableau[0].open = ["Ts", "9h", "8s", "7h"];
    state.tableau[1].open = ["9d"];
    moveFromTableau(
      state,
      { type: "tableau", column: 0, index: 2 },
      { type: "tableau", column: 1 },
    );

    expect(state.tableau[0].open.length).toBe(2);
    expect(state.tableau[1].open).toEqual(["9d", "8s", "7h"]);
  });
}

/**
 * Checks if a card can be moved from the tableau to the foundation or another tableau column
 */
export function getCanMoveFromTableau(
  state: GameState,
  source: TableauSource,
  destination: Destination,
) {
  const cards = getTableauCards(state, source.column, source.index);

  if (destination.type === "tableau") {
    return getCanPlaceOnTableau(state, cards, destination.column);
  }

  if (destination.type === "foundation") {
    if (cards.length !== 1) {
      return false;
    }
    return getCanPlaceOnFoundation(state, cards[0], destination.column);
  }

  return false;
}

function placeOnTableau(state: GameState, cards: Deck, colIndex: number): void {
  placeCards(state.tableau[colIndex].open, cards);
}

if (import.meta.vitest) {
  it("places multiple cards on the tableau", () => {
    const state = empty();
    placeOnTableau(state, ["2s", "As"], 0);

    expect(state.tableau[0].open).toEqual(["2s", "As"]);
  });
}

function getCanPlaceOnTableau(
  state: GameState,
  cards: Deck,
  colIndex: number,
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
  it("checks if a card can be placed on the tableau", () => {
    const state = empty();
    state.tableau[0].open = ["Ks", "Qd"];

    expect(getCanPlaceOnTableau(state, ["Js"], 0)).toBe(true);
    expect(getCanPlaceOnTableau(state, ["Jc"], 0)).toBe(true);
    expect(getCanPlaceOnTableau(state, ["Jd"], 0)).toBe(false);
    expect(getCanPlaceOnTableau(state, ["Jh"], 0)).toBe(false);
  });
}

function placeOnFoundation(
  state: GameState,
  card: Card,
  colIndex: number,
): void {
  const foundation = state.foundations[colIndex];
  placeCard(foundation, card);
}

if (import.meta.vitest) {
  it("places a card on the foundation", () => {
    const state = empty();
    placeOnFoundation(state, "2s", 0);

    expect(state.foundations[0]).toEqual(["2s"]);
  });
}

function getCanPlaceOnFoundation(
  state: GameState,
  card: Card,
  colIndex: number,
) {
  const foundation = state.foundations[colIndex];
  const foundationTopCard = foundation[foundation.length - 1];

  if (foundationTopCard === undefined) {
    if (getRank(card) === Rank.ace) {
      return true;
    }
    return false;
  }

  const foundationTopCardSuit = getSuit(foundationTopCard);

  const cardSuit = getSuit(card);

  const difference = compareCardsByRank(card, foundationTopCard);

  if (difference !== 1) {
    return false;
  }

  if (foundationTopCardSuit !== cardSuit) {
    return false;
  }

  return true;
}

if (import.meta.vitest) {
  it("checks if a card can be placed on the foundation", () => {
    const state = empty();
    state.foundations[0] = ["As"];

    expect(getCanPlaceOnFoundation(state, "As", 0)).toBe(false);
    expect(getCanPlaceOnFoundation(state, "2s", 0)).toBe(true);
    expect(getCanPlaceOnFoundation(state, "3s", 0)).toBe(false);
    expect(getCanPlaceOnFoundation(state, "2d", 0)).toBe(false);
    expect(getCanPlaceOnFoundation(state, "2c", 0)).toBe(false);
  });

  it("checks if a card can be placed on an empty foundation", () => {
    const state = empty();

    expect(getCanPlaceOnFoundation(state, "As", 0)).toBe(true);
    expect(getCanPlaceOnFoundation(state, "Ah", 0)).toBe(true);
    expect(getCanPlaceOnFoundation(state, "2s", 0)).toBe(false);
  });
}

function restoreStock(state: GameState): void {
  const cards = drawCards(state.discard, state.discard.length);
  cards.reverse();
  placeCards(state.stock, cards);
}

if (import.meta.vitest) {
  it("restores the stock", () => {
    const state = empty();
    state.discard = ["2c", "As", "2s"];

    restoreStock(state);
    expect(state.stock).toEqual(["2s", "As", "2c"]);
    expect(state.discard).toEqual([]);
  });
}

/**
 * Move a card from the stock to the tableau or foundation.
 */
export function moveFromStock(
  state: GameState,
  destination: Destination,
): void {
  if (!getCanMoveFromStock(state, destination)) {
    return;
  }

  const card = drawCard(state.stock);

  if (destination.type === "tableau") {
    placeOnTableau(state, [card], destination.column);
    return;
  }

  placeOnFoundation(state, card, destination.column);
}

if (import.meta.vitest) {
  it("moves a card from the stock to the tableau", () => {
    const state = empty();
    state.stock = ["Js"];
    state.tableau[0].open = ["Ks", "Qd"];
    moveFromStock(state, { type: "tableau", column: 0 });

    expect(state.stock.length).toBe(0);
    expect(state.tableau[0].open.length).toBe(3);
  });

  it("moves a card from the stock to the foundation", () => {
    const state = empty();
    state.stock = ["2s"];
    state.foundations[0] = ["As"];
    moveFromStock(state, { type: "foundation", column: 0 });

    expect(state.stock.length).toBe(0);
    expect(state.foundations[0].length).toBe(2);
  });

  it("does not move a card from the stock to the tableau if the move is not valid", () => {
    const state = empty();
    state.stock = ["Js"];
    state.tableau[0].open = ["Kd", "Qs"];
    moveFromStock(state, { type: "tableau", column: 0 });

    expect(state.stock.length).toBe(1);
    expect(state.tableau[0].open.length).toBe(2);
  });

  it("does not move a card from the stock to the foundation if the move is not valid", () => {
    const state = empty();
    state.stock = ["2s"];
    state.foundations[0] = [];
    moveFromStock(state, { type: "foundation", column: 0 });

    expect(state.stock.length).toBe(1);
    expect(state.foundations[0].length).toBe(0);
  });
}

/**
 * Checks if a card can be moved from the stock to the tableau or foundation.
 */
export function getCanMoveFromStock(
  s: GameState,
  destination: Destination,
): boolean {
  if (destination.type === "tableau") {
    return getCanPlaceOnTableau(s, s.stock, destination.column);
  }

  return getCanPlaceOnFoundation(s, s.stock[0], destination.column);
}

/**
 * Checks if the game is won.
 *
 * @returns true if the game is won, false otherwise.
 */
export function getIsWinningState(state: GameState): boolean {
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

    expect(getIsWinningState(state)).toBe(true);
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

    expect(getIsWinningState(state)).toBe(false);
  });
}
