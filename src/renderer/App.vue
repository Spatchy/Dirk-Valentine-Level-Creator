<template>
<div>
  <div v-if="isValidSettings === null">Checking settings</div>
  <Init v-else-if="!isValidSettings" />
  <Project-menu v-else-if="isValidSettings && !projectLoaded" @createNew="toggleLoadedProject($event)"/>
  <Builder v-else :newLevelHeight="newLevelHeight" :newLevelWidth="newLevelWidth"/>
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
  },
  methods: {
    toggleLoadedProject(dimensions) {
      if(dimensions) {
        this.newLevelWidth = parseInt(dimensions[0])
        this.newLevelHeight = parseInt(dimensions[1])
      }
      this.projectLoaded = !this.projectLoaded
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
