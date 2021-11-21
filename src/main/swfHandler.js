import { get } from 'http';
import fs from 'fs';
import settingsManager from './settingsManager';
import {v4 as uuid} from "uuid"
import yaml from "js-yaml"
import sudo from "sudo-prompt"

const location = settingsManager.appdata + "/projects/";

class YamlTemplate {
  constructor(title, creator, version) {
    this.data = {
      Title: title,
      "Alternate Titles": null,
      Library: "arcade",
      Series: null,
      Developer: creator,
      Publisher: "Dirk Valentine Level Creator (By Spatchy)",
      "Play Mode": "Single Player",
      "Release Date": null,
      Version: version,
      Languages: "en",
      Extreme: "No",
      Tags: "",
      "Tag Categories": "",
      Source: null,
      Platform: "Flash",
      Status: "Playable",
      "Application Path": "FPSoftware\\Flash\\flashplayer_32_sa.exe",
      "Launch Command": "http://cdn.nitrome.com/games/dirkvalentine/dirkvalentine.swf",
      "Game Notes": null,
      "Original Description": null,
      "Curation Notes": null,
      "Mount Parameters": null,
      "Additional Applications": {}
    }
  }
  asYaml() {
    return yaml.dump(this.data)
  }
}

export default {
  downloadSwf(callback) {
    if (!fs.existsSync(location)){
      fs.mkdirSync(location);
    }
    const file = fs.createWriteStream(location + "dirkvalentine.swf");
    get("http://www.nitrome.com/games/dirkvalentine/dirkvalentine.swf", (response) => {
      response.pipe(file);
    });
    file.on('finish', () => {
      callback();
    })
  },

  exportToFlashpoint(title, creator, version, projectName) {
    console.log("Exporting: " + [title, creator, version, projectName])
    const basepath = settingsManager.getSetting("flashpointPath")
    const projPath = basepath + "/curations/working/" + uuid()
    fs.mkdirSync(projPath)
    fs.writeFileSync(projPath + "/meta.yaml", new YamlTemplate(title, creator, version).asYaml())
    const gamepath = projPath + "/content/cdn.nitrome.com/games/dirkvalentine/"
    fs.mkdirSync(gamepath, {recursive: true})
    sudo.exec(`mklink "${gamepath + "dirkvalentine.swf"}" "${location + "dirkvalentine.swf"}"`, {}, (err, stdout, stderr) => {
      if(err) {
        throw err
      }
      sudo.exec(`mklink /D "${gamepath + "levels"}" "${location + "working/" + projectName}"`, {}, (err, stdout, stderr) => {
        if(err) {
          throw err
        }
        console.log("EXPORTED TO FLASHPOINT!")
      })
    })
  }
}