<template>
    <canvas-toolbar
      :initialIsOutside="isOutside"
      :numberOfLayers="numberOfLayers"
      :initialWidth="tilesWidth"
      :initialHeight="tilesHeight"
      :hasUnsavedChanges="hasUnsavedChanges"
      @changeWidth="changeWidth($event)"
      @changeHeight="changeHeight($event)"
      @changeBackground="changeBackground($event)"
      @changeLayerSelection="changeLayerSelection($event)"
      @addLayer="addLayer()"
      @saveLevel="saveLevel()"
    />
  <div ref="canvasStack" id="canvasStack">
    <canvas ref="backgroundCanvas" :height="canvasHeight" :width="canvasWidth" style="z-index: -1"></canvas>
    <canvas v-for="(n, i) in numberOfLayers" :key="i" :ref="`canvasLayer${i}`" :height="canvasHeight" :width="canvasWidth" :style="`z-index: ${i}`"></canvas>
    <canvas ref="canvasLayerSelectionCanvas" :height="canvasHeight" :width="canvasWidth" @click="canvasAction($event)" style="z-index: 99999"></canvas>
  </div>

  <div v-if="showSignModal" ref="signModal" class="modal is-active" style="z-index: 99999">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Edit Sign Data</p>
          <button class="delete" aria-label="close" @click="getSignModalResult(false)"></button>
        </header>
        <section class="modal-card-body">
          <p>Tip: vertical bar | represents a line break. </p>
          <p class="has-text-danger">If the text you were expecting did not show, you're probably on the wrong layer - signs are conventionally on layer 2</p>
          <textarea class="modal-text-area" v-model="signToSave.text"></textarea>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" @click="getSignModalResult(true)">Confirm</button>
          <button class="button" @click="getSignModalResult(false)">Cancel</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import canvasToolbar from "./canvasToolbar.vue"
