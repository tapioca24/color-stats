<template>
  <div class="cs-image">
    <canvas
      :width="width"
      :height="height"
      class="canvas-org"
      ref="canvasOrg"
    ></canvas>
    <canvas
      class="canvas-mask"
      ref="canvasMask"
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
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import chroma from "chroma-js";
import { debounce } from "lodash";
import ColorMap from "@/ColorMap";
import { ColorStats } from "@/types";

@Component
export default class CsImage extends Vue {
  width = 300;
  height = 150;
  ctxOrg: CanvasRenderingContext2D | null = null;
  ctxMask: CanvasRenderingContext2D | null = null;
  colorMap: ColorMap = new ColorMap();
  points: ColorStats.Point[] = [];

  drawing = false;
  prevPos: ColorStats.Point = { x: 0, y: 0 };

  get size() {
    return this.width * this.height;
  }

  @Prop({ type: String, required: true }) readonly dataURL!: string;
  @Prop({ type: Number, required: true }) readonly radius!: number;

  @Watch("dataURL")
  onChangeFile(val: string) {
    if (val) {
      this.drawImage();
    }
  }

  mounted() {
    const canvasOrg = this.$refs.canvasOrg as HTMLCanvasElement;
    this.ctxOrg = canvasOrg.getContext("2d");
    const canvasMask = this.$refs.canvasMask as HTMLCanvasElement;
    this.ctxMask = canvasMask.getContext("2d");
  }

  drawImage() {
    const img = new Image();
    img.onload = async () => {
      this.width = img.width;
      this.height = img.height;

      await Vue.nextTick();

      if (this.ctxOrg) {
        this.ctxOrg.drawImage(img, 0, 0);
        this.resetColorMap();
        this.resetMask();
      }
    };
    img.src = this.dataURL;
  }

  resetColorMap() {
    if (!this.ctxOrg) {
      return;
    }
    const imageData = this.ctxOrg.getImageData(0, 0, this.width, this.height);
    this.colorMap.setData(imageData, this.width, this.height);
  }

  resetMask() {
    if (!this.ctxMask) {
      return;
    }
    this.ctxMask.clearRect(0, 0, this.width, this.height);
    this.onUpdatedMask();
  }

  drawMask(begin: ColorStats.Point, end: ColorStats.Point) {
    if (!this.ctxMask) {
      return;
    }
    this.ctxMask.beginPath();
    this.ctxMask.moveTo(begin.x, begin.y);
    this.ctxMask.lineTo(end.x, end.y);
    this.ctxMask.strokeStyle = "blue";
    this.ctxMask.lineCap = "round";
    this.ctxMask.lineWidth = this.radius;
    this.ctxMask.stroke();
    this.onUpdatedMask();
  }

  onmousedown(e: MouseEvent) {
    const pos = this.getMousePos(e);
    this.prevPos = pos;
    this.drawing = true;
  }

  onmouseup(e: MouseEvent) {
    if (!this.drawing) {
      return;
    }
    const pos = this.getMousePos(e);
    this.drawMask(this.prevPos, pos);
    this.drawing = false;
  }

  onmousemove(e: MouseEvent) {
    if (!this.drawing) {
      return;
    }
    const pos = this.getMousePos(e);
    this.drawMask(this.prevPos, pos);
    this.prevPos = pos;
  }

  onmouseleave(e: MouseEvent) {
    this.drawing = false;
  }

  getMousePos(e: MouseEvent) {
    const canvasMask = this.$refs.canvasMask as HTMLCanvasElement;
    const rect = canvasMask.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x, y } as ColorStats.Point;
  }

  onUpdatedMask = debounce(this.calcPoints, 500, { maxWait: 1000 });

  calcPoints() {
    if (!this.ctxMask) {
      return;
    }
    const maskData = this.ctxMask.getImageData(0, 0, this.width, this.height);
    this.points = [];

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const index = (this.width * y + x) * 4;
        const blue = maskData.data[index + 2];
        if (blue > 0) {
          this.points.push({ x, y });
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cs-image {
  position: relative;
  width: 100%;
  .canvas-org,
  .canvas-mask {
    position: absolute;
    top: 0;
    left: 0;
  }
  .canvas-mask {
    opacity: 0.5;
  }
}
</style>
