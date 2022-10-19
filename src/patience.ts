import {
  Card,
  create,
  Deck,
  draw,
  getRank,
  getSuit,
  place,
  shuffle,
} from "./deck";

export class TypeError extends Error {
  constructor(expected: string, varName: string, got: string) {
    super(`Expected type ${expected} as ${varName}, but got: ${got}`);
    this.name = "TypeError";
  }
}

export class ValidationError extends Error {
  constructor(expected: string[], varName: string, got: string) {
    super(
      `${got} is not a valid ${varName}, valid ${varName}s: [${expected.join(
        ", "
      )}]`
    );
    this.name = "ValidationError";
  }
}

export class PatienceRuleError extends Error {
  constructor(
    locationCard: string,
    destinationCard: string,
    destination: string
  ) {
    super(
      `A ${locationCard} can't be placed under a(n) ${destinationCard} in the ${destination}`
    );
    this.name = "PatienceRuleError";
  }
}

export class TopTalonError extends Error {
  constructor() {
    super(
      "When you're moving a card from the talon it can only be the top card of the talon"
    );
    this.name = "PatienceRuleError";
  }
}

export class BottomToFoundationsError extends Error {
  constructor() {
    super(
      "When you're moving a card to a foundation it can only be the lowest card of the column"
    );
    this.name = "PatienceRuleError";
  }
}

interface Column {
  open: Deck;
  closed: Deck;
}

interface TableauSource {
  type: "tableau";
  column: number;
  index: number;
}

interface TableauDestination {
  type: "tableau";
  column: number;
}

interface FoundationLocation {
  type: "foundation";
  column: number;
}

interface StockLocation {
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

interface GameState {
  foundations: [Deck, Deck, Deck, Deck];
  stock: Deck;
  discard: Deck;
  tableau: [Column, Column, Column, Column, Column, Column, Column];
}

export function empty(): GameState {
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

export function findCard(state: GameState, location: Source): Card {
  switch (location.type) {
    case "tableau":
      if (location.state === "open") {
        return state.tableau[location.column].open[location.index];
      }
      return state.tableau[location.column].closed[location.index];
    case "foundation":
      return state.foundations[location.index][location.index];
    case "stock":
      return state.stock[0];
    case "discard":
      return state.discard[0];
  }
}

function findTableauCards(
  state: GameState,
  column: number,
  index: number
): Deck {
  return state.tableau[column].open.slice(index);
}

export function moveFromTableau(
  state: GameState,
  source: TableauSource,
  destination: Destination
): GameState {
  const cards = findTableauCards(state, source.column, source.index);

  if (destination.type === "tableau") {
    return moveToTableau(state, cards, destination.column);
  }

  if (cards.length !== 1) {
    throw new PatienceRuleError("card", "stack", "tableau");
  }
  const card = cards[0];

  if (destination.type === "foundation") {
    return moveToFoundation(state, card, destination.column);
  }

  throw new TypeError("Destination", "destination", destination.type);
}

function moveToTableau(
  state: GameState,
  cards: Deck,
  column: number
): GameState {}

function moveToFoundation(
  state: GameState,
  card: Card,
  foundationColumn: number
): GameState {}

function moveToStock(state: GameState, card: Card): GameState {}

export function move(
  state: GameState,
  source: Location,
  destination: Location
) {
  const card = findCard(state, source);
  const rank = getRank(card);
  const suit = getSuit(card);

  let destinationCardParent =
    this[destinationArray[0]][parseInt(destinationArray[1])].open;

  if (destinationCardParent) {
    if (destinationCardParent.length < 1) {
      if (!card.startsWith("K"))
        throw new PatienceRuleError(
          card,
          "empty space",
          destination.slice(0, destination.length - 3)
        );
    } else {
      const destinationCard =
        destinationCardParent[destinationCardParent.length - 1];
      if (
        !(
          ((card.endsWith("C") || card.endsWith("S")) &&
            (destinationCard.endsWith("H") || destinationCard.endsWith("D"))) ||
          ((card.endsWith("H") || card.endsWith("D")) &&
            (destinationCard.endsWith("C") || destinationCard.endsWith("S")))
        ) ||
        destinationCard.slice(0, destinationCard.length - 1) !=
          cardRanks[cardRanks.indexOf(card.slice(0, card.length - 1)) + 1]
      )
        throw new PatienceRuleError(
          card,
          destinationCard,
          destination.slice(0, destination.length - 3)
        );
    }
  } else {
    destinationCardParent =
      this[destinationArray[0]][parseInt(destinationArray[1])];

    if (destinationCardParent.length < 1) {
      if (card.slice(0, card.length - 1) != "1")
        throw new PatienceRuleError(
          card,
          "empty space",
          destination.slice(0, destination.length - 3)
        );
    } else {
      const destinationCard =
        destinationCardParent[destinationCardParent.length - 1];

      if (
        !card.endsWith(destinationCard.slice(destinationCard.length - 1)) ||
        destinationCard.slice(0, destinationCard.length - 1) !=
          cardRanks[cardRanks.indexOf(card.slice(0, card.length - 1)) - 1]
      )
        throw new PatienceRuleError(
          card,
          destinationCard,
          destination.slice(0, destination.length - 3)
        );
    }
  }

  const cardLocationParent =
    this[cardLocationArray[0]][parseInt(cardLocationArray[1])];

  if (cardLocationArray[1]) {
    if (cardLocationParent.open) {
      if (
        destination.startsWith("foundations") &&
        cardLocationParent.open[0] != card
      )
        throw new BottomToFoundationsError();
      cardLocationParent.open
        .splice(
          cardLocationParent.open.indexOf(card),
          cardLocationParent.open.length - cardLocationParent.open.indexOf(card)
        )
        .forEach((element) => destinationCardParent.push(element));

      if (!cardLocationParent.open[0] && cardLocationParent.closed[0]) {
        cardLocationParent.open.push(
          this[cardLocationArray[0]][
            parseInt(cardLocationArray[1])
          ].closed.shift()
        );
      }
    } else {
      cardLocationParent
        .splice(cardLocationParent.indexOf(card))
        .forEach((element) => destinationCardParent.push(element));
    }
  } else {
    if (talon[0] != card) throw new TopTalonError();
    destinationCardParent.push(this.talon.splice(this.talon.indexOf(card)));
  }

  return this;
}
