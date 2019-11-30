<template>
  <div id="app">
    <h1>Color stats</h1>
    <div class="controls">
      <CsUpload @change="onChangeFile" />
      <CsRadiusSlider @change="onChangeRadius" />
      <!-- <button @click="reset">reset</button> -->
    </div>
    <!-- <CsImage ref="csImage" :dataURL="dataURL" :radius="radius" /> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CsUpload from "@/components/CsUpload.vue";
import CsRadiusSlider from "@/components/CsRadiusSlider.vue";
import CsImage from "@/components/CsImage.vue";

@Component({
  components: {
    CsUpload,
    CsRadiusSlider,
    CsImage
  }
})
export default class App extends Vue {
  dataURL = "";
  radius = 30;

  onChangeFile(dataURL: string) {
    console.log(dataURL.slice(0, 50));
    this.dataURL = dataURL;
  }

  onChangeRadius(radius: number) {
    this.radius = radius;
  }

  // reset() {
  //   const csImage = this.$refs.csImage as CsImage
  //   csImage.resetMask()
  // }
}
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
