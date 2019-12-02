<template>
  <div class="cs-channel-radio" :class="{ checked }">
    <input type="radio" :name="name" :value="label" />
    <div class="ui" @click="onClick">
      <div class="inner" :style="style"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";

@Component
export default class CsChannelRadio extends Vue {
  @Prop({ type: String, required: true }) readonly name!: string;
  @Prop({ type: String, required: true }) readonly label!: string;
  @Prop({ type: String, required: true }) readonly value!: string;

  @Emit()
  input(value: string) {}

  onClick() {
    this.input(this.label);
  }

  get checked() {
    return this.label === this.value;
  }

  get color() {
    switch (this.label) {
      case "red":
        return "#f87979";
      case "green":
        return "#79f879";
      case "blue":
        return "#7979f8";
      default:
        return "#aaa";
    }
  }

  get style() {
    return {
      background: this.color
    };
  }
}
</script>

<style lang="scss" scoped>
.cs-channel-radio {
  input {
    display: none;
  }
  .ui {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    .inner {
      width: 17px;
      height: 17px;
      border-radius: 50%;
    }
  }

  &.checked .ui {
    border: 2px solid #ccc;
  }
}
</style>
