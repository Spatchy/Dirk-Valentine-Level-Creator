import fs from "fs"
import { xml2json, js2xml } from "xml-js";
import settingManager from "./settingsManager"



export default {
  saveLevelData(levelData) {
    const layers = levelData.getLevelLayers()
    const meta = levelData.getLevelMeta()
    const signMessages = levelData.getSignMessages()

    let jsonToConvert = {
      root: {
        level: {
          _attributes: {
            outside: meta["outside"],
            start_y: meta["start_y"],
            start_x: meta["start_x"],
            width: meta["width"],
            height: meta["height"],
          }
        }
      }
    }
    let i = 0
    layers.forEach(layer => {
      const flattenedLayer = layer.flat(Infinity)
      jsonToConvert.root["tiles"]["_attributes"] = {
        id: i,
        values: flattenedLayer
      }
      i++
    });
    signMessages.forEach(sign => {
      jsonToConvert.root["sign"]["_attributes"] = {
        layer: sign.layer,
        n: sign.n,
        text: sign.text,
      }
    })

    console.log(js2xml(jsonToConvert, {compact:true}))
  }
}