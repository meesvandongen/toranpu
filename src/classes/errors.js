module.exports.TypeError = class TypeError extends Error {
  /**
   * A TypeError
   * @param {string} expected The expected type of the variable
   * @param {string} varName The name of the variable
   * @param {string} got The actual type of the variable
   */
  constructor(expected, varName, got) {
    super(`Expected type ${expected} as ${varName}, but got: ${got}`);
    this.name = "TypeError";
  }
};

module.exports.ValidationError = class ValidationError extends Error {
  /**
   * A ValidationError
   * @param {Array} expected The array with options of the variable
   * @param {string} varName The name of the variable
   * @param {string} got The actual value of the variable
   */
  constructor(expected, varName, got) {
    super(
      `${got} is not a valid ${varName}, valid ${varName}s: [${expected.join(
        ", "
      )}]`
    );
    this.name = "ValidationError";
  }
};
module.exports.PatienceRuleError = class PatienceRuleError extends Error {
  /**
   * A PatienceRuleError
   * @param {string} locationCard The card that's being tried to move
   * @param {string} destinationCard The card where the locationCard is gonna be placed under
   * @param {string} destination The parent where the card has to move to
   */
  constructor(locationCard, destinationCard, destination) {
    super(
      `A ${locationCard} can't be placed under a(n) ${destinationCard} in the ${destination}`
    );
    this.name = "PatienceRuleError";
  }
};
module.exports.TopTalonError = class TopTalonError extends Error {
  /**
   * A PatienceRuleError
   */
  constructor() {
    super(
      "When you're moving a card from the talon it can only be the top card of the talon"
    );
    this.name = "PatienceRuleError";
  }
};
module.exports.BottomToFoundationsError = class BottomToFoundationsError extends (
  Error
) {
  /**
   * A PatienceRuleError
   */
  constructor() {
    super(
      "When you're moving a card to a foundation it can only be the lowest card of the column"
    );
    this.name = "PatienceRuleError";
  }
};
