const { contextBridge, ipcRenderer } = require('electron');

const validChannels = [
  "OPEN_EXTERNAL", 
  "UPDATE_FLASHPOINT_DIR", 
  "OPEN_FILE_DIALOG", 
  "UPDATE_SETTING", 
  "TEST", 
  "GET_SETTINGS",
  "DOWNLOAD_EXTRACT_SWF",
  "GET_TILES",
  "CREATE_LEVEL",
  "INSERT_TILE",
  "SAVE_LEVEL",
  "GET_BACKGROUND_IMAGE_DATA",
  "ADD_LAYER",
  "OPEN_LEVEL_DATA",
  "GET_PROJECTS",
  "GET_LEVEL_DIMENSIONS",
  "GET_SIGN_DATA",
  "ADD_SIGN_DATA",
  "NEW_PROJECT_FOLDER",
  "CHANGE_BACKGROUND",
  "GET_IS_OUTSIDE",
  "CHANGE_WIDTH",
  "CHANGE_HEIGHT",
  "SET_START_LOCATION",
  "GET_CHARACTER_SPRITE",
  "GET_START_LOCATION",
  "EXPORT_TO_FLASHPOINT",
  "EXPORT_DVPACK",
  "IMPORT_DVPACK",
  "DELETE_PROJECT",
];

contextBridge.exposeInMainWorld(
  'ipc', {
    send: (channel, data) => {
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      } else {
        console.log(`Channel ${channel} is not in valid channels list`)
      }
    },
    on: (channel, func) => {
      if (validChannels.includes(channel)) {
        // Strip event as it includes `sender` and is a security risk
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      } else {
        console.log(`Channel ${channel} is not in valid channels list`)
      }
    },
  }
);