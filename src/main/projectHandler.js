import settingsManager from "./settingsManager";

class levelData {
  constructor(width, height) {
    this.levelArray = this.make2dArray(width, height)
  }
  make2dArray(width, height) {
    const arr = []
    for(i = 0; i < height; i++) {
      const row = []
      for(i = 0; i < width; i++) {
        row.push(0)
      }
      arr.push(row)
    }
    return arr
  }
}

export default {

}