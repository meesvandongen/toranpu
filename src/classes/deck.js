module.exports = class Deck {
  constructor() {
    let NAMES = [
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
    let SUITS = ["C", "S", "D", "H"];

    this.cards = [];

    SUITS.forEach((suit) => {
      NAMES.forEach((name) => {
        this.cards.push(name + suit);
      });
    });
  }
};
