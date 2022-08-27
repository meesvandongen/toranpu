const createDeckCards = require("../functions/createDeckCards");
const generateUUID = require("generate-uuid.js");

module.exports = class Deck {
  /**
   * Gets called when the Deck class is instantiated
   */
  constructor() {
    this.cards = createDeckCards();

    this.id = generateUUID();
  }

  /**
   * Shuffles the deck
   * @returns {Deck} A shuffled deck of playing cards
   */
  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
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
    this.cards = createDeckCards();

    return this;
  }
};
