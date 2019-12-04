<template>
  <div id="app">
    <h1>色分布チェッカー</h1>
    <p class="description">
      画像ファイルを選択後、色分布を知りたい箇所を塗ります。<br />
      指定範囲の HSB 表色系における色分布をグラフに表示します。
    </p>
    <div class="controls">
      <CsUpload @change="onChangeFile" />
      <CsChannelSelect v-model="channel" />
      <CsRadiusSlider @change="onChangeRadius" :channel="channel" />
      <button v-if="dataURL" @click="reset">reset</button>
    </div>
    <div v-if="dataURL">
      <CsImage
        ref="csImage"
        :dataURL="dataURL"
        :radius="radius"
        :channel="channel"
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
import CsChannelSelect from "@/components/CsChannelSelect.vue";
import CsImage from "@/components/CsImage.vue";
import CsScatter from "@/components/CsScatter.vue";

@Component({
  components: {
    CsUpload,
    CsRadiusSlider,
    CsChannelSelect,
    CsImage,
    CsScatter
  }
})
export default class App extends Vue {
  dataURL = "";
  radius = 30;

  channel: ColorStats.Channel = "red";
  pixelColorsList: ColorStats.PixelColor[][] = [[], [], []];

  get decimatedPixelColorsList() {
    const maxNum = 200;
    return this.pixelColorsList.map(pixelColors => {
      if (pixelColors.length < maxNum) {
        return pixelColors;
      }

      const decimatedRatio = 1 - maxNum / pixelColors.length;
      return pixelColors.filter(pixelColor => Math.random() > decimatedRatio);
    });
  }

  get sbChartData() {
    return this.createChartData(1, 2);
  }

  get hbChartData() {
    return this.createChartData(0, 2);
  }

  get hsChartData() {
    return this.createChartData(0, 1);
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

  createChartData(indexX: number, indexY: number): Chart.ChartData {
    const datasets: Chart.ChartDataSets[] = [];
    for (let c = 0; c < 3; c++) {
      const color = this.getChannelColor(c);
      datasets.push({
        label: "",
        borderColor: color,
        backgroundColor: color,
        data: this.decimatedPixelColorsList[c].map(pixelColor => ({
          x: pixelColor.color[indexX],
          y: pixelColor.color[indexY]
        }))
      });
    }
    return { datasets };
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

  getChannelColor(channelIndex: number) {
    let str = "#";
    for (let c = 0; c < 3; c++) {
      str += channelIndex === c ? "f8" : "79";
    }
    return str;
  }

  onChangeFile(dataURL: string) {
    console.log(dataURL.slice(0, 50));
    this.dataURL = dataURL;
  }

  onChangeRadius(radius: number) {
    this.radius = radius;
  }

  onSelected(pixelColorsList: ColorStats.PixelColor[][]) {
    while (pixelColorsList.length < 3) {
      pixelColorsList.push([]);
    }
    this.pixelColorsList = pixelColorsList;
  }

  reset() {
    const csImage = this.$refs.csImage as CsImage;
    csImage.resetSelectedCanvas();
  }
}
</script>

<style lang="scss">
#app {
  font-family: "Hiragino Kaku Gothic Pro", "ヒラギノ角ゴ Pro W3", メイリオ,
    Meiryo, "ＭＳ Ｐゴシック", sans-serif;
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
