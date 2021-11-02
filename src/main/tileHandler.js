const mergeImages = require('merge-images');
const { Canvas, Image } = require('canvas');
import fs from "fs";
import settingsManager from "./settingsManager";

const extractPath = settingsManager.appdata + "/projects/extract";

class Tile {
  constructor(number, name, baseLayer, additionalLayers = [], width = 1, height = 1) {
    this.number = number
    this.name = name;
    this.width = width;
    this.height = height;
    this.tileImage = this.pathToBase64(this.mkPath(baseLayer));
    if(additionalLayers.length > 0) {
      this.assembleLayers(this.pathArrToBase64(additionalLayers));
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

  pathToBase64(path) {
    return fs.readFileSync(path, {encoding: 'base64'})
  }

  pathArrToBase64(pathArr) {
    b64Arr = [];
    pathArr.forEach(path => {
      b64Arr.push(this.pathToBase64(this.mkPath(path)))
    });
    return b64Arr;
  }

  mkPath(file) {
    return extractPath + "/" + file;
  }
}

export default {
  tileLibrary = [
    new Tile(0, "air", null),
    new Tile(1, "sign", "1345.png"),
    new Tile(2, "unarmored-center", "449.png"),
    new Tile(3, "unarmored-center-decoration-1", "452.png"),
    new Tile(4, "unarmored-center-decoration-2", "455.png"),
    new Tile(5, "unarmored-center-decoration-3", "458.png"),
    new Tile(6, "unarmored-center-decoration-4", "461.png"),
    new Tile(7, "unarmored-center-decoration-5", "464.png"),
    new Tile(8, "unarmored-center-decoration-6", "467.png"),
    new Tile(9, "unarmored-center-decoration-7", "470.png"),
    new Tile(10, "unarmored-floor-left", "473.png"),
    new Tile(11, "unarmored-floor-middle", "476.png"),
    new Tile(12, "unarmored-floor-right", "479.png"),
    new Tile(13, "unarmored-wall-left", "482.png"),
    new Tile(14, "unarmored-wall-right", "485.png"),
    new Tile(15, "unarmored-ceiling-left", "488.png"),
    new Tile(16, "unarmored-ceiling-middle", "491.png"),
    new Tile(17, "unarmored-ceiling right", "494.png"),
    new Tile(18, "armored-floor-left", "413.png"),
    new Tile(19, "armored-floor-middle", "416.png"),
    new Tile(20, "armored-floor-right", "419.png"),
    new Tile(21, "armored-wall-left", "422.png"),
    new Tile(22, "armored-center-emblem", "425.png"),
    new Tile(23, "armored-wall-right", "428.png"),
    new Tile(24, "armored-ceiling-left", "431.png"),
    new Tile(25, "armored-ceiling-middle", "434.png"),
    new Tile(26, "armored-ceiling-right", "437.png"),
    new Tile(27, "armored-ceiling-middle-decoration", "440.png"),
    new Tile(28, "armored-center", "443.png"),
    new Tile(29, "armored-floor-middle-decoration", "446.png"),
    new Tile(30, "archway-top", "497.png", [], 2),
    new Tile(31, "archway-pillars-1", "500.png", [], 2),
    new Tile(32, "archway-pillars-2", "503.png", [], 2),
    new Tile(33, "archway-bottom", "506.png", [], 2),
    new Tile(34, "pipe-se", "509.png"),
    new Tile(35, "pipe-sw", "512.png"),
    new Tile(36, "pipe-ne", "515.png"),
    new Tile(37, "pipe-nw", "518.png"),
    new Tile(38, "pipe-ew", "521.png"),
    new Tile(39, "pipe-ns", "524.png"),
    new Tile(40, "pipe-sc-terminate", "527.png"),
    new Tile(41, "pipe-ec-terminate", "530.png"),
    new Tile(42, "pipe-wc-terminate", "533.png"),
    new Tile(43, "pipe-generator-1", "536.png"),
    new Tile(44, "pipe-generator-2", "539.png"),
    new Tile(45, "unarmored-one-tall-right", "581.png"),
    new Tile(46, "unarmored-one-tall-left", "584.png"),
    new Tile(47, "unarmored-floor-one-wide", "587.png"),
    new Tile(48, "unarmored-middle-one-wide", "590.png"),
    new Tile(49, "unarmored-platform-1x1", "593.png"),
    new Tile(50, "unarmored-one-tall-middle", "596.png"),
    new Tile(51, "unarmored-ceiling-one-wide", "599.png"),
    // add rest after testing...
  ]
}