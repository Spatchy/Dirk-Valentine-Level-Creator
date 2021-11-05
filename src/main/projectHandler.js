class levelData {
  constructor(width, height) {
    this.levelArray = this.make2dArray(width, height)
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
  insertTile(tileId, x, y) {
    console.log("id: " + tileId + " x: " + x + " y: " + y)
    this.levelArray[y][x] = tileId
  }
  getLevelArray() {
    return this.levelArray
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