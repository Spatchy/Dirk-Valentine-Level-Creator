class levelData {
  constructor(width, height, startX = 0, startY = 0, outside = false) {
    this.width = width
    this.height = height
    this.startX = startX
    this.startY = startY
    this.outside = outside
    this.layers = []
    this.signMessages = []
    this.addLayer()
  }
  make2dArray(width, height) {
    const arr = []
    for(let i = 0; i < height; i++) {
      const row = []
      for(let i = 0; i < width; i++) {
        row.push(0)
      }
      arr.push(row)
    }
    return arr
  }
  addLayer() {
    this.layers.push(this.make2dArray(this.width, this.height))
  }
  addSignMessage(layer, n, text) {
    const sign = {
      "layer": layer,
      "n": n,
      "text": text,
    }
    this.signMessages.push(sign)
  }
  insertTile(tileId, x, y, layer = 0) {
    console.log("id: " + tileId + " x: " + x + " y: " + y)
    this.layers[layer][y][x] = tileId
  }
  getLevelLayers() {
    return this.layers
  }
  getLevelMeta() {
    return {
      "width": this.width,
      "height": this.height,
      "start_x": this.startX,
      "start_y": this.startY,
      "outside": this.outside,
    }
  }
  getSignMessages() {
    return this.signMessages
  }
}

let activeLevel = null;

export default {
  getActiveLevel() {
    return activeLevel
  },

  createLevel(width, height) {
    console.log("CREATING LEVEL")
    activeLevel = new levelData(width, height)
  }
}