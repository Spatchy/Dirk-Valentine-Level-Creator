import { get } from 'http';
import { createWriteStream } from 'fs';
import { app } from "electron";

const location = app.getPath("userData") + "/projects/";

export default {
  downloadSwf() {
    const file = createWriteStream(location + "dirkvalentine.swf");
    get("http://cdn.nitrome.com/games/dirkvalentine/dirkvalentine.swf", (response) => {
      response.pipe(file);
    });
  }
}