export default {
  name: "levelCanvas",
  components: {
    canvasToolbar
  },
  props: {
    initialWidth: Number,
    initialHeight: Number,
    tileSet: Array,
    selectedTile: Number,
    characterSpriteTile: Object
  },
  data() {
    return {
      numberOfLayers: 3,
      backgroundImageData: null,
      selectedLayer: 0,
      abnormalTileIndex: {},
      showSignModal: false,
      signToSave: {
        n: null,
        layer: null,
        text: null,
      },
      callbackToExecute: null,
      tilesWidth: this.initialWidth,
      tilesHeight: this.initialHeight,
      isOutside: false,
      hasUnsavedChanges: false
    }
  },
  emits: [
    "saveLevel"
  ],
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
    })


    window.ipc.on("OPEN_LEVEL_DATA", response => {
      this.numberOfLayers = response.length
      console.log(response.length)
      window.ipc.send("GET_IS_OUTSIDE")
      window.ipc.send("GET_START_LOCATION")
      this.$nextTick(() => {
        this.paintCanvasLayers(response)
      })
    })

    window.ipc.on("GET_IS_OUTSIDE", response => {
      this.isOutside = response
      this.$nextTick(() => {
        this.paintBackgroundCanvas(this.isOutside)
      })
    })

    window.ipc.on("GET_START_LOCATION", response => {
      this.$nextTick(() => {
        this.setStart(response[0], response[1], () => {
          console.log(response)
          this.paintTile(this.characterSpriteTile, response[0]*64, response[1]*64, "SelectionCanvas")
        })
      })
    })

    window.ipc.on("GET_SIGN_DATA", response => {
      this.signToSave.n = response[0]
      this.signToSave.layer = response[1]
      const text = response[2]

      this.signToSave.text = text
      this.showSignModal = true
    })
  },
  methods: {
    canvasAction(event) {
      this.hasUnsavedChanges = true
      const xy = this.getCursorPosition(event)
      const x = xy[0]
      const y = xy[1]
      const tileX = this.translatePosition(x)
      const tileY = this.translatePosition(y)
      let tile
      if(this.selectedTile === -1) {
        tile = this.characterSpriteTile
      } else {
        tile = this.tileSet[this.selectedTile]
      }
      this.doSpecialTileActions(tile, tileX/64, tileY/64, (layerOverride) => {
        this.clearTile(tileX, tileY, layerOverride)
        this.paintTile(tile, tileX, tileY, layerOverride)
        window.ipc.send("INSERT_TILE", [tile.number, tileX/64, tileY/64, this.selectedLayer])
        if(tile.height > 1 || tile.width > 1) {
          this.abnormalTileIndex[`${this.selectedLayer}:${tileX}x${tileY}`] = [tile.width, tile.height]
        }
      })
      
    },

    getCursorPosition(event) {
      const canvas = this.$refs.canvasLayerSelectionCanvas
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      return [x, y]
    },

    translatePosition(pos) {
      return Math.floor(pos/64)*64
    },

    paintTile(tile, x, y, layerId = this.selectedLayer) {
      const ctx = this.$refs[`canvasLayer${layerId}`].getContext("2d")
      const imageElem = new Image()
      imageElem.src = tile.tileImage
      ctx.drawImage(imageElem, x, y)
    },

    clearTile(x, y, layerId = this.selectedLayer) {
      const ctx = this.$refs[`canvasLayer${layerId}`].getContext("2d")
      let widthMultiplier = 1
      let heightMultiplier = 1
      const selector = `${layerId}:${x}x${y}`
      if(selector in this.abnormalTileIndex) {
        const abnormalValues = this.abnormalTileIndex[selector]
        widthMultiplier = abnormalValues[0]
        heightMultiplier = abnormalValues[1]
        delete this.abnormalTileIndex[selector]
      }
      ctx.clearRect(x, y, 64*widthMultiplier, 64*heightMultiplier)
    },

    addLayer() {
      this.hasUnsavedChanges = true
      this.numberOfLayers++
      window.ipc.send("ADD_LAYER", "")
    },

    paintCanvasLayers(layers) {
      layers.forEach((layer, z) => {
        layer.forEach((row, y) => {
          row.forEach((tile, x) => {
            if(typeof this.tileSet[tile] == 'undefined') { // tile not in tileSet
              //console.log(`tile ID ${tile} not yet in tileset - skipping`)
            } else {
              this.paintTile(this.tileSet[tile], x*64, y*64, z)
            }
          })
        })
      })
    },

    changeBackground(isOutside) {
      this.hasUnsavedChanges = true
      this.isOutside = isOutside
      window.ipc.send("CHANGE_BACKGROUND", isOutside)
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
          const pattern = ctx.createPattern(imageElem, "repeat")
          ctx.fillStyle = pattern
          ctx.fillRect(0, 0, bgCanvas.width, bgCanvas.height)
        })
        imageElem.addEventListener("error", (e) => {
          console.error(e)
        })
      });
      
    },

    changeLayerSelection(newlayer) {
      this.selectedLayer = newlayer
    },

    doSpecialTileActions(tile, x, y, callback) {
      if(tile.number === 1) { // is sign
        this.placeSign(x, y, callback)
      } else if(tile.number === -1) { // is set start pseudo-tile
        this.setStart(x, y, () => {this.paintTile(tile, x*64, y*64, "SelectionCanvas")})
      } else {
        callback() // just carry on if no special actions required
      }
    },

    setStart(x, y, callback) {
      const selectionCanvas = this.$refs.canvasLayerSelectionCanvas
      const ctx = selectionCanvas.getContext("2d")
      ctx.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height)
      window.ipc.send("SET_START_LOCATION", [x, y])
      callback()
    },

    placeSign(x, y, callback) {
      const n = (this.tilesWidth * y) + x
      this.callbackToExecute = callback
      window.ipc.send("GET_SIGN_DATA", [n, this.selectedLayer])
    },

    getSignModalResult(result) {
      if(result) {
        const signdata = this.signToSave
        window.ipc.send("ADD_SIGN_DATA", [signdata["layer"], signdata["n"], signdata["text"]])
        this.callbackToExecute()
      }
      this.showSignModal = false
      this.callbackToExecute = null
    },

    saveLevel() {
      this.hasUnsavedChanges = false
      this.$emit("saveLevel")
    },

    saveCanvasData() {
      const dataUrlArr = []
      for(let i = 0; i < this.numberOfLayers; i++) {
        dataUrlArr.push(this.$refs[`canvasLayer${i}`].toDataURL())
      }
      console.log(dataUrlArr)
      return dataUrlArr
    },

    repaintCanvasesFromData(dataUlrArr) {
      dataUlrArr.forEach((data, i) => {
        const ctx = this.$refs[`canvasLayer${i}`].getContext("2d")
        const imageElem = new Image()
        imageElem.src = data
        imageElem.addEventListener("load", () => {
          ctx.drawImage(imageElem, 0, 0)
        })
      })
    },

    changeWidth(newTilesWidth) {
      this.hasUnsavedChanges = true
      const canvasData = this.saveCanvasData()
      this.tilesWidth = newTilesWidth
      window.ipc.send("CHANGE_WIDTH", newTilesWidth)
      this.paintBackgroundCanvas(this.isOutside)
      this.repaintCanvasesFromData(canvasData)
    },

    changeHeight(newTilesHeight) {
      this.hasUnsavedChanges = true
      const canvasData = this.saveCanvasData()
      this.tilesHeight = newTilesHeight
      window.ipc.send("CHANGE_HEIGHT", newTilesHeight)
      this.paintBackgroundCanvas(this.isOutside)
      this.repaintCanvasesFromData(canvasData)
    }
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
    overflow: scroll;
    height: 70vh;
  }
  .modal-text-area {
    width: 30em;
    height: 6em;
  }
</style>