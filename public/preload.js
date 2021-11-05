const { contextBridge, ipcRenderer } = require('electron');
const mergeImages = require('merge-images-v2');

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
];

contextBridge.exposeInMainWorld(
  'ipc', {
    send: (channel, data) => {
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    on: (channel, func) => {
      if (validChannels.includes(channel)) {
        // Strip event as it includes `sender` and is a security risk
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
  }
);

contextBridge.exposeInMainWorld(
  'mergeImages', {
    merge: (arr, callback) => {
      mergeImages(arr).then(b64 => callback(b64));
    }
  }
)