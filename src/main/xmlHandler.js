import fs from "fs"
import { xml2js, js2xml } from "xml-js";
import settingManager from "./settingsManager"

const projectPath = settingManager.appdata + "/projects"


export default {
  saveLevelData(levelData, project, levelNum) {
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
    const savepath = projectPath + "/working/" + project + "/" + settingManager.xmlNamesMap[levelNum-1]
    fs.writeFileSync(savepath, js2xml(jsonToConvert, {compact:true}))
  },

  openLevelData(path) {
    const xml = fs.readFileSync(path)
    return xml2js(xml, {compact: true})
  }
}