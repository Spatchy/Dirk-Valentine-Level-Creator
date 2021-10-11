import { shell, ipcMain, dialog, mainWindow } from "electron"
import {updateSetting} from "./settingsManager";
import Path from "path";

export default {

  openExternal: ipcMain.on("OPEN_EXTERNAL", (event, payload) => {
    shell.openExternal(payload);
  }),

  openFileDialog: ipcMain.on("OPEN_FILE_DIALOG", async (event, payload) => {
    const result = await dialog.showOpenDialog(mainWindow, payload);
    event.reply("OPEN_FILE_DIALOG", result);
  }),

  updateflashpointDir: ipcMain.on("UPDATE_FLASHPOINT_DIR", (event, payload) => {
    console.log(Path.dirname(payload[1].path))
    updateSetting(payload[0], Path.dirname(payload[1].path));
  })

}