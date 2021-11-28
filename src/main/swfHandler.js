const { get } = require('http')
const fs = require('fs')
const settingsManager = require('./settingsManager')
const {v4 : uuid} = require("uuid")
const yaml = require("js-yaml")
const sudo = require("sudo-prompt")
const JSZip = require('jszip')

const location = settingsManager.appdata + "/projects/"

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

module.exports = {
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
  },

  exportDvpack(title, creator, version, projectName, savePath) {
    const manifestData = {
      dvpackVersion: 1,
      title: title,
      creator: creator,
      version: version
    }

    const dvpack = new JSZip()
    dvpack.file("manifest.json", JSON.stringify(manifestData))
    const levels = dvpack.folder("levels")
    fs.readdirSync(location + "working/" + projectName, {withFileTypes:true}).forEach(file => {
      levels.file(file.name, fs.readFileSync(location + "working/" + projectName + "/" + file.name))
    });

    const exportData = dvpack.generateAsync({type:"nodebuffer"})
    exportData.then(content => {
      if(!fs.existsSync(location + "exports/")) {
        fs.mkdirSync(location + "exports/")
      }
      fs.writeFileSync(savePath, content)
    })
    exportData.catch(e => {
      throw e
    })
  },

  import(paths, callback) {
    paths.forEach(path => {
      JSZip.loadAsync(fs.readFileSync(path)).then(dvpack => {
        const manifest = dvpack.files["manifest.json"].async("text").then((data) => {
          const manifestData = JSON.parse(data)
          const projectDir = location + "working/" + manifestData["title"]
          if(!fs.existsSync()) {
            fs.mkdirSync(projectDir)
            Object.keys(dvpack.files).forEach(entry => {
              if(entry.endsWith(".xml")) {
                dvpack.files[entry].async("nodebuffer").then(content => {
                  fs.writeFileSync(projectDir + "/" + entry.replace("levels/", ""), content)
                  callback()
                })
              }
            })
          } else {
            //should probably send an error message or something
          }
        })
      })
    })
  },

  deleteProject(project, callback) {
    fs.rmSync(location + "working/" + project, {recursive: true})
    callback()
  }
}