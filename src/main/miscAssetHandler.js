import settingsManager from "./settingsManager"
import fs from "fs"

const extractPath = settingsManager.appdata + "/projects/extract"
const emptyB64Image = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

function mkPath(file) {
  if(file === null) {
    return null;
  }
  return extractPath + "/" + file
}

function pathToBase64(path) {
  if(path === null) {
    return emptyB64Image;
  }
  return "data:image/png;base64, " + fs.readFileSync(path, {encoding: 'base64'})
}


function pathArrToBase64(pathArr) {
  const b64Arr = [];
  pathArr.forEach(path => {
    b64Arr.push(pathToBase64(mkPath(path)))
  });
  return b64Arr
}

export default {
  mkPath, pathToBase64, pathArrToBase64,

  returnBackgroundImages() {
    return pathArrToBase64(["1562.png", "258.png", "1604.png"])
  }
}