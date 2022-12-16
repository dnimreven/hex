export enum HexOrientation {
  Vertical = 1,
  Horizontal = 2,
}

export class Hex {
  // Cube coordinates
  private _q: number;
  private _r: number;
  private _s: number;

  // Cartesian dimensions
  private readonly _height: number;
  private readonly _width: number;

  // Cartesian dimensions
  private readonly _x: number;
  private readonly _y: number;
  private readonly _radius: number = 1;

  // Hex parameters for visuals
  protected readonly _vertexes: Array<[number, number]> = new Array(6);
  protected readonly _edges: number[] = new Array(6);

  public readonly neighbors: Array<number[]> = new Array(6);

  constructor(q: number, r: number, s: number, radius = 1) {
    if (Number(q) + Number(r) + Number(s) !== 0) {
      throw new Error('Invalid hex coordinates');
    }

    this._q = Number(q) || 0;
    this._r = Number(r) || 0;
    this._s = Number(s) || 0;

    this.neighbors = [
      [this._q + 1, this._r - 1, this._s],
      [this._q, this._r - 1, this._s + 1],
      [this._q - 1, this._r, this._s + 1],
      [this._q - 1, this._r + 1, this._s],
      [this._q, this._r + 1, this._s - 1],
      [this._q + 1, this._r, this._s - 1],
    ];

    this._radius = Number(radius) ?? 1;
    this._height = 2 * this._radius;
    this._width = Math.sqrt(3) * this._radius;

    this._x = 0.5 * this._width * (this.q - this.r);
    this._y = 0.75 * this._height * this.s;

    const xProjection = Math.cos(Math.PI / 6) * this._radius;
    const yProjection = 0.5 * this._radius;

    this._vertexes = [
      [xProjection, yProjection],
      [0, 1],
      [-xProjection, yProjection],
      [-xProjection, -yProjection],
      [0, -1],
      [xProjection, -yProjection],
    ];

    this._edges = [1, 1, 1, 1, 1, 1];
  }

  get q() {
    return this._q;
  }

  get r() {
    return this._r;
  }

  get s() {
    return this._s;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  /**
   * Produce Hex at position of combined coordinates of two Hexes
   * @param other
   */
  private add(other: Hex) {
    return new Hex(this._q + other.q, this._r + other.r, this._s + other.s);
  }

  /**
   * Produce Hex at position of combined coordinates of two Hexes
   * @param other
   */
  private subtract(other: Hex) {
    return new Hex(this._q - other.q, this._r - other.r, this._s - other.s);
  }

  /**
   * Returns largest module of Hex coordinates.
   */
  private module() {
    return Math.max(Math.abs(this._q), Math.abs(this._r), Math.abs(this._s));
  }

  /**
   * String representation of Hex.
   */
  public toString() {
    return [this._q, this._r, this._s].toString();
  }

  /**
   * Two Hexes considered equal if they have same cubic coordinates.
   * @param other Hex to compare
   */
  public equals(other: Hex) {
    return this.toString() === other.toString();
  }

  /**
   * Get how many hexes between `this` and `other` Hex.
   * @param other Hex to compare
   */
  public distanceTo(other: Hex): number {
    return other.subtract(this).module();
  }

  /**
   * Returns axial coordinates of Hex.
   */
  public toAxial() {
    return [this.q, this.s];
  }

  /**
   * Get Hex coordinates of given cartesian point
   * @param x horizontal position component
   * @param y vertical position component
   * @param [radius] Size of a Hex cell
   */
  public static at(x: number, y: number, radius = 1): Hex {
    const scaledX = x / radius;
    const scaledY = y / radius;

    const t = scaledX / Math.sqrt(3);
    const a = Math.ceil(2 * t);
    const b = Math.ceil(-t - scaledY);
    const c = Math.ceil(-t + scaledY);

    return new Hex(
      Math.round((a - c) / 3),
      Math.round((b - a) / 3),
      Math.round((c - b) / 3),
    );
  }

  /**
   * Get Hexes on a line between `this` and `other`
   * @param other
   */
  public lineTo(other: Hex): Hex[] {
    const distance = this.distanceTo(other);
    const dx = (other.x - this.x) / distance;
    const dy = (other.y - this.y) / distance;

    const result = [];

    for (let i = 0; i < distance; i++) {
      result.push(Hex.at(this.x + dx * i, this.y + dy * i));
    }

    result.push(other);

    return result;
  }
}
