class levelData {
  constructor(width, height, startX = 0, startY = 0, outside = false, fromData = false) {
    this.width = parseInt(width)
    this.height = parseInt(height)
    this.startX = parseInt(startX)
    this.startY = parseInt(startY)
    this.outside = typeof outside === String ? {"true":true, "false":false}[outside] : outside
    this.layers = []
    this.signMessages = []

    if(!fromData){
      for(let i = 0; i < 3; i++) { // insert 3 layers (minimum 3 needed for level to start)
        this.addLayer()
      }
    }    
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
  addLayers(layers) {
    layers.forEach(valuesString => {
      const valuesArray = valuesString.split(",").map(x => parseInt(x))
      const newLayer = []
      for (let i = 0; i < valuesArray.length; i += this.width) {
        newLayer.push(valuesArray.slice(i, i + this.width))
      }
      this.layers.push(newLayer)
    })
  }
  addSignMessage(layer, n, text) {
    const sign = {
      "layer": layer,
      "n": n,
      "text": text,
    }
    this.signMessages.push(sign)
  }
  addSignMessageArray(signs){
    this.signMessages = this.signMessages.concat(signs)
  }
  insertTile(tileId, x, y, layer) {
    console.log("id:" + tileId + " x:" + x + " y:" + y + " Layer: " + layer)
    this.layers[layer][y][x] = tileId
  }
  toggleInsideOutside() {
    this.outside = !this.outside
  }
  setStartPoint(x, y) {
    this.startX = x
    this.startY = y
  }
  changeWidth(newWidth) {
    const loopMax = Math.abs(newWidth-this.width) // determine how many columns to add or remove
    this.layers.forEach(layer => {
      layer.forEach(row => {
        for(let i = 0; i < loopMax; i++) {
          if(newWidth > this.width) {
            row.push(0)
          }
          else if(newWidth < this.width) {
            row.pop()
          }
        }
      })
    });
    this.width = newWidth
  }
  changeHeight(newHeight) {
    const loopMax = Math.abs(newHeight - this.height)
    this.layers.forEach(layer => {
      if(newHeight > this.height) {
        const arr = []
        for(let i = 0; i < this.width; i++) { // build empty row
          arr.push(0)
        }
        for(let i = 0; i < loopMax; i++) {
          layer.push(arr.slice()) // use empty slice to obtain a safe copy of arr
        }
      }
      else if(newHeight < this.height) {
        for(let i = 0; i < loopMax; i++) {
          layer.pop()
        }
      }
    })
    this.height = newHeight
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
  },

  importLevelData(dataObject) {
    const meta = dataObject.root.level["_attributes"]
    const layers = dataObject.root.tiles.map(x => x["_attributes"]["values"])
    const signs = dataObject.root.sign.map(x => x["_attributes"]).map(x => { return {"layer":parseInt(x["layer"]), "n":parseInt(x["n"]), "text":x["text"]} })
    activeLevel = new levelData(meta["width"], meta["height"], meta["start_x"], meta["start_y"], meta["outside"], true)
    activeLevel.addLayers(layers)
    activeLevel.addSignMessageArray(signs)
  }
}