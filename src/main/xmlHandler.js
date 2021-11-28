const fs = require("fs")
const { xml2js, js2xml } = require("xml-js")
const settingManager = require("./settingsManager")

const projectPath = settingManager.appdata + "/projects"


module.exports = {
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
    })

    signMessages.forEach(sign => {
      jsonToConvert.root.sign.push({
        _attributes: {
          layer: sign.layer,
          n: sign.n,
          text: sign.text,
        }
      })
    })

    if(jsonToConvert.root.sign.length === 0) {  // add dummy signs so array is present when xml data is parsed 
      jsonToConvert.root.sign.push({
        _attributes: {
          layer: 1,
          n: 9999,
          text: "dummy 1",
        }
      })
    }
    if(jsonToConvert.root.sign.length === 1) {
      jsonToConvert.root.sign.push({
        _attributes: {
          layer: 1,
          n: 9999,
          text: "dummy 2",
        }
      })
    }

    const savepath = projectPath + "/working/" + project + "/" + settingManager.xmlNamesMap[levelNum-1]
    fs.writeFileSync(savepath, js2xml(jsonToConvert, {compact:true}))
  },

  openLevelData(path) {
    const xml = fs.readFileSync(path)
    return xml2js(xml, {compact: true})
  }
}