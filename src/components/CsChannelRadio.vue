<template>
  <div class="cs-channel-select">
    <input type="radio" name="channel" id="channel-red" value="red" />
    <label for="channel-red">red</label>
    <input type="radio" name="channel" id="channel-green" value="green" />
    <label for="channel-green">green</label>
    <input type="radio" name="channel" id="channel-blue" value="blue" />
    <label for="channel-blue">blue</label>
  </div>
</template>

<script lang="ts">
import { Vue, Component, PropSync } from "vue-property-decorator";

export default class CsChannelSelect extends Vue {
  @PropSync("channel", { type: String }) syncedChannel!: string;
}
</script>
