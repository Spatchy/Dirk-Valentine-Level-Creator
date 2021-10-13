import { get } from 'http';
import fs from 'fs';
import { app } from "electron";

const location = app.getPath("userData") + "/projects/";

export default {
  downloadSwf() {
    if (!fs.existsSync(location)){
      fs.mkdirSync(location);
    }
    const file = fs.createWriteStream(location + "dirkvalentine.swf");
    get("http://cdn.nitrome.com/games/dirkvalentine/dirkvalentine.swf", (response) => {
      response.pipe(file);
    });
  }
}
