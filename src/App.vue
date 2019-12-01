<template>
  <div id="app">
    <h1>Color stats</h1>
    <div class="controls">
      <CsUpload @change="onChangeFile" />
      <CsRadiusSlider @change="onChangeRadius" />
      <CsChannelRadio :channel="channel" @update:channel="onUpdateChannel" />
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
          :chartData="sbChartData"
          :chartOptions="sbChartOptions"
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
import CsChannelRadio from "@/components/CsChannelRadio.vue";
import CsImage from "@/components/CsImage.vue";
import CsScatter from "@/components/CsScatter.vue";

@Component({
  components: {
    CsUpload,
    CsRadiusSlider,
    CsChannelRadio,
    CsImage,
    CsScatter
  }
})
export default class App extends Vue {
  dataURL = "";
  radius = 30;
  channel = ColorStats.Channel.Red;
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

  get sbChartData() {
    return this.createChartData("#f87979", 1, 2);
  }

  get hbChartData() {
    return this.createChartData("#79f879", 0, 2);
  }

  get hsChartData() {
    return this.createChartData("#7979f8", 0, 1);
  }

  get sbChartOptions() {
    return this.createChartOptions({
      x: { label: "Saturation", min: 0, max: 1, stepSize: 0.2 },
      y: { label: "Brightness", min: 0, max: 1, stepSize: 0.2 }
    });
  }

  get hbChartOptions() {
    return this.createChartOptions({
      x: { label: "Hue", min: 0, max: 360, stepSize: 60 },
      y: { label: "Brightness", min: 0, max: 1, stepSize: 0.2 }
    });
  }

  get hsChartOptions() {
    return this.createChartOptions({
      x: { label: "Hue", min: 0, max: 360, stepSize: 60 },
      y: { label: "Saturation", min: 0, max: 1, stepSize: 0.2 }
    });
  }

  createChartData(
    color: string,
    indexX: number,
    indexY: number
  ): Chart.ChartData {
    return {
      datasets: [
        {
          label: "",
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

  createChartOptions(data: ColorStats.ChartAxisData): Chart.ChartOptions {
    return {
      scales: {
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: data.x.label
            },
            ticks: {
              min: data.x.min,
              max: data.x.max,
              stepSize: data.x.stepSize
            }
          }
        ],
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: data.y.label
            },
            ticks: {
              min: data.y.min,
              max: data.y.max,
              stepSize: data.y.stepSize
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

  onUpdateChannel(channel: ColorStats.Channel) {
    console.log(channel);
    this.channel = channel;
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
