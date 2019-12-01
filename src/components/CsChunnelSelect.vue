<template>
  <div class="cs-chunnel-select">
    <input
      type="radio"
      name="chunnel"
      id="channel-red"
      value="red"
      v-model="chunnel"
    />
    <label for="chunnel-red">red</label>
    <input
      type="radio"
      name="chunnel"
      id="channel-green"
      value="green"
      v-model="chunnel"
    />
    <label for="chunnel-green">green</label>
    <input
      type="radio"
      name="chunnel"
      id="channel-blue"
      value="blue"
      v-model="chunnel"
    />
    <label for="chunnel-blue">blue</label>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

export default class CsChunnelSelect extends Vue {
  chunnel = "red";
}
</script>
