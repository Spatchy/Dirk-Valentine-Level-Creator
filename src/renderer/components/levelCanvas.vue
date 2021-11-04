<template>
  <canvas ref="levelCanvas" :height="canvasHeight" :width="canvasWidth"></canvas>
</template>

<script>
export default {
  name: "levelCanvas",
  props: {
    tilesWidth: Number,
    tilesHeight: Number
  },
  computed: {
    canvasWidth() {
      return this.tilesWidth * 64
    },
    canvasHeight() {
      return this.tilesHeight * 64
    }
  }
}
</script>