const { TypeError, ValidationError, PatienceRuleError } = require("./errors");
const createDeckCards = require("../functions/createDeckCards");
const generateUUID = require("generate-uuid.js");

module.exports = class Patience {
  /**
   * Gets called when the Patience class is instantiated
   * @param {Deck} deck The deck where you'd like to play Patience with
   */
  constructor(deck) {
    if (typeof deck != "object")
      throw new TypeError("Deck/object", "deck", typeof deck);

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
    if (typeof cardLocation != "string")
      throw new TypeError("string", "cardLocation", typeof cardLocation);
    if (typeof card != "string")
      throw new TypeError("string", "card", typeof card);
    if (typeof destination != "string")
      throw new TypeError("string", "destination", typeof destination);

    const CARD_RANKS = [
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
      undefined,
    ];

    const options = {
      CARD_LOCATION: [
        "tableau[0]",
        "tableau[1]",
        "tableau[2]",
        "tableau[3]",
        "tableau[4]",
        "tableau[5]",
        "tableau[6]",
        "talon",
        "foundations[0]",
        "foundations[1]",
        "foundations[2]",
        "foundations[3]",
      ],
      DESTINATION: [
        "tableau[0]",
        "tableau[1]",
        "tableau[2]",
        "tableau[3]",
        "tableau[4]",
        "tableau[5]",
        "tableau[6]",
        "foundations[0]",
        "foundations[1]",
        "foundations[2]",
        "foundations[3]",
      ],
      card: createDeckCards(),
    };

    if (!options.CARD_LOCATION.includes(cardLocation))
      throw new ValidationError(
        options.CARD_LOCATION,
        "cardLocation",
        cardLocation
      );
    if (!options.card.includes(card))
      throw new ValidationError(options.card, "card", card);
    if (!options.DESTINATION.includes(destination))
      throw new ValidationError(
        options.DESTINATION,
        "destination",
        destination
      );

    const cardLocationArray = cardLocation.toLowerCase().split("[");
    const destinationArray = destination.toLowerCase().split("[");

    if (this[destinationArray[0]][parseInt(destinationArray[1])].open) {
      if (
        this[destinationArray[0]][parseInt(destinationArray[1])].open.length < 1
      ) {
        if (!card.startsWith("K"))
          throw new PatienceRuleError(card, "empty space in the tableau");
      } else {
        if (
          !(
            ((card.endsWith("C") || card.endsWith("S")) &&
              (this[destinationArray[0]][parseInt(destinationArray[1])].open[
                this[destinationArray[0]][parseInt(destinationArray[1])].open
                  .length - 1
              ].endsWith("H") ||
                this[destinationArray[0]][parseInt(destinationArray[1])].open[
                  this[destinationArray[0]][parseInt(destinationArray[1])].open
                    .length - 1
                ].endsWith("D"))) ||
            ((card.endsWith("H") || card.endsWith("D")) &&
              (this[destinationArray[0]][parseInt(destinationArray[1])].open[
                this[destinationArray[0]][parseInt(destinationArray[1])].open
                  .length - 1
              ].endsWith("C") ||
                this[destinationArray[0]][parseInt(destinationArray[1])].open[
                  this[destinationArray[0]][parseInt(destinationArray[1])].open
                    .length - 1
                ].endsWith("S")))
          ) ||
          !this[destinationArray[0]][parseInt(destinationArray[1])].open[
            this[destinationArray[0]][parseInt(destinationArray[1])].open
              .length - 1
          ].startsWith(CARD_RANKS[CARD_RANKS.indexOf(card.slice(0, 1)) + 1])
        )
          throw new PatienceRuleError(
            card,
            `${
              this[destinationArray[0]][parseInt(destinationArray[1])].open[
                this[destinationArray[0]][parseInt(destinationArray[1])].open
                  .length - 1
              ]
            } in the tableau`
          );
      }
      this[destinationArray[0]][parseInt(destinationArray[1])].open.push(card);
    } else {
      if (this[destinationArray[0]][parseInt(destinationArray[1])].length < 1) {
        if (!card.startsWith("K"))
          throw new PatienceRuleError(card, "empty space in the foundations");
      } else {
        if (
          !(
            card.endsWith(
              this[destinationArray[0]][parseInt(destinationArray[1])][
                this[destinationArray[0]][parseInt(destinationArray[1])]
                  .length - 1
              ].slice(1)
            ) ||
            !this[destinationArray[0]][parseInt(destinationArray[1])][
              this[destinationArray[0]][parseInt(destinationArray[1])].length -
                1
            ].startsWith(CARD_RANKS[CARD_RANKS.indexOf(card.slice(0, 1)) + 1])
          )
        )
          throw new PatienceRuleError(
            card,
            `${
              this[destinationArray[0]][parseInt(destinationArray[1])][
                this[destinationArray[0]][parseInt(destinationArray[1])]
                  .length - 1
              ]
            } in the foundations`
          );
      }

      this[destinationArray[0]][parseInt(destinationArray[1])].push(card);
    }

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

    return this;
  }
};
