<template>
<div>
  <div v-if="isValidSettings === null">Checking settings</div>
  <Init v-else-if="!isValidSettings" />
  <Builder v-else />
</div>
</template>

<script>
import Builder from './views/builder.vue';
import Init from './views/init.vue';

export default {
  name: 'App',
  components: {
    Init,
    Builder
  },
  data() {
    return {
      isValidSettings: null
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
