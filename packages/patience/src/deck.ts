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

export function rankToValue(rank: Rank): number {
  switch (rank) {
    case Rank.ace:
      return 1;
    case Rank.king:
      return 13;
    case Rank.queen:
      return 12;
    case Rank.jack:
      return 11;
    default:
      return parseInt(rank, 10);
  }
}

export function getCardValue(card: Card): number {
  const rank = getRank(card);
  return rankToValue(rank);
}

export const suits = [Suit.clubs, Suit.spades, Suit.diamonds, Suit.hearts];

export type Card = `${Rank}${Suit}`;
export type Deck = Card[];

export function create(): Deck {
  return suits.flatMap((suit) => ranks.map((rank): Card => `${rank}${suit}`));
}

export function shuffle(deck: Deck): void {
  deck.sort(() => Math.random() - 0.5);
}

export function draw(deck: Deck): Card {
  const [card] = deck.splice(0, 1);

  return card;
}

export function drawMultiple(deck: Deck, count: number): Deck {
  const drawFromIndex = deck.length - count;
  const cards = deck.splice(drawFromIndex, count);

  return cards;
}

if (import.meta.vitest) {
  it("draws multiple cards", () => {
    const deck: Deck = ["As", "2s", "3s"];
    const cards = drawMultiple(deck, 2);

    expect(cards).toEqual(["2s", "3s"]);
    expect(deck).toEqual(["As"]);
  });
}

export function place(deck: Deck, card: Card): void {
  deck.push(card);
}

export function placeMultiple(deck: Deck, cards: Deck): void {
  deck.push(...cards);
}

export function getRank(card: Card): Rank {
  return card[0] as Rank;
}

if (import.meta.vitest) {
  it("gets the rank of a card", () => {
    expect(getRank("As")).toEqual(Rank.ace);
    expect(getRank("2s")).toEqual(Rank.two);
  });
}

export function getSuit(card: Card): Suit {
  return card[1] as Suit;
}

if (import.meta.vitest) {
  it("gets the suit of a card", () => {
    expect(getSuit("As")).toBe(Suit.spades);
    expect(getSuit("2d")).toBe(Suit.diamonds);
  });
}

export function getColor(card: Card): Color {
  const suit = getSuit(card);

  return suit === Suit.clubs || suit === Suit.spades ? Color.black : Color.red;
}

if (import.meta.vitest) {
  it("gets the color of a card", () => {
    expect(getColor("As")).toBe(Color.black);
    expect(getColor("2d")).toBe(Color.red);
  });
}

export function compareRank(a: Card, b: Card): number {
  const rankA = getRank(a);
  const rankB = getRank(b);

  return rankToValue(rankA) - rankToValue(rankB);
}
