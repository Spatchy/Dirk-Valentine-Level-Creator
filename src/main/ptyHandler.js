const pty = require("node-pty");
import os from "os";

const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

const ptyProcess = pty.spawn(shell, [], {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  cwd: process.env.HOME,
  env: process.env
});

let location = "./";

export default {
  setPtyLocation(dir) {
    ptyProcess.write("cd " + dir + "\r");
    ptyProcess.onData((data) => {
      console.log("Data: " + data);
      if(data.toLowerCase.some("no such file or directory","it does not exist")) {
        throw new Error("The file or directory does not exist")
      }
      else {
        location = dir;
      }
    });
  },

  

}



