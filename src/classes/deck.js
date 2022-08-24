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
  const cards = SUITS.flatMap((suit) => NAMES.map((name) => `${name}${suit}`));

  return cards;
}

module.exports = class Deck {
  constructor() {
    this.cards = createDeck();

    this.id = generateUUID();
  }

  shuffle() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }

    return this;
  }

  draw() {
    return this.cards.shift();
  }

  reset() {
    this.cards = createDeck();

    return this;
  }
};
