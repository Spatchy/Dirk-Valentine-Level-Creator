<template>
  <canvas-toolbar
    :initialisedIsOutside="true"
    @changeBackground="changeBackground($event)"
  />
  <div ref="canvasStack" id="canvasStack">
    <canvas ref="backGroundCanvas" :height="canvasHeight" :width="canvasWidth" style="z-index: -1"></canvas>
    <canvas v-for="(n, i) in numberOfLayers" :key="i" :ref="`canvasLayer${i}`" :height="canvasHeight" :width="canvasWidth" :style="`z-index: ${i}`"></canvas>
    <canvas ref="selectionCanvas" :height="canvasHeight" :width="canvasWidth" @click="canvasAction($event)" style="z-index: 99999"></canvas>
  </div>
</template>

<script>
import canvasToolbar from "./canvasToolbar.vue"
export default {
  name: "levelCanvas",
  components: {
    canvasToolbar
  },
  data() {
    return {
      numberOfLayers: 3,
    }
  },
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
      const ctx = this.$refs.levelCanvas.getContext("2d")
      const imageElem = new Image()
      imageElem.src = tile.tileImage
      ctx.drawImage(imageElem, x, y)
      window.ipc.send("INSERT_TILE", [tile.number, x/64, y/64])
    },
    addLayer() {
      this.numberOfLayers++
    },
    changeBackground(isOutside) {
      console.log(isOutside)
    }
  }
}
</script>

<style scoped>
  canvas {
    border-width: 1px;
    border-color: black;
    border-style: solid;
  }
  #canvasStack {
    display: flex;
  }
</style>