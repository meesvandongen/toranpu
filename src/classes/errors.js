module.exports.TypeError = class TypeError extends Error {
  /**
   * Gets called when the TypeError class is instantiated
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
   * Gets called when the TypeError class is instantiated
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
   * Gets called when the PatienceRuleError class is instantiated
   * @param {string} locationCard The card that's being tried to move
   * @param {string} destinationCard The card where the locationCard is gonna be placed under
   */
  constructor(locationCard, destinationCard) {
    super(`A ${locationCard} can't be placed under a(n) ${destinationCard}`);
    this.name = "PatienceRuleError";
  }
};
