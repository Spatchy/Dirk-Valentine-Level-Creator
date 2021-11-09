import fs from "fs"
import { xml2json, js2xml } from "xml-js";
import settingManager from "./settingsManager"

const projectPath = settingManager.appdata + "/projects"


export default {
  saveLevelData(levelData) {
    const layers = levelData.getLevelLayers()
    const meta = levelData.getLevelMeta()
    const signMessages = levelData.getSignMessages()

    const jsonToConvert = {
      root: {
        level: {
          _attributes: {
            outside: meta["outside"],
            start_y: meta["start_y"],
            start_x: meta["start_x"],
            height: meta["height"],
            width: meta["width"],
          }
        },
        tiles: [],
        sign: [],
        msg: { // no idea what this is for but it's in the original XML so I put it here too
          _attributes: {
            text: ""
          }
        }
      }
    }
    let i = 0
    layers.forEach(layer => {
      jsonToConvert.root.tiles.push({
        _attributes: {
          id: i,
          values: layer.flat(Infinity)
        }
      })
      i++
    });
    signMessages.forEach(sign => {
      jsonToConvert.root.sign.push({
        _attributes: {
          layer: sign.layer,
          n: sign.n,
          text: sign.text,
        }
      })
    })

    fs.writeFileSync(projectPath + "/test.xml", js2xml(jsonToConvert, {compact:true}))
  }
}