<template>
  <div>
    <div class="hero is-link">
      <div class="hero-body">
        <p class="title">Set up DVLC</p>
        <p class="subtitle">DVLC needs to know where the following programs are installed</p>
      </div>
    </div>

    <div class="section">
      <p class="title is-4">
        Flashpoint Core
      </p>
      <p class="subtitle is-5">Needed to load and play levels</p>
      <p>You can download Flashpoint Core from <a href="#" @click="openInBrowser(`https://bluemaxima.org/flashpoint/downloads/`)"> bluemaxima.org </a></p>
      <p>Your Flashpoint path is: <span v-if="flashpointPath">{{flashpointPath}}</span><span v-if="!flashpointPath" class="has-text-danger">not set</span></p>
      <button @click="getDirectoryPath('flashpointPath')" class="button is-link">Select Flashpoint Folder</button>
    </div>

    <div class="section">
      <p class="title is-4">
        SWFTools
      </p>
      <p class="subtitle is-5">Needed to extract assets from the Dirk Valentine flash file</p>
      <p>You can download the SWFTools from <a href="#" @click="openInBrowser(`http://www.swftools.org/swftools-0.9.0.exe`)">swftools.org</a></p>
      <p>Your SWFTools path is: <span v-if="swftoolsPath">{{swftoolsPath}}</span><span v-if="!swftoolsPath" class="has-text-danger">not set</span></p>
      <button @click="getDirectoryPath('swftoolsPath')" class="button is-link">Select SWFtools Folder</button>
    </div>
    <div class="section">
      <p>To complete setup, the SWF will be downloaded and extracted</p>
      <button @click="getSwf()" class="button is-success" :class="{'is-loading':isLoading}" :disabled="!(swftoolsPath && flashpointPath)">Complete Setup</button>
      <p v-if="isLoading">{{msg}}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      settingToChange:"",
      flashpointPath: null,
      swftoolsPath: null,
      isLoading: false,
      msg: "Downloading..."
    }
  },
  emits: [
    "completeSetup"
  ],
  mounted() {
    window.ipc.on("OPEN_FILE_DIALOG", (response) => {
      if(this.settingToChange == "flashpointPath") {
        this.flashpointPath = response
      } else if (this.settingToChange == "swftoolsPath") {
        this.swftoolsPath = response
      }
      window.ipc.send("UPDATE_SETTING", [this.settingToChange, response]);
    })
  },

  methods: {
    openInBrowser(uri) {
      window.ipc.send("OPEN_EXTERNAL", uri);
    },

    getDirectoryPath(dirToGet) {
      if(dirToGet){
        this.settingToChange = dirToGet;
      }
      window.ipc.send("OPEN_FILE_DIALOG", {properties: ['openDirectory']});
    },

    getSwf() {
      window.ipc.send("DOWNLOAD_EXTRACT_SWF", "");
      this.isLoading = true
      setTimeout(() => {
        this.msg = "Extracting..."
      }, 2500)
      setTimeout(() => { // allow time for extraction to occur
        this.$emit("completeSetup")
      }, 11000)
    }
  }
}
</script>