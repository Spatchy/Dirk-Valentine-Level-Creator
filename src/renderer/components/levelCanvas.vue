<template>
  <canvas-toolbar
    :initialisedIsOutside="initialisedIsOutside"
    @changeBackground="changeBackground($event)"
  />
  <div ref="canvasStack" id="canvasStack">
    <canvas ref="backgroundCanvas" :height="canvasHeight" :width="canvasWidth" style="z-index: -1"></canvas>
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
      initialisedIsOutside: false,
      backgroundImageData: null,
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
  mounted() {
    window.ipc.send("GET_BACKGROUND_IMAGE_DATA", "")

    window.ipc.on("GET_BACKGROUND_IMAGE_DATA", response => {
      this.backgroundImageData = response
      this.paintBackgroundCanvas(this.initialisedIsOutside)
    })
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
      const canvas = this.$refs.selectionCanvas
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      return [x, y]
    },

    translatePosition(pos) {
      return Math.floor(pos/64)*64
    },

    placeTile(tile, x, y) { // change this to reflect layering system
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
      this.paintBackgroundCanvas(isOutside)
    },

    paintBackgroundCanvas(isOutside) {
      const arrToUse = [this.backgroundImageData[0]]
      if(isOutside) {
        arrToUse.push(this.backgroundImageData[1])
      } else {
        arrToUse.push(this.backgroundImageData[2])
      }
      const bgCanvas = this.$refs.backgroundCanvas
      const ctx = bgCanvas.getContext("2d")
      arrToUse.forEach(image => {
        const imageElem = new Image()
        imageElem.src = image
        imageElem.addEventListener("load", () => {
          console.log("load successful")
          const pattern = ctx.createPattern(imageElem, "repeat")
          ctx.fillStyle = pattern
          ctx.fillRect(0, 0, bgCanvas.width, bgCanvas.height)
        })
        imageElem.addEventListener("error", (e) => {
          console.error(e)
        })
      });
      
    },
  }
}
</script>

<style scoped>
  canvas {
    border-width: 1px;
    border-color: black;
    border-style: solid;
    position: absolute;
    top: 0px;
    left: 0px;
  }
#canvasStack {
    position: relative;
  }
</style>