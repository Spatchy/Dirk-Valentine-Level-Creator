import fs from "fs";
import {app} from "electron";

const appdata = app.getPath('userData');
const settingsFile = appdata + "/settings.json"

const defaults = {
  "flashpointPath":"",
}

let settingsCache = {};

export default {

  // returns settings from the file or the defaults if file doesn't exist
  getSettings() {
    let settings;
    if (settingsCache != {}) {
      return settingsCache
    }
    else if (fs.existsSync(settingsFile)) {
      settings = fs.readFileSync(settingsFile);
    }
    else {
      settings = defaults;
    }
    return settings;
  },
  
  updateSetting(setting, option) {
    let activeSettings = getSettings();
    activeSettings[setting] = option;
    settingsCache = activeSettings;
    fs.writeFileSync(settingsFile, JSON.stringify(activeSettings));
  },

  getSetting(settingToGet) {
    return settingsCache[settingToGet];
  }
  
}
