const mergeImages = require('merge-images');
const { Canvas, Image } = require('canvas');

class Tile {
  constructor(baseLayer, additionalLayers = [], width = 1, height = 1) {
    this.width = width;
    this.height = height;
    this.tileImage = baseLayer;
    if(additionalLayers.length > 0) {
      this.assembleLayers(additionalLayers);
    }
  }

  setTileImage(b64){
    this.tileImage = b64;
  }

  assembleLayers(additionalLayers) {
    mergeImages(additionalLayers.unshift(this.baseLayer), {
      Canvas: Canvas,
      Image: Image
    })
      .then(b64 => this.setTileImage(b64));
  }
}