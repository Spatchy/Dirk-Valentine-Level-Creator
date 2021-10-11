<template>
  <div>
    To start, please select your Flashpoint Core folder. You can download Flashpoint Core from <a href="_blank" @click="openInBrowser(`https://bluemaxima.org/flashpoint/downloads/`)"> the official site </a>
    <input type="file" webkitdirectory directory multiple ref="flashpoint" @change="getDirectoryName"/>
  </div>
</template>

<script>
import { shell } from "electron";
import Path from "path";
export default {
  methods: {
    openInBrowser(uri) {
      shell.openExternal(uri);
    },

    getDirectoryName() {
      const filePath = Path.dirname(this.$refs.flashpoint.files[0].path);
      alert(filePath);
    }
  }
}
</script>