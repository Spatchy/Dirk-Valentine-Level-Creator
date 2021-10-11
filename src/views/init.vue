<template>
  <div>
    To start, please select your Flashpoint Core folder. You can download Flashpoint Core from <a href="_blank" @click="openInBrowser(`https://bluemaxima.org/flashpoint/downloads/`)"> the official site </a>
    <input type="file" ref="flashpoint" @click="getDirectoryName"/>
  </div>
</template>

<script>
export default {
  mounted() {
    window.ipc.on("OPEN_FILE_DIALOG", (response) => {
      alert(response)
    })
  },

  methods: {
    openInBrowser(uri) {
      window.ipc.send("OPEN_EXTERNAL", uri);
      alert(uri);
    },

    getDirectoryName() {
      window.ipc.send("OPEN_FILE_DIALOG", {properties: ['openDirectory']});
    }
  }
}
</script>