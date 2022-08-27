/**
 * Creates all the cards in a standard deck of playing cards (without jokers)
 * @returns {Array} All the cards in a standard deck of playing cards (without jokers)
 */
module.exports = function createDeckCards() {
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
};
