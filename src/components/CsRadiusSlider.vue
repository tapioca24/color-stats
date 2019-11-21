<template>
  <div class="cs-radius-slider">
    <input
      v-model="radiusStr"
      @change="onChange"
      @input="onInput"
      type="range"
      min="2"
      max="80"
      step="0.1"
    />
    <canvas
      ref="preview"
      class="preview"
      :width="width"
      :height="height"
    ></canvas>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Emit } from "vue-property-decorator";

@Component
export default class CsRadiusSlider extends Vue {
  radiusStr = "30";
  width = 100;
  height = 100;
  ctx: CanvasRenderingContext2D | null = null;

  get radius() {
    return parseFloat(this.radiusStr);
  }

  get fixedRadius() {
    return this.radius.toFixed(1);
  }

  @Emit()
  change(radius: number) {}

  mounted() {
    const canvas = this.$refs.preview as HTMLCanvasElement;
    this.ctx = canvas.getContext("2d");
    this.drawPreview();
  }

  onChange() {
    this.change(this.radius);
  }

  onInput() {
    this.drawPreview();
  }

  drawPreview() {
    if (!this.ctx) {
      return;
    }
    // draw background
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.width, this.height);
    // draw circle
    this.ctx.beginPath();
    this.ctx.moveTo(this.width / 2, this.height / 2);
    this.ctx.lineTo(this.width / 2, this.height / 2);
    this.ctx.strokeStyle = "rgb(0, 0, 255, 0.5)";
    this.ctx.lineCap = "round";
    this.ctx.lineWidth = this.radius;
    this.ctx.stroke();
    // draw text
    this.ctx.font = "12px monospace";
    this.ctx.fillStyle = "black";
    this.ctx.textAlign = "end";
    this.ctx.fillText(
      `${this.fixedRadius}px`,
      this.width * 0.95,
      this.height * 0.95
    );
  }
}
</script>

<style lang="scss" scoped>
.preview {
  border: 1px solid #eee;
}
</style>
