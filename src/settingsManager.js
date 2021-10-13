import fs from "fs";
import {app} from "electron";

const settingsFile = app.getPath('userData') + "/settings.json"

const defaults = {
  "flashpointPath":"",
}

let settingsCache = {};

// returns settings from the file or the defaults if file doesn't exist
function getSettings() {
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
}

function updateSetting(setting, option) {
  let activeSettings = getSettings();
  activeSettings[setting] = option;
  settingsCache = activeSettings;
  fs.writeFileSync(settingsFile, JSON.stringify(activeSettings));
  console.log(setting + " updated to " + option);
}

export {getSettings, updateSetting}

