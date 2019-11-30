<template>
  <div id="app">
    <h1>Color stats</h1>
    <div class="controls">
      <CsUpload @change="onChangeFile" />
      <CsRadiusSlider @change="onChangeRadius" />
      <button v-if="dataURL" @click="reset">reset</button>
    </div>
    <div v-if="dataURL">
      <CsImage
        ref="csImage"
        :dataURL="dataURL"
        :radius="radius"
        @selected="onSelected"
      />
      <div class="chart-container">
        <CsScatter
          class="chart"
          :chartData="bsChartData"
          :chartOptions="bsChartOptions"
        />
        <CsScatter
          class="chart"
          :chartData="hbChartData"
          :chartOptions="hbChartOptions"
        />
        <CsScatter
          class="chart"
          :chartData="hsChartData"
          :chartOptions="hsChartOptions"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Chart, { ChartOptions } from "chart.js";
import { ColorStats } from "@/types";

import CsUpload from "@/components/CsUpload.vue";
import CsRadiusSlider from "@/components/CsRadiusSlider.vue";
import CsImage from "@/components/CsImage.vue";
import CsScatter from "@/components/CsScatter.vue";

@Component({
  components: {
    CsUpload,
    CsRadiusSlider,
    CsImage,
    CsScatter
  }
})
export default class App extends Vue {
  dataURL = "";
  radius = 30;
  pixelColors: ColorStats.PixelColor[] = [];

  get decimatedPixelColors() {
    const maxNum = 500;
    if (this.pixelColors.length < maxNum) {
      return this.pixelColors;
    }

    const decimatedRatio = 1 - maxNum / this.pixelColors.length;
    return this.pixelColors.filter(
      pixelColor => Math.random() > decimatedRatio
    );
  }

  get bsChartData() {
    return this.createChartData("Saturation-Brightness", "#f87979", 1, 2);
  }

  get hbChartData() {
    return this.createChartData("Hue-Brightness", "#79f879", 0, 2);
  }

  get hsChartData() {
    return this.createChartData("Hue-Saturation", "#7979f8", 0, 1);
  }

  get bsChartOptions() {
    return this.createChartOptions(0, 1, 0, 1, 0.2, 0.2);
  }

  get hbChartOptions() {
    return this.createChartOptions(0, 360, 0, 1, 60, 0.2);
  }

  get hsChartOptions() {
    return this.createChartOptions(0, 360, 0, 1, 60, 0.2);
  }

  createChartData(
    label: string,
    color: string,
    indexX: number,
    indexY: number
  ): Chart.ChartData {
    return {
      datasets: [
        {
          label,
          borderColor: color,
          backgroundColor: color,
          data: this.decimatedPixelColors.map(pixelColor => ({
            x: pixelColor.color[indexX],
            y: pixelColor.color[indexY]
          }))
        }
      ]
    };
  }

  createChartOptions(
    minX: number,
    maxX: number,
    minY: number,
    maxY: number,
    stepSizeX?: number,
    stepSizeY?: number
  ): Chart.ChartOptions {
    return {
      scales: {
        xAxes: [
          {
            ticks: {
              min: minX,
              max: maxX,
              stepSize: stepSizeX
            }
          }
        ],
        yAxes: [
          {
            ticks: {
              min: minY,
              max: maxY,
              stepSize: stepSizeY
            }
          }
        ]
      }
    };
  }

  onChangeFile(dataURL: string) {
    console.log(dataURL.slice(0, 50));
    this.dataURL = dataURL;
  }

  onChangeRadius(radius: number) {
    this.radius = radius;
  }

  onSelected(pixelColors: ColorStats.PixelColor[]) {
    this.pixelColors = pixelColors;
  }

  reset() {
    const csImage = this.$refs.csImage as CsImage;
    csImage.resetSelectedCanvas();
  }
}
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;

  .cs-radius-slider {
    display: inline-block;
  }

  .chart-container {
    display: flex;
  }
}
</style>
