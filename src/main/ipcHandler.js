import { shell, ipcMain, dialog, mainWindow } from "electron"
import settingsManager from "./settingsManager";
import swfHandler from "./swfHandler";
import Path from "path";
import ptyHandler from "./ptyHandler";
import tileHandler from "./tileHandler";
import projectHandler from "./projectHandler";
import xmlHandler from "./xmlHandler";
import miscAssetHandler from "./miscAssetHandler";

export default {

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
    tileHandler.tileLibrary.forEach(tile => {
      event.reply("GET_TILES", tile);
    });
  }),

  createLevel: ipcMain.on("CREATE_LEVEL", (event, payload) => {
    projectHandler.createLevel(payload[0], payload[1])
  }),

  insertTile: ipcMain.on("INSERT_TILE", (event, payload) => {
    projectHandler.getActiveLevel().insertTile(payload[0], payload[1], payload[2], payload[3])
  }),

  addLayer: ipcMain.on("ADD_LAYER", (event, payload) => {
    projectHandler.getActiveLevel().addLayer()
  }),

  saveLevel: ipcMain.on("SAVE_LEVEL", (event, payload) => {
    xmlHandler.saveLevelData(projectHandler.getActiveLevel())
  }),

  getBackGroundImageData: ipcMain.on("GET_BACKGROUND_IMAGE_DATA", (event, payload) => {
    event.reply("GET_BACKGROUND_IMAGE_DATA", miscAssetHandler.returnBackgroundImages())
  }),

  openLevelData: ipcMain.on("OPEN_LEVEL_DATA", (event, payload) => {
    const path = payload
    projectHandler.importLevelData(xmlHandler.openLevelData(path))
    event.reply("OPEN_LEVEL_DATA", projectHandler.getActiveLevel().getLevelLayers())
  }),

  getProjects: ipcMain.on("GET_PROJECTS", (event, payload) => {
    const projectsList = projectHandler.returnProjectsList()
    event.reply("GET_PROJECTS", projectsList)
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

  test: ipcMain.on("TEST", (event, payload) => {
    console.log("test IPC triggered");
    ptyHandler.useSwfextract();
  })

}