import {
  compareCardsByRank,
  createDeck,
  drawCard,
  drawCards,
  getCard,
  getCards,
  getCardValue,
  getColor,
  getRank,
  getSuit,
  getValueByRank,
  placeCard,
  placeCards,
  ranks,
  shuffleDeck,
  suits,
} from "./deck";
import { Color, Deck, Rank, Suit } from "./deck.types";

it("declares ranks", () => {
  expect(ranks).toBeDefined();
  expect(ranks.length).toBe(13);
});

it("declares suits", () => {
  expect(suits).toBeDefined();
  expect(suits.length).toBe(4);
});

it("converts a rank to a value", () => {
  expect(getValueByRank(Rank.ace)).toBe(1);
  expect(getValueByRank(Rank.two)).toBe(2);
  expect(getValueByRank(Rank.three)).toBe(3);
  expect(getValueByRank(Rank.four)).toBe(4);
  expect(getValueByRank(Rank.five)).toBe(5);
  expect(getValueByRank(Rank.six)).toBe(6);
  expect(getValueByRank(Rank.seven)).toBe(7);
  expect(getValueByRank(Rank.eight)).toBe(8);
  expect(getValueByRank(Rank.nine)).toBe(9);
  expect(getValueByRank(Rank.ten)).toBe(10);
  expect(getValueByRank(Rank.jack)).toBe(11);
  expect(getValueByRank(Rank.queen)).toBe(12);
  expect(getValueByRank(Rank.king)).toBe(13);
});

it("gets the value of a card", () => {
  expect(getCardValue("As")).toBe(1);
});

it("creates a deck", () => {
  expect(createDeck().length).toBe(52);
});

it("shuffles a deck", () => {
  const deck: Deck = ["As", "2s", "3s", "4s"];
  shuffleDeck(deck, "2023-01-13");

  const deck2: Deck = ["As", "2s", "3s", "4s"];
  shuffleDeck(deck2, "2023-01-13");

  const deck3: Deck = ["As", "2s", "3s", "4s"];

  expect(deck).toEqual(deck2);
  expect(deck).not.toEqual(deck3);
});

it("gets a card", () => {
  const deck: Deck = ["As", "2s", "3s"];
  const card = getCard(deck);

  expect(deck).toEqual(["As", "2s", "3s"]);
  expect(card).toBe("3s");
});

it("gets multiple cards", () => {
  const deck: Deck = ["As", "2s", "3s"];
  const cards = getCards(deck, 2);

  expect(deck).toEqual(["As", "2s", "3s"]);
  expect(cards).toEqual(["2s", "3s"]);
});

it("draws a card", () => {
  const deck: Deck = ["As", "2s", "3s"];
  const card = drawCard(deck);

  expect(deck).toEqual(["As", "2s"]);
  expect(card).toBe("3s");
});

it("draws multiple cards", () => {
  const deck: Deck = ["As", "2s", "3s"];
  const cards = drawCards(deck, 2);

  expect(deck).toEqual(["As"]);
  expect(cards).toEqual(["2s", "3s"]);
});

it("places a card", () => {
  const deck: Deck = ["As", "2s"];
  placeCard(deck, "3s");

  expect(deck).toEqual(["As", "2s", "3s"]);
});

it("places multiple cards", () => {
  const deck: Deck = ["As", "2s"];
  placeCards(deck, ["3s", "4s"]);

  expect(deck).toEqual(["As", "2s", "3s", "4s"]);
});

it("gets the rank of a card", () => {
  expect(getRank("As")).toEqual(Rank.ace);
  expect(getRank("2s")).toEqual(Rank.two);
});

it("gets the suit of a card", () => {
  expect(getSuit("As")).toBe(Suit.spades);
  expect(getSuit("2d")).toBe(Suit.diamonds);
});

it("gets the color of a card", () => {
  expect(getColor("As")).toBe(Color.black);
  expect(getColor("2d")).toBe(Color.red);
});

it("compares the rank of 2 cards", () => {
  expect(compareCardsByRank("As", "2s")).toBe(-1);
  expect(compareCardsByRank("2s", "2s")).toBe(0);
  expect(compareCardsByRank("2s", "As")).toBe(1);

  const cards: Deck = [
    "Ks",
    "3s",
    "4s",
    "Qs",
    "5s",
    "6s",
    "8s",
    "2s",
    "9s",
    "7s",
    "Ts",
    "Js",
    "As",
  ];
  expect(cards.sort(compareCardsByRank)).toEqual([
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
  ]);
});
