<template>
  <div class="cs-channel-select">
    <CsChannelRadio name="channel" label="red" v-model="localValue" />
    <CsChannelRadio name="channel" label="green" v-model="localValue" />
    <CsChannelRadio name="channel" label="blue" v-model="localValue" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import CsChannelRadio from "@/components/CsChannelRadio.vue";

@Component({
  components: {
    CsChannelRadio
  }
})
export default class CsChannelSelect extends Vue {
  @Prop({ type: String, required: true }) readonly value!: string;

  @Emit()
  input(value: string) {}

  get localValue() {
    return this.value;
  }

  set localValue(value: string) {
    this.input(value);
  }
}
</script>

<style lang="scss" scoped>
.cs-channel-select {
  display: flex;
  align-items: center;
}
</style>
