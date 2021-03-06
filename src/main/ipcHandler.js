const { shell, ipcMain, dialog, mainWindow } = require("electron")
const settingsManager = require("./settingsManager")
const swfHandler = require("./swfHandler")
const Path = require("path")
const ptyHandler = require("./ptyHandler")
const tileHandler = require("./tileHandler")
const projectHandler = require("./projectHandler")
const xmlHandler = require("./xmlHandler")
const miscAssetHandler = require("./miscAssetHandler")

module.exports = {

  openExternal: ipcMain.on("OPEN_EXTERNAL", (event, payload) => {
    shell.openExternal(payload);
  }),

  openFileDialog: ipcMain.on("OPEN_FILE_DIALOG", async (event, payload) => {
    let result = await dialog.showOpenDialog(mainWindow, payload)
      .catch((e) => {
        console.log(e);
      })
    result = result.filePaths[0];
    event.reply("OPEN_FILE_DIALOG", result);
  }),

  updateflashpointDir: ipcMain.on("UPDATE_FLASHPOINT_DIR", (event, payload) => {
    console.log(Path.dirname(payload[1].path))
    settingsManager.updateSetting(payload[0], Path.dirname(payload[1].path));
  }),

  updateSetting: ipcMain.on("UPDATE_SETTING", (event, payload) => {
    settingsManager.updateSetting(payload[0], payload[1]);
  }),

  getSettings: ipcMain.on("GET_SETTINGS", (event, payload) => {
    let responseObject = {}
    payload.forEach(element => {
      responseObject[element] = settingsManager.getSetting(element);
    });
    event.reply("GET_SETTINGS", responseObject);
  }),

  downloadSwf: ipcMain.on("DOWNLOAD_EXTRACT_SWF", (event, data) => {
    swfHandler.downloadSwf(() => {
      event.reply("DOWNLOAD_EXTRACT_SWF", {"Downloaded progress":"Complete"})
      ptyHandler.useSwfextract( reply => {
        event.reply("DOWNLOAD_EXTRACT_SWF", reply);
      })
    });
  }),

  getTiles: ipcMain.on("GET_TILES", (event, payload) => {
    tileHandler.getTileLibrary().forEach(tile => {
      event.reply("GET_TILES", tile);
    });
  }),

  createLevel: ipcMain.on("CREATE_LEVEL", (event, payload) => {
    console.log(payload)
    const levelData = projectHandler.createLevel(payload[2], payload[3])
    console.log(projectHandler.returnProjectsList())
    const levelNumber = projectHandler.returnProjectsList()[payload[1]][1] + 1
    xmlHandler.saveLevelData(levelData, payload[0], levelNumber)
  }),

  insertTile: ipcMain.on("INSERT_TILE", (event, payload) => {
    projectHandler.getActiveLevel().insertTile(payload[0], payload[1], payload[2], payload[3])
  }),

  addLayer: ipcMain.on("ADD_LAYER", (event, payload) => {
    projectHandler.getActiveLevel().addLayer()
  }),

  saveLevel: ipcMain.on("SAVE_LEVEL", (event, payload) => {
    xmlHandler.saveLevelData(projectHandler.getActiveLevel(), payload[0], payload[1])
  }),

  changeBackground: ipcMain.on("CHANGE_BACKGROUND", (event, payload) => {
    projectHandler.getActiveLevel().toggleInsideOutside(payload)
  }),

  getBackGroundImageData: ipcMain.on("GET_BACKGROUND_IMAGE_DATA", (event, payload) => {
    event.reply("GET_BACKGROUND_IMAGE_DATA", miscAssetHandler.returnBackgroundImages())
  }),

  getIsOutside: ipcMain.on("GET_IS_OUTSIDE", (event, payload) => {
    console.log(projectHandler.getActiveLevel().outside)
    event.reply("GET_IS_OUTSIDE", projectHandler.getActiveLevel().outside)
  }),

  openLevelData: ipcMain.on("OPEN_LEVEL_DATA", (event, payload) => {
    const path = payload
    projectHandler.importLevelData(xmlHandler.openLevelData(path))
    event.reply("OPEN_LEVEL_DATA", projectHandler.getActiveLevel().getLevelLayers())
  }),

  getProjects: ipcMain.on("GET_PROJECTS", (event, payload) => {
    const projectsList = projectHandler.returnProjectsList()
    tileHandler.buildTileLibrary()
    event.reply("GET_PROJECTS", projectsList)
  }),

  newProjectFolder: ipcMain.on("NEW_PROJECT_FOLDER", (event, payload) => {
    projectHandler.createNewProject(payload)
  }),

  getLevelDimensions: ipcMain.on("GET_LEVEL_DIMENSIONS", (event, payload) => {
    const project = payload[0]
    const levelNum = payload[1]
    const workingDir = settingsManager.appdata + "/projects/working/" + project + "/" + settingsManager.xmlNamesMap[levelNum-1]
    console.log(workingDir)
    const rawObj = xmlHandler.openLevelData(workingDir)
    const meta = rawObj["root"]["level"]["_attributes"]
    console.log(meta)
    event.reply("GET_LEVEL_DIMENSIONS", [meta["width"], meta["height"], workingDir, project, levelNum])
  }),

  changeWidth: ipcMain.on("CHANGE_WIDTH", (event, payload) => {
    projectHandler.getActiveLevel().changeWidth(payload)
  }),

  changeHeight: ipcMain.on("CHANGE_HEIGHT", (event, payload) => {
    projectHandler.getActiveLevel().changeHeight(payload)
  }),

  getSignData: ipcMain.on("GET_SIGN_DATA", (event, payload) => {
    const n = payload[0]
    const layer = payload[1]
    const responseArr = [n, layer]

    projectHandler.getActiveLevel().getSignMessages().forEach(msg => {
      if(msg.layer == layer && msg.n == n) {
        responseArr.push(msg.text)
      }
    })
    if(responseArr.length < 3) {
      responseArr.push(null)
    }

    event.reply("GET_SIGN_DATA", responseArr)
  }),

  addSignData: ipcMain.on("ADD_SIGN_DATA", (event, payload) => {
    projectHandler.getActiveLevel().addSignMessage(payload[0], payload[1], payload[2])
  }),

  setStartLocation: ipcMain.on("SET_START_LOCATION", (event, payload) => {
    projectHandler.getActiveLevel().setStartPoint(payload[0], payload[1])
  }),

  getCharacterSprite: ipcMain.on("GET_CHARACTER_SPRITE", (event, payload) => {
    event.reply("GET_CHARACTER_SPRITE", new tileHandler.Tile(-1, "set-start-point", "308.png", ["310.png"]))
  }),

  getStartLocation: ipcMain.on("GET_START_LOCATION", (event, payload) => {
    event.reply("GET_START_LOCATION", projectHandler.getActiveLevel().getStartPoint())
  }),

  exportToFlashpoint: ipcMain.on("EXPORT_TO_FLASHPOINT", (event, payload) => {
    swfHandler.exportToFlashpoint(payload[0], payload[1], payload[2], payload[3])
  }),

  exportDvpack: ipcMain.on("EXPORT_DVPACK", async (event, payload) => {
    let savePath = await dialog.showSaveDialog(mainWindow, {
      title:"Save Level Pack", 
      defaultPath:payload[0], 
      filters:[
        {
          name:"DVLC Level Pack", 
          extensions:["dvpack"]
        }
      ]
    })
    .catch((e) => {
      console.log(e);
    })
    console.log(savePath)
    if(!savePath.canceled) {
      swfHandler.exportDvpack(payload[0], payload[1], payload[2], payload[3], savePath.filePath)
    }
  }),

  importDvpack: ipcMain.on("IMPORT_DVPACK", async (event, payload) => {
    let paths;
    if(payload.length > 0) {
      paths = payload
    } else {
      let result = await dialog.showOpenDialog(mainWindow, {
        properties: ["multiSelections"],
        title: "Open Level Pack",
        filters:[
          {
            name:"DVLC Level Pack", 
            extensions:["dvpack"]
          }
        ]
      })
      .catch((e) => {
        console.log(e);
      })
      paths = result.filePaths;
    }
    swfHandler.import(paths, () => {
      event.reply("IMPORT_DVPACK")
    })
  }),

  deleteProject: ipcMain.on("DELETE_PROJECT", (event, payload) => {
    swfHandler.deleteProject(payload, () => {
      event.reply("IMPORT_DVPACK") // all this does is refresh projects list
    })
  })
}