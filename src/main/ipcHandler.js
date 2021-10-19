import { shell, ipcMain, dialog, mainWindow } from "electron"
import settingsManager from "./settingsManager";
import swfHandler from "./swfHandler";
import Path from "path";
import ptyHandler from "./ptyHandler";

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

  test: ipcMain.on("TEST", (event, payload) => {
    console.log("test IPC triggered");
    ptyHandler.useSwfextract();
  })

}