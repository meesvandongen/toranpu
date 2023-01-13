export class Random {
  private static readonly MIN: number = -2147483648;
  private static readonly MAX: number = 2147483647;

  private _seed: number;
  private _value = NaN;

  constructor(seed?: number | string) {
    if (typeof seed === "string") {
      this._seed = this.hashCode(seed);
    } else if (typeof seed === "number") {
      this._seed = this.getSafeSeed(seed);
    } else {
      this._seed = this.getSafeSeed(
        Random.MIN + Math.floor((Random.MAX - Random.MIN) * Math.random()),
      );
    }
    this.reset();
  }

  public nextInt(min = 10, max = 100): number {
    this.recalculate();
    return Math.floor(
      this.map(this._value, Random.MIN, Random.MAX, min, max + 1),
    );
  }

  public reset(): void {
    this._value = this._seed;
  }

  private recalculate(): void {
    this._value = this.xorshift(this._value);
  }

  private xorshift(value: number): number {
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
