import fs from "fs";
import {app} from "electron";

const appdata = app.getPath('userData');
const settingsFile = appdata + "/settings.json"

const defaults = {
  "flashpointPath":"",
  "swftoolsPath":""
}

let settingsCache = {};

export default {

  appdata,

  // returns settings from the file or the defaults if file doesn't exist
  getSettings() {
    let settings;
    if (Object.keys(settingsCache).length > 0) {
      return settingsCache
    }
    else if (fs.existsSync(settingsFile)) {
      settings = JSON.parse(fs.readFileSync(settingsFile));
    }
    else {
      settings = defaults;
    }
    return settings;
  },
  
  updateSetting(setting, option) {
    let activeSettings = this.getSettings();
    activeSettings[setting] = option;
    settingsCache = activeSettings;
    fs.writeFileSync(settingsFile, JSON.stringify(activeSettings));
  },

  getSetting(settingToGet) {
    const settings = this.getSettings();
    console.log(settings);
    return settings[settingToGet];
  }
  
}
