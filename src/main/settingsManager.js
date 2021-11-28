const fs = require("fs")
const {app} = require("electron")

const appdata = app.getPath('userData');
const settingsFile = appdata + "/settings.json"

const defaults = {
  "flashpointPath":"",
  "swftoolsPath":""
}

let settingsCache = {};

const xmlNamesMap = [
  "2ec52fffab7985946f43dd3938c57a02.xml",
  "36b74bea4f481eb81019bb01735877f3.xml",
  "7e0e8a992469b796b6bf7d40eff79bbe.xml",
  "1a5612069e9e04d6eaa4866c24710f0c.xml",
  "6ddbcc79fb3217ad3f7ad1fed0b29a10.xml",
  "b58248086c5711b18dfd790533091ce2.xml",
  "74ea067f2b307854d00661b4732b9aee.xml",
  "a9284b0a9c0d30f6fc476e2669fa149c.xml",
  "2922111b08c38318c213b58511004907.xml",
  "aa081261f914167a69d59dab0783c226.xml",
  "6827eb728d2f0d656e619379aba37aa2.xml",
  "7e832d89f04369ea4618128c42387bb3.xml",
  "2b072f3fd77490b0e9b2f89fdd97d6eb.xml",
  "fd625fdd0a6b9e76c8073f67624a306e.xml",
  "52b51670e6549b58407855790a46bf36.xml",
  "a4346af9d6425e38ede8594c63ccfff6.xml",
  "3d87c01b75f7e7abe2e9aa73eaffd394.xml",
  "ef2cc71707e95cbab27524cc06f154d7.xml",
  "ce840bde73fc3df800a85fecab48310f.xml",
  "b7718320b4874ea7ae5fe500f7518725.xml",
  "20b51417c0d1a5e1c1f540179b826830.xml",
  "e4685c508590d554ad828f2bf7074dbc.xml",
  "c8de645bf5ddc83818ea6d2f33bb1b13.xml",
  "24173bd5e560c4e9a09ff638048fd7f2.xml",
]

module.exports = {

  appdata, xmlNamesMap,

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
