<template>
  <canvas ref="levelCanvas" :height="canvasHeight" :width="canvasWidth" @click="canvasAction($event)"></canvas>
</template>

<script>
export default {
  name: "levelCanvas",
  props: {
    tilesWidth: Number,
    tilesHeight: Number,
    tileSet: Object,
    selectedTile: Number,
  },
  computed: {
    canvasWidth() {
      return this.tilesWidth * 64
    },
    canvasHeight() {
      return this.tilesHeight * 64
    }
  },
  methods: {
    canvasAction(event) {
      const xy = this.getCursorPosition(event)
      const x = xy[0]
      const y = xy[1]
      const tileX = this.translatePosition(x)
      const tileY = this.translatePosition(y)
      this.placeTile(this.tileSet[this.selectedTile], tileX, tileY)
    },

    getCursorPosition(event) {
      const canvas = this.$refs.levelCanvas
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      return [x, y]
    },

    translatePosition(pos) {
      return Math.floor(pos/64)*64
    },

    placeTile(tile, x, y) {
      const ctx = this.refs.levelCanvas.getContext("2d")
      ctx.drawImage(tile.tileImage, x, y)
    }
  }
}
</script>

<style scoped>
  canvas {
    border-width: 1px;
    border-color: black;
  }
</style>