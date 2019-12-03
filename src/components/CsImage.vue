<template>
  <div class="cs-image" :style="sizeStyle">
    <canvas
      :width="width"
      :height="height"
      class="canvas-org"
      ref="canvasOrg"
    ></canvas>
    <canvas
      class="canvas-selected"
      ref="canvasSelected"
      :width="width"
      :height="height"
      @mousedown="onmousedown"
      @mouseup="onmouseup"
      @mousemove="onmousemove"
      @mouseleave="onmouseleave"
    ></canvas>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Emit } from "vue-property-decorator";
import chroma from "chroma-js";
import { debounce } from "lodash";
import ColorMap from "@/ColorMap";
import { ColorStats } from "@/types";

@Component
export default class CsImage extends Vue {
  width = 300;
  height = 150;
  ctxOrg: CanvasRenderingContext2D | null = null;
  ctxSelected: CanvasRenderingContext2D | null = null;
  colorMap: ColorMap = new ColorMap();
  selectedPointsList: ColorStats.Point[][] = [[], [], []];

  isDrawing = false;
  prevPoint: ColorStats.Point = { x: 0, y: 0 };

  get size() {
    return this.width * this.height;
  }

  get sizeStyle() {
    return {
      width: this.width + "px",
      height: this.height + "px"
    };
  }

  get color() {
    switch (this.channel) {
      case "red":
        return "rgb(255, 0, 0)";
      case "green":
        return "rgb(0, 255, 0)";
      case "blue":
        return "rgb(0, 0, 255)";
      default:
        return "rgb(0, 0, 0)";
    }
  }

  @Prop({ type: String, required: true }) readonly dataURL!: string;
  @Prop({ type: Number, required: true }) readonly radius!: number;
  @Prop({ type: String, required: true }) readonly channel!: ColorStats.Channel;

  @Watch("dataURL")
  onChangeFile(val: string) {
    if (val) {
      this.loadImage();
    }
  }

  @Watch("selectedPointsList")
  onChangeSelectedPointsList(val: ColorStats.Point[][]) {
    const pixelColorsList: ColorStats.PixelColor[][] = [[], [], []];
    for (let c = 0; c < 3; c++) {
      for (const point of val[c]) {
        const color = this.colorMap.getColor(point.x, point.y);
        if (color) {
          pixelColorsList[c].push({ point, color });
        }
      }
    }
    this.selected(pixelColorsList);
  }

  /**
   * 選択範囲の更新イベント
   */
  @Emit()
  selectedCanvasUpdated() {}

  @Emit()
  selected(pixelColors: ColorStats.PixelColor[][]) {}

  created() {
    this.$on(
      "selected-canvas-updated",
      debounce(this.updateSelectedPoints, 200)
    );
  }

  mounted() {
    this.initialize();
  }

  /**
   * canvas の context を初期化する
   */
  initialize() {
    const canvasOrg = this.$refs.canvasOrg as HTMLCanvasElement;
    this.ctxOrg = canvasOrg.getContext("2d");
    const canvasSelected = this.$refs.canvasSelected as HTMLCanvasElement;
    this.ctxSelected = canvasSelected.getContext("2d");
    if (this.dataURL) {
      this.loadImage();
    }
  }

  /**
   * 画像をロードする
   */
  loadImage() {
    const img = new Image();

    img.onload = async () => {
      console.log("image loaded");
      this.width = img.width;
      this.height = img.height;

      // `width`, `height` が反映されるまで待つ
      await Vue.nextTick();

      if (this.ctxOrg) {
        this.ctxOrg.drawImage(img, 0, 0);
        this.resetColorMap();
        this.resetSelectedCanvas();
      }
    };

    img.src = this.dataURL;
  }

  /**
   * `colorMap` をリセットする
   */
  resetColorMap() {
    if (!this.ctxOrg) {
      return;
    }
    const imageData = this.ctxOrg.getImageData(0, 0, this.width, this.height);
    this.colorMap.setData(imageData);
  }

  /**
   * 選択範囲の canvas をリセットする
   */
  resetSelectedCanvas() {
    if (!this.ctxSelected) {
      return;
    }
    this.ctxSelected.clearRect(0, 0, this.width, this.height);
    this.selectedCanvasUpdated();
  }

  onmousedown(e: MouseEvent) {
    const pos = this.getMousePos(e);
    this.prevPoint = pos;
    this.isDrawing = true;
  }

  onmouseup(e: MouseEvent) {
    if (!this.isDrawing) {
      return;
    }
    const pos = this.getMousePos(e);
    this.drawLineOnSelectedCanvas(this.prevPoint, pos);
    this.isDrawing = false;
  }

  onmousemove(e: MouseEvent) {
    if (!this.isDrawing) {
      return;
    }
    const pos = this.getMousePos(e);
    this.drawLineOnSelectedCanvas(this.prevPoint, pos);
    this.prevPoint = pos;
  }

  onmouseleave(e: MouseEvent) {
    this.isDrawing = false;
  }

  getMousePos(e: MouseEvent) {
    const canvasSelected = this.$refs.canvasSelected as HTMLCanvasElement;
    const rect = canvasSelected.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x, y } as ColorStats.Point;
  }

  /**
   * 選択範囲を示す canvas に直線を描画する
   */
  drawLineOnSelectedCanvas(begin: ColorStats.Point, end: ColorStats.Point) {
    if (!this.ctxSelected) {
      return;
    }
    this.ctxSelected.beginPath();
    this.ctxSelected.moveTo(begin.x, begin.y);
    this.ctxSelected.lineTo(end.x, end.y);
    this.ctxSelected.strokeStyle = this.color;
    this.ctxSelected.lineCap = "round";
    this.ctxSelected.lineWidth = this.radius;
    this.ctxSelected.stroke();
    this.selectedCanvasUpdated();
  }

  /**
   * 選択範囲の座標のリストを更新する
   */
  updateSelectedPoints() {
    if (!this.ctxSelected) {
      return;
    }
    const selectedData = this.ctxSelected.getImageData(
      0,
      0,
      this.width,
      this.height
    );

    const selectedPointsList: ColorStats.Point[][] = [[], [], []];

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const index = (this.width * y + x) * 4;

        for (let c = 0; c < 3; c++) {
          if (selectedData.data[index + c] > 0) {
            // チャンネルの輝度が 1 以上であれば選択範囲とする
            selectedPointsList[c].push({ x, y });
          }
        }
      }
    }
    this.selectedPointsList = selectedPointsList;
  }
}
</script>

<style lang="scss" scoped>
.cs-image {
  position: relative;
  .canvas-org,
  .canvas-selected {
    position: absolute;
    top: 0;
    left: 0;
  }
  .canvas-selected {
    opacity: 0.4;
  }
}
</style>
