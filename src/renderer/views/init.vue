<template>
  <div>
    To start, please select your Flashpoint Core folder. You can download Flashpoint Core from <a href="_blank" @click="openInBrowser(`https://bluemaxima.org/flashpoint/downloads/`)"> the official site </a>
    <button @click="getDirectoryPath('flashpointPath')">Select Flashpoint Folder</button>
    <div v-if="flashpointPath">{{flashpointPath}}</div>
    <button @click="getDirectoryPath('swftoolsPath')">Select SWFtools Folder</button>
    <div v-if="swftoolsPath">{{swftoolsPath}}</div>
    <button @click="testCommand">Test command</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      settingToChange:"",
      flashpointPath: null,  //for future user feedback use
      swftoolsPath: null, //for future user feedback use
    }
  },
  mounted() {
    window.ipc.on("OPEN_FILE_DIALOG", (response) => {
      alert(response);
      window.ipc.send("UPDATE_SETTING", [this.settingToChange, response]);
    })
  },

  methods: {
    openInBrowser(uri) {
      window.ipc.send("OPEN_EXTERNAL", uri);
      alert(uri);
    },

    getDirectoryPath(dirToGet) {
      if(dirToGet){
        this.settingToChange = dirToGet;
      }
      window.ipc.send("OPEN_FILE_DIALOG", {properties: ['openDirectory']});
    },

    testCommand() {
      window.ipc.send("TEST", "test");
    }
  }
}
</script>