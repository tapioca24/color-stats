export namespace ColorStats {
  export interface Point {
    x: number;
    y: number;
  }

  export type Color = [number, number, number];

  export interface PixelColor {
    point: Point;
    color: Color;
  }
}
