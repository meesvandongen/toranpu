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

  /**
   * Draws a card from the stock pile and puts it in the talon
   * @returns {Patience} The game of patience where this method is called on
   */
  draw() {
    const card = this.stock.shift();

    if (!card) {
      this.stock = this.talon;
      this.talon = [];

      return this;
    }

    this.talon.push(card);

    return this;
  }

  /**
   *
   * @param {string} cardLocation The parent of the cards current location
   * @param {string} card The card that you'd like to move
   * @param {string} destination The parent where you'd like to move the card to
   * @returns {Patience} The game of patience where this method is called on
   */
  move(cardLocation, card, destination) {
    const cardLocationArray = cardLocation.split("[");
    const destinationArray = destination.split("[");

    if (cardLocationArray[1]) {
      if (this[cardLocationArray[0]][parseInt(cardLocationArray[1])].open) {
        this[cardLocationArray[0]][parseInt(cardLocationArray[1])].open.splice(
          this[cardLocationArray[0]][
            parseInt(cardLocationArray[1])
          ].open.indexOf(card)
        );

        if (
          !this[cardLocationArray[0]][parseInt(cardLocationArray[1])].open[0] &&
          this[cardLocationArray[0]][parseInt(cardLocationArray[1])].closed[0]
        ) {
          this[cardLocationArray[0]][parseInt(cardLocationArray[1])].open.push(
            this[cardLocationArray[0]][
              parseInt(cardLocationArray[1])
            ].closed.shift()
          );
        }
      } else {
        this[cardLocationArray[0]][parseInt(cardLocationArray[1])].splice(
          this[cardLocationArray[0]][parseInt(cardLocationArray[1])].indexOf(
            card
          )
        );
      }
    } else {
      this.talon.splice(this.talon.indexOf(card));
    }

    if (this[destinationArray[0]][parseInt(destinationArray[1])].open) {
      this[destinationArray[0]][parseInt(destinationArray[1])].open.push(card);
    } else {
      this[destinationArray[0]][parseInt(destinationArray[1])].push(card);
    }

    return this;
  }
};
