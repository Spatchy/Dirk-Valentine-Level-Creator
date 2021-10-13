import { shell, ipcMain, dialog, mainWindow } from "electron"
import settingsManager from "./settingsManager";
//import ptyHandler from "./ptyHandler";
import swfHandler from "./swfHandler";
import Path from "path";

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

  test: ipcMain.on("TEST", (event, payload) => {
    swfHandler.downloadSwf();
  })

}