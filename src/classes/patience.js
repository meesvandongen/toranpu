const generateUUID = require("generate-uuid.js");

module.exports = class Patience {
  /**
   * Gets called when the Patience class is instantiated
   * @param {Deck} deck The deck where you'd like to play Patience with
   */
  constructor(deck) {
    this.deck = deck;

    this.tableau = [
      { open: [deck.draw()], closed: [] },
      { open: [deck.draw()], closed: [deck.draw()] },
      { open: [deck.draw()], closed: [deck.draw(), deck.draw()] },
      {
        open: [deck.draw()],
        closed: [deck.draw(), deck.draw(), deck.draw()],
      },
      {
        open: [deck.draw()],
        closed: [deck.draw(), deck.draw(), deck.draw(), deck.draw()],
      },
      {
        open: [deck.draw()],
        closed: [
          deck.draw(),
          deck.draw(),
          deck.draw(),
          deck.draw(),
          deck.draw(),
        ],
      },
      {
        open: [deck.draw()],
        closed: [
          deck.draw(),
          deck.draw(),
          deck.draw(),
          deck.draw(),
          deck.draw(),
          deck.draw(),
        ],
      },
    ];

    this.stock = deck.cards;
    this.talon = [];
    this.foundations = [[], [], [], []];

    this.id = generateUUID();
  }
};
