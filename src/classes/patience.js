const {
  TypeError,
  ValidationError,
  PatienceRuleError,
  TopTalonError,
  BottomToFoundationsError,
} = require("./errors");
const createDeckCards = require("../functions/createDeckCards");
const generateUUID = require("generate-uuid.js");

module.exports = class Patience {
  /**
   * A game of patience
   * @param {Deck} deck The deck where you'd like to play Patience with
   */
  constructor(deck) {
    if (typeof deck != "object")
      throw new TypeError("Deck/object", "deck", typeof deck);

    this.deck = deck;

    this.tableau = [];

    for (let i = 0; i < 7; i++) {
      this.tableau[i] = {
        open: [deck.draw()],
        closed: [],
      };

      for (let i2 = 0; i2 < i; i2++) {
        this.tableau[i].closed.push(deck.draw());
      }
    }

    this.stock = this.deck.cards;
    this.talon = [];
    this.foundations = [[], [], [], []];

    this.id = generateUUID();
  }

  /**
   * Draws a card from the stock pile and places it in the talon
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

    const cardRanks = [undefined];

    for (let i = 1; i < 11; i++) {
      cardRanks.push(`${i}`);
    }

    cardRanks.push("J", "Q", "K", undefined);

    const options = {
      cardLocation: ["talon"],
      destination: [],
      card: createDeckCards(),
    };

    for (let i = 0; i < 7; i++) {
      options.cardLocation.push(`tableau[${i}]`);
      options.destination.push(`tableau[${i}]`);
    }
    for (let i = 0; i < 4; i++) {
      options.cardLocation.push(`foundations[${i}]`);
      options.destination.push(`foundations[${i}]`);
    }

    if (!options.cardLocation.includes(cardLocation))
      throw new ValidationError(
        options.cardLocation,
        "cardLocation",
        cardLocation
      );
    if (!options.card.includes(card))
      throw new ValidationError(options.card, "card", card);
    if (!options.destination.includes(destination))
      throw new ValidationError(
        options.destination,
        "destination",
        destination
      );

    const cardLocationArray = cardLocation.toLowerCase().split("[");
    const destinationArray = destination.toLowerCase().split("[");

    let destinationCardParent =
      this[destinationArray[0]][parseInt(destinationArray[1])].open;

    if (destinationCardParent) {
      if (destinationCardParent.length < 1) {
        if (!card.startsWith("K"))
          throw new PatienceRuleError(
            card,
            "empty space",
            destination.slice(0, destination.length - 3)
          );
      } else {
        const destinationCard =
          destinationCardParent[destinationCardParent.length - 1];
        if (
          !(
            ((card.endsWith("C") || card.endsWith("S")) &&
              (destinationCard.endsWith("H") ||
                destinationCard.endsWith("D"))) ||
            ((card.endsWith("H") || card.endsWith("D")) &&
              (destinationCard.endsWith("C") || destinationCard.endsWith("S")))
          ) ||
          destinationCard.slice(0, destinationCard.length - 1) !=
            cardRanks[cardRanks.indexOf(card.slice(0, card.length - 1)) + 1]
        )
          throw new PatienceRuleError(
            card,
            destinationCard,
            destination.slice(0, destination.length - 3)
          );
      }
    } else {
      destinationCardParent =
        this[destinationArray[0]][parseInt(destinationArray[1])];

      if (destinationCardParent.length < 1) {
        if (card.slice(0, card.length - 1) != "1")
          throw new PatienceRuleError(
            card,
            "empty space",
            destination.slice(0, destination.length - 3)
          );
      } else {
        const destinationCard =
          destinationCardParent[destinationCardParent.length - 1];

        if (
          !card.endsWith(destinationCard.slice(destinationCard.length - 1)) ||
          destinationCard.slice(0, destinationCard.length - 1) !=
            cardRanks[cardRanks.indexOf(card.slice(0, card.length - 1)) - 1]
        )
          throw new PatienceRuleError(
            card,
            destinationCard,
            destination.slice(0, destination.length - 3)
          );
      }
    }

    const cardLocationParent =
      this[cardLocationArray[0]][parseInt(cardLocationArray[1])];

    if (cardLocationArray[1]) {
      if (cardLocationParent.open) {
        if (
          destination.startsWith("foundations") &&
          cardLocationParent.open[0] != card
        )
          throw new BottomToFoundationsError();
        cardLocationParent.open
          .splice(
            cardLocationParent.open.indexOf(card),
            cardLocationParent.open.length -
              cardLocationParent.open.indexOf(card)
          )
          .forEach((element) => destinationCardParent.push(element));

        if (!cardLocationParent.open[0] && cardLocationParent.closed[0]) {
          cardLocationParent.open.push(
            this[cardLocationArray[0]][
              parseInt(cardLocationArray[1])
            ].closed.shift()
          );
        }
      } else {
        cardLocationParent
          .splice(cardLocationParent.indexOf(card))
          .forEach((element) => destinationCardParent.push(element));
      }
    } else {
      if (this.talon[0] != card) throw new TopTalonError();
      destinationCardParent.push(this.talon.splice(this.talon.indexOf(card)));
    }

    return this;
  }
};
