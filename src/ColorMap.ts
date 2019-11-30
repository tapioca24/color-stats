import chroma from "chroma-js";
import { ColorStats } from "@/types";

export default class ColorMap {
  private map: ColorStats.Color[][] = [];

  getColor(x: number, y: number) {
    if (x > this.map.length - 1) {
      return null;
    }
    if (y > this.map[x].length - 1) {
      return null;
    }
    return this.map[x][y];
  }

  setData(imageData: ImageData) {
    this.map = [];
    for (let x = 0; x < imageData.width; x++) {
      const line: ColorStats.Color[] = [];
      for (let y = 0; y < imageData.height; y++) {
        const index = (imageData.width * y + x) * 4;
        const color = chroma([
          imageData.data[index],
          imageData.data[index + 1],
          imageData.data[index + 2]
        ]);
        line.push(color.hsv());
      }
      this.map.push(line);
    }
  }
}
