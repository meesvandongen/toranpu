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

  draw() {
    const card = this.stock.shift();

    if (!card) {
      this.stock = this.talon;
      this.talon = [];

      return null;
    }

    this.talon.push(card);

    return card;
  }

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
