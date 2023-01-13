export class Random {
  private static readonly MIN: number = -2147483648; // Int32 min
  private static readonly MAX: number = 2147483647; // Int32 max

  private _seed: number;
  private _value = NaN;

  // ================================================================================================================
  // CONSTRUCTOR ----------------------------------------------------------------------------------------------------

  /**
   * Generate a new Prando pseudo-random number generator.
   *
   * @param seed - A number or string seed that determines which pseudo-random number sequence will be created. Defaults to a random seed based on `Math.random()`.
   */
  constructor(seed?: number | string) {
    if (typeof seed === "string") {
      // String seed
      this._seed = this.hashCode(seed);
    } else if (typeof seed === "number") {
      // Numeric seed
      this._seed = this.getSafeSeed(seed);
    } else {
      // Pseudo-random seed
      this._seed = this.getSafeSeed(
        Random.MIN + Math.floor((Random.MAX - Random.MIN) * Math.random()),
      );
    }
    this.reset();
  }

  // ================================================================================================================
  // PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

  /**
   * Generates a pseudo-random integer number in a range (inclusive).
   *
   * @param min - The minimum number that can be randomly generated.
   * @param max - The maximum number that can be randomly generated.
   * @return The generated pseudo-random number.
   */
  public nextInt(min = 10, max = 100): number {
    this.recalculate();
    return Math.floor(
      this.map(this._value, Random.MIN, Random.MAX, min, max + 1),
    );
  }

  /**
   * Reset the pseudo-random number sequence back to its starting seed. Further calls to next()
   * will then produce the same sequence of numbers it had produced before. This is equivalent to
   * creating a new Prando instance with the same seed as another Prando instance.
   *
   * Example:
   * let rng = new Prando(12345678);
   * console.log(rng.next()); // 0.6177754114889017
   * console.log(rng.next()); // 0.5784605181725837
   * rng.reset();
   * console.log(rng.next()); // 0.6177754114889017 again
   * console.log(rng.next()); // 0.5784605181725837 again
   */
  public reset(): void {
    this._value = this._seed;
  }

  // ================================================================================================================
  // PRIVATE INTERFACE ----------------------------------------------------------------------------------------------

  private recalculate(): void {
    this._value = this.xorshift(this._value);
  }

  private xorshift(value: number): number {
    // Xorshift*32
    // Based on George Marsaglia's work: http://www.jstatsoft.org/v08/i14/paper
    value ^= value << 13;
    value ^= value >> 17;
    value ^= value << 5;
    return value;
  }

  private map(
    val: number,
    minFrom: number,
    maxFrom: number,
    minTo: number,
    maxTo: number,
  ): number {
    return ((val - minFrom) / (maxFrom - minFrom)) * (maxTo - minTo) + minTo;
  }

  private hashCode(str: string): number {
    let hash = 0;
    if (str) {
      const l = str.length;
      for (let i = 0; i < l; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
        hash = this.xorshift(hash);
      }
    }
    return this.getSafeSeed(hash);
  }

  private getSafeSeed(seed: number): number {
    if (seed === 0) return 1;
    return seed;
  }
}
