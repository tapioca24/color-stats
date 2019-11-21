<template>
  <div class="cs-upload">
    <input class="upload" type="file" accept="image/*" @change="onChange" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Emit } from "vue-property-decorator";

@Component
export default class CsUpload extends Vue {
  @Emit()
  change(dataURL: string) {}

  onChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const files = input.files;
    if (files && files.length > 0) {
      this.readFile(files[0]);
    }
  }

  readFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const dataURL = reader.result;
      if (dataURL && typeof dataURL === "string") {
        this.change(dataURL);
      } else {
        alert("ファイルの読み込みに失敗しました");
      }
    };
    reader.readAsDataURL(file);
  }
}
</script>

<style lang="scss" scoped>
.upload {
  display: block;
  margin-bottom: 8px;
}
</style>
