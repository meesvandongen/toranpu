const generateUUID = require("generate-uuid.js");

function createDeck() {
  const NAMES = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];
  const SUITS = ["C", "S", "D", "H"];
  const cards = [];

  SUITS.forEach((suit) => {
    NAMES.forEach((name) => {
      cards.push(name + suit);
    });
  });

  return cards;
}

module.exports = class Deck {
  constructor() {
    this.cards = createDeck();

    this.id = generateUUID();
  }
};
