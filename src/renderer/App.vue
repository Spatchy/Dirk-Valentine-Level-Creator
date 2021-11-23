<template>
<div>
  <div v-if="isValidSettings === null">Checking settings</div>
  <Init v-else-if="!isValidSettings" @completeSetup="isValidSettings = true"/>
  <Project-menu v-else-if="isValidSettings && !projectLoaded" @openExisting="openExistingLevel($event)"/>
  <Builder v-else :newLevelHeight="newLevelHeight" :newLevelWidth="newLevelWidth" :newDir="newDir" :newProjectName="newProjectName" :newLevelNum="newLevelNum" @goBack="resetView()"/>
</div>
</template>

<script>
import Builder from './views/builder.vue';
import Init from './views/init.vue';
import ProjectMenu from './views/projectMenu.vue';

export default {
  name: 'App',
  components: {
    Init,
    Builder,
    ProjectMenu
  },
  data() {
    return {
      isValidSettings: null,
      projectLoaded: false,
      newLevelWidth: null,
      newLevelHeight: null,
      newDir: null,
      newProjectName: null,
      newLevelNum: null,
    }
  },
  mounted() {
    window.ipc.send("GET_SETTINGS", ["swftoolsPath", "flashpointPath"]);
    
    window.ipc.on("GET_SETTINGS", (response) => {
      let tempValid = true;
      Object.keys(response).forEach(element => { //Check everything in the response is not empty
        if(!response[element]){
          tempValid = false;
        }
      });
      this.isValidSettings = tempValid;
    })

    window.ipc.on("GET_LEVEL_DIMENSIONS", response => {
      this.newDir = response[2]
      this.newProjectName = response[3]
      this.newLevelNum = response[4]
      this.toggleLoadedProject([response[0], response[1]])
    })
  },
  methods: {
    toggleLoadedProject(dimensions) {
      if(dimensions) {
        this.newLevelWidth = parseInt(dimensions[0])
        this.newLevelHeight = parseInt(dimensions[1])
      }
      this.projectLoaded = !this.projectLoaded
    },

    openExistingLevel(details) {
      window.ipc.send("GET_LEVEL_DIMENSIONS", details)
    },

    resetView() {
      this.projectLoaded = false
      this.newLevelWidth = null
      this.newLevelHeight = null
      this.newDir = null
      this.newProjectName = null
      this.newLevelNum = null
    },
  }
}
</script>

<style>
@import "./assets/globals.scss";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>