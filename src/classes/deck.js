const generateUUID = require("generate-uuid.js");

/**
 * Creates a standard deck of playing cards (without jokers)
 * @returns {Array} All the cards in a standard deck of playing cards (without jokers)
 */
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
  /**
   * Gets called when the Deck class is instantiated
   */
  constructor() {
    this.cards = createDeck();

    this.id = generateUUID();
  }

  /**
   * Shuffles the deck
   * @returns {Deck} A shuffled deck of playing cards
   */
  shuffle() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }

    return this;
  }

  /**
   * Draws a card
   * @returns {string} The card that's drawn
   */
  draw() {
    return this.cards.shift();
  }

  /**
   * Resets the deck to its initial state
   * @returns {Deck} A standard deck of playing cards (without jokers)
   */
  reset() {
    this.cards = createDeck();

    return this;
  }
};
