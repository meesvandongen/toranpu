import {
  Card,
  compareCardsByRank,
  createDeck,
  Deck,
  drawCard,
  drawCards,
  getCard,
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

import type {
  GameState,
  TableauSource,
  Destination,
  Source,
} from "./klondike.types";

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
 * Setup a game of Klondike
 *
 * @category Klondike
 *
 * @param seed The seed to use for shuffling the deck
 * @returns The game state
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
 *
 * @category Klondike
 *
 * @param state The game state
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
 * Gets a list of cards from the tableau. Does not remove the cards from the
 * tableau.
 *
 * @category Klondike
 *
 * @param state The game state
 * @param columnIndex The index of the column to get cards from
 * @param deckIndex The starting index of the deck to get cards from
 *
 * @returns A list of cards from the tableau.
 */
export function getTableauCards(
  state: GameState,
  columnIndex: number,
  deckIndex: number,
): Deck {
  let deckOpen = state.tableau[columnIndex].open;

  const amount = deckOpen.length - deckIndex;
  const cards = getCards(deckOpen, amount);

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
 * Moves a card from the tableau to the foundation or another tableau column.
 *
 * @category Klondike
 *
 * @param state The game state
 * @param source The source of the card
 * @param destination The destination of the card
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

  it("does not move a card from the tableau to tableau if the move is invalid", () => {
    const state: GameState = empty();
    state.tableau[0].open = ["Th"];
    state.tableau[1].open = ["8c"];

    moveFromTableau(
      state,
      { type: "tableau", column: 0, index: 0 },
      { type: "tableau", column: 1 },
    );

    expect(state.tableau[0].open.length).toBe(1);
    expect(state.tableau[1].open.length).toBe(1);
  });

  it("moves a card from the tableau to a foundation", () => {
    const state: GameState = empty();
    state.tableau[0].open = ["2c"];
    state.foundations[0] = ["Ac"];

    moveFromTableau(
      state,
      { type: "tableau", column: 0, index: 0 },
      { type: "foundation", column: 0 },
    );

    expect(state.tableau[0].open.length).toBe(0);
    expect(state.foundations[0]).toEqual(["Ac", "2c"]);
  });
}

/**
 * Checks if cards can be moved from the tableau to the foundation or another
 * tableau column.
 *
 * @category Klondike
 *
 * @param state The game state
 * @param source The source of the cards
 * @param destination The destination of the cards
 *
 * @returns `true` if the cards can be moved, `false` otherwise.
 */
export function getCanMoveFromTableau(
  state: GameState,
  source: TableauSource,
  destination: Destination,
): boolean {
  const cards = getTableauCards(state, source.column, source.index);

  if (destination.type === "tableau") {
    return getCanPlaceOnTableau(state, cards, destination.column);
  }

  if (cards.length !== 1) {
    return false;
  }
  return getCanPlaceOnFoundation(state, cards[0], destination.column);
}

if (import.meta.vitest) {
  it("returns false if we try to move multiple cards to the foundation", () => {
    const state: GameState = empty();
    state.tableau[0].open = ["2c", "3c"];
    state.foundations[0] = ["Ac"];

    expect(
      getCanMoveFromTableau(
        state,
        { type: "tableau", column: 0, index: 0 },
        { type: "foundation", column: 0 },
      ),
    ).toBe(false);
  });
}

/**
 * Get cards from a source
 *
 * @category Klondike
 *
 * @param state The game state
 * @param source The source of the cards
 *
 * @returns The cards from the source
 */
export function getSourceCards(state: GameState, source: Source): Deck {
  if (source.type === "tableau") {
    return getTableauCards(state, source.column, source.index);
  }
  return getCards(state.discard, 1);
}

if (import.meta.vitest) {
  it("gets cards from the tableau", () => {
    const state: GameState = empty();
    state.tableau[0].open = ["2c", "3c"];

    expect(
      getSourceCards(state, { type: "tableau", column: 0, index: 1 }),
    ).toEqual(["3c"]);
  });

  it("gets cards from the discard", () => {
    const state: GameState = empty();
    state.discard = ["2c", "3c"];

    expect(getSourceCards(state, { type: "discard" })).toEqual(["3c"]);
  });
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

/**
 * Checks if cards can be placed on the tableau
 *
 * @category Klondike
 *
 * @param state The game state
 * @param cards The cards to place
 * @param colIndex The index of the tableau column
 * @returns `true` if the cards can be placed, `false` otherwise
 */
export function getCanPlaceOnTableau(
  state: GameState,
  cards: Deck,
  colIndex: number,
): boolean {
  const tableau = state.tableau[colIndex];

  const tableauTopCard = tableau.open[tableau.open.length - 1] as
    | Card
    | undefined;

  const bottomCard = cards[0];
  const bottomCardRank = getRank(bottomCard);
  const bottomCardColor = getColor(bottomCard);
  const bottomCardValue = getCardValue(bottomCard);

  if (tableauTopCard === undefined) {
    if (bottomCardRank !== Rank.king) {
      return false;
    }
    return true;
  }

  const tableauTopCardColor = getColor(tableauTopCard);
  const tableauTopCardValue = getCardValue(tableauTopCard);

  if (bottomCardValue !== tableauTopCardValue - 1) {
    return false;
  }

  if (bottomCardColor === tableauTopCardColor) {
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

  it("can only place a king on an empty tableau", () => {
    const state = empty();

    expect(getCanPlaceOnTableau(state, ["Qs"], 0)).toBe(false);
    expect(getCanPlaceOnTableau(state, ["Ks"], 0)).toBe(true);
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
 *
 * @category Klondike
 *
 * @param state The game state.
 * @param destination The destination to move the card to.
 */
export function moveFromDiscard(
  state: GameState,
  destination: Destination,
): void {
  if (!getCanMoveFromDiscard(state, destination)) {
    return;
  }

  const card = drawCard(state.discard);

  if (destination.type === "tableau") {
    placeOnTableau(state, [card], destination.column);
    return;
  }

  placeOnFoundation(state, card, destination.column);
}

if (import.meta.vitest) {
  it("moves a card from the discard to the tableau", () => {
    const state = empty();
    state.discard = ["Js"];
    state.tableau[0].open = ["Ks", "Qd"];
    moveFromDiscard(state, { type: "tableau", column: 0 });

    expect(state.discard.length).toBe(0);
    expect(state.tableau[0].open.length).toBe(3);
  });

  it("moves a card from the discard to the foundation", () => {
    const state = empty();
    state.discard = ["2s"];
    state.foundations[0] = ["As"];
    moveFromDiscard(state, { type: "foundation", column: 0 });

    expect(state.discard.length).toBe(0);
    expect(state.foundations[0].length).toBe(2);
  });

  it("does not move a card from the discard to the tableau if the move is not valid", () => {
    const state = empty();
    state.discard = ["Js"];
    state.tableau[0].open = ["Kd", "Qs"];
    moveFromDiscard(state, { type: "tableau", column: 0 });

    expect(state.discard.length).toBe(1);
    expect(state.tableau[0].open.length).toBe(2);
  });

  it("does not move a card from the discard to the foundation if the move is not valid", () => {
    const state = empty();
    state.discard = ["2s"];
    state.foundations[0] = [];
    moveFromDiscard(state, { type: "foundation", column: 0 });

    expect(state.discard.length).toBe(1);
    expect(state.foundations[0].length).toBe(0);
  });
}

/**
 * Checks if a card can be moved from the discard to the tableau or foundation.
 *
 * @category Klondike
 *
 * @param state The game state.
 * @param destination The destination to move the card to.
 *
 * @returns `true` if the move is valid, `false` otherwise.
 */
export function getCanMoveFromDiscard(
  state: GameState,
  destination: Destination,
): boolean {
  const card = getCard(state.discard);

  if (card === null) {
    return false;
  }

  if (destination.type === "tableau") {
    return getCanPlaceOnTableau(state, [card], destination.column);
  }

  return getCanPlaceOnFoundation(state, card, destination.column);
}

if (import.meta.vitest) {
  it("checks if a card can be moved from the discard to the tableau", () => {
    const state = empty();
    state.discard = ["Js"];
    state.tableau[0].open = ["Ks", "Qd"];

    expect(getCanMoveFromDiscard(state, { type: "tableau", column: 0 })).toBe(
      true,
    );
  });

  it("checks if a card can be moved from the discard to the foundation", () => {
    const state = empty();
    state.discard = ["2s"];
    state.foundations[0] = ["As"];

    expect(
      getCanMoveFromDiscard(state, { type: "foundation", column: 0 }),
    ).toBe(true);
  });

  it("checks if a card can be moved from the discard to the tableau if the move is not valid", () => {
    const state = empty();
    state.discard = ["Js"];
    state.tableau[0].open = ["Kd", "Qs"];

    expect(getCanMoveFromDiscard(state, { type: "tableau", column: 0 })).toBe(
      false,
    );
  });

  it("checks if a card can be moved from the discard to the foundation if the move is not valid", () => {
    const state = empty();
    state.discard = ["2s"];
    state.foundations[0] = [];

    expect(
      getCanMoveFromDiscard(state, { type: "foundation", column: 0 }),
    ).toBe(false);
  });

  it("checks if a card can be moved from the discard to the tableau if the discard is empty", () => {
    const state = empty();
    state.tableau[0].open = ["Ks", "Qd"];

    expect(getCanMoveFromDiscard(state, { type: "tableau", column: 0 })).toBe(
      false,
    );
  });
}

/**
 * Checks if a card can be moved from a source to a destination.
 *
 * @category Klondike
 *
 * @param state The game state.
 * @param source The source to move the card from.
 * @param destination The destination to move the card to.
 *
 * @returns `true` if the move is valid, `false` otherwise.
 */
export function getCanMoveFromSource(
  state: GameState,
  source: Source,
  destination: Destination,
): boolean {
  if (source.type === "discard") {
    return getCanMoveFromDiscard(state, destination);
  }
  return getCanMoveFromTableau(state, source, destination);
}

/**
 * Moves a card from a source to a destination.
 *
 * @category Klondike
 *
 * @param state The game state.
 * @param source The source to move the card from.
 * @param destination The destination to move the card to.
 */
export function moveFromSource(
  state: GameState,
  source: Source,
  destination: Destination,
) {
  if (!getCanMoveFromSource(state, source, destination)) {
    return;
  }

  if (source.type === "discard") {
    return moveFromDiscard(state, destination);
  }

  return moveFromTableau(state, source, destination);
}

/**
 * Checks if the game is won.
 *
 * @category Klondike
 *
 * @param state The game state.
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

export function solveNeutral(state: GameState): void {
  while (solveNeutralStep(state)) {
    // Empty.
  }
}

if (import.meta.vitest) {
  // TODO: Add tests.
}

/**
 * Moves a neutral card form the tableau to the foundation, if possible.
 *
 * A neutral card is a card that does not impact the ability of the player to
 * win the game. For example, an Ace is always neutral, as it is the lowest
 * card; no card can be placed on top of it in the tableau. Similarly, a nine is
 * neutral if an eight of the opposite color is already on the foundation.
 *
 * @category Klondike
 *
 * @param state The game state.
 *
 * @returns `true` if a neutral card was moved, `false` otherwise.
 */
export function solveNeutralStep(state: GameState): boolean {
  for (
    let tableauColumnIndex = 0;
    tableauColumnIndex < state.tableau.length;
    tableauColumnIndex++
  ) {
    const tableauColumn = state.tableau[tableauColumnIndex];
    const tableauCard = getCard(tableauColumn.open);

    if (tableauCard === null) {
      continue;
    }

    if (getIsNeutralCard(state, tableauCard)) {
      const tableauCardSuit = getSuit(tableauCard);
      const tableauCardRank = getRank(tableauCard);

      const foundationColumnIndex = state.foundations.findIndex(
        (foundation) => {
          const foundationCard = getCard(foundation);
          if (foundationCard === null) {
            return tableauCardRank === Rank.ace;
          }
          const foundationCardSuit = getSuit(foundationCard);
          return foundationCardSuit === tableauCardSuit;
        },
      );

      const source: Source = {
        type: "tableau",
        index: tableauColumn.open.length - 1,
        column: tableauColumnIndex,
      };

      const destination: Destination = {
        type: "foundation",
        column: foundationColumnIndex,
      };

      if (getCanMoveFromTableau(state, source, destination)) {
        moveFromTableau(state, source, destination);
        return true;
      }
    }
  }

  return false;
}

if (import.meta.vitest) {
  it("solves an ace", () => {
    const state = empty();
    state.tableau[0].open = ["As"];
    state.foundations = [[], [], [], []];

    solveNeutralStep(state);

    expect(state.tableau[0].open).toEqual([]);
    expect(state.foundations[0]).toEqual(["As"]);
  });

  it("solves a three when all foundations are twos", () => {
    const state = empty();
    state.tableau[0].open = ["3s"];
    state.foundations = [
      ["As", "2s"],
      ["Ad", "2d"],
      ["Ac", "2c"],
      ["Ah", "2h"],
    ];

    solveNeutralStep(state);

    expect(state.tableau[0].open).toEqual([]);
    expect(state.foundations[0]).toEqual(["As", "2s", "3s"]);
  });

  it("does not solve a three when all foundations are aces", () => {
    const state = empty();
    state.tableau[0].open = ["3s"];
    state.foundations = [["As"], ["Ad"], ["Ac"], ["Ah"]];

    solveNeutralStep(state);

    expect(state.tableau[0].open).toEqual(["3s"]);
    expect(state.foundations[0]).toEqual(["As"]);
  });

  it("solves a three when all other foundations are fours", () => {
    const state = empty();
    state.tableau[0].open = ["3s"];
    state.foundations = [
      ["As", "2s"],
      ["Ad", "2d", "3d", "4d"],
      ["Ac", "2c", "3c", "4c"],
      ["Ah", "2h", "3h", "4h"],
    ];

    solveNeutralStep(state);

    expect(state.tableau[0].open).toEqual([]);
    expect(state.foundations[0]).toEqual(["As", "2s", "3s"]);
  });

  it("solves a three when all other foundations of the opposite color are fours", () => {
    const state = empty();
    state.tableau[0].open = ["3s"];
    state.foundations = [
      ["As", "2s"],
      ["Ad", "2d", "3d", "4d"],
      ["Ac"],
      ["Ah", "2h", "3h", "4h"],
    ];

    solveNeutralStep(state);

    expect(state.tableau[0].open).toEqual([]);
    expect(state.foundations[0]).toEqual(["As", "2s", "3s"]);
  });

  it("does not solve a three when all other foundations of the opposite color are aces", () => {
    const state = empty();
    state.tableau[0].open = ["3s"];
    state.foundations = [
      ["As", "2s"],
      ["Ad"],
      ["Ac", "2c", "3c", "4c"],
      ["Ah"],
    ];

    solveNeutralStep(state);

    expect(state.tableau[0].open).toEqual(["3s"]);
    expect(state.foundations[0]).toEqual(["As", "2s"]);
  });

  it("works with multiple cards in the tableau", () => {
    const state = empty();
    state.tableau[0].open = ["2d", "Ac"];
    state.foundations[0] = ["As"];

    solveNeutralStep(state);

    expect(state.tableau[0].open).toEqual(["2d"]);
    expect(state.foundations[0]).toEqual(["As"]);
    expect(state.foundations[1]).toEqual(["Ac"]);
  });

  it("returns false if no neutral card was moved", () => {
    const state = empty();
    state.tableau[0].open = ["3s"];
    const result = solveNeutralStep(state);

    expect(result).toBe(false);
  });

  it("returns true if a neutral card was moved", () => {
    const state = empty();
    state.tableau[0].open = ["As"];
    const result = solveNeutralStep(state);

    expect(result).toBe(true);
  });

  it("only allows valid moves, if multiple of the same suit are neutral", () => {
    const state = empty();

    state.foundations = [
      ["As", "2s", "3s"],
      ["Ac"],
      ["Ah", "2h", "3h", "4h", "5h"],
      ["Ad", "2d"],
    ];

    state.tableau[0].open = ["3c"];
    state.tableau[1].open = ["2c"];

    const result = solveNeutralStep(state);

    expect(result).toBe(true);
    expect(state.tableau[0].open).toEqual(["3c"]);
    expect(state.tableau[1].open).toEqual([]);
    expect(state.foundations[1]).toEqual(["Ac", "2c"]);
  });
}

export function getIsNeutralCard(state: GameState, card: Card): boolean {
  if (getRank(card) === Rank.ace) {
    return true;
  }

  const cardValue = getCardValue(card);
  const cardColor = getColor(card);

  const everyFoundationIsNeutral = state.foundations.every((foundation) => {
    const foundationCard = getCard(foundation);
    if (foundationCard === null) {
      return false;
    }

    const foundationCardColor = getColor(foundationCard);
    if (foundationCardColor === cardColor) {
      return true;
    }
    const foundationCardValue = getCardValue(foundationCard);
    return foundationCardValue >= cardValue - 1;
  });

  return everyFoundationIsNeutral;
}

if (import.meta.vitest) {
  it("checks if a card is neutral", () => {
    const state = empty();
    state.foundations = [["As"], ["Ah"], ["Ad"], ["Ac"]];

    expect(getIsNeutralCard(state, "2s")).toBe(true);
  });

  it("checks if a card is not neutral", () => {
    const state = empty();
    state.foundations = [
      ["As", "2s", "3s"],
      ["Ac", "2c", "3c"],
      ["Ah", "2h"],
      ["Ad", "2d"],
    ];

    expect(getIsNeutralCard(state, "4s")).toBe(false);
  });

  it("returns true for a color-inbalanced foundation", () => {
    const state = empty();
    state.foundations = [
      ["As", "2s", "3s"],
      ["Ac", "2c", "3c"],
      ["Ah", "2h"],
      ["Ad", "2d"],
    ];

    expect(getIsNeutralCard(state, "3h")).toBe(true);
    expect(getIsNeutralCard(state, "3d")).toBe(true);
  });

  it("also works if the foundations are empty", () => {
    const state = empty();

    expect(getIsNeutralCard(state, "2s")).toBe(false);
    expect(getIsNeutralCard(state, "As")).toBe(true);
  });

  it("works for 2 same-colored aces in the foundation, but a different-colored two in the tableau", () => {
    const state = empty();
    state.foundations = [["As"], ["Ac"], [], []];

    expect(getIsNeutralCard(state, "2d")).toBe(false);
  });
}
