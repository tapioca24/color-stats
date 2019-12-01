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

  interface ChartAxisInfo {
    label: string;
    min: number;
    max: number;
    stepSize: number;
  }

  export interface ChartAxisData {
    x: ChartAxisInfo;
    y: ChartAxisInfo;
  }

  export enum Channel {
    Red = "red",
    Green = "green",
    Blue = "blue"
  }
}
