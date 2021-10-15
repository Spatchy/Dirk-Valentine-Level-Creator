import { get } from 'http';
import fs from 'fs';
import settingsManager from './settingsManager';

const location = settingsManager.appdata + "/projects/";

export default {
  downloadSwf() {
    if (!fs.existsSync(location)){
      fs.mkdirSync(location);
    }
    const file = fs.createWriteStream(location + "dirkvalentine.swf");
    get("http://www.nitrome.com/games/dirkvalentine/dirkvalentine.swf", (response) => {
      response.pipe(file);
    });
  }
}