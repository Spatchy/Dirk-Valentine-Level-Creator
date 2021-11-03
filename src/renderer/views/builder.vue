<template>
  <div>
    <div>{{tileset.length}}</div>
    <img :src="mergeTest" alt="">
    <tile-menu :tileSet="tileset" :selectedTile="selectedTile" @selectTile="changeSelectedTile($event)"> </tile-menu>
  </div>
</template>

<script>
import tileMenu from "../components/tileMenu.vue"

export default {
  name: "builder",
  data() {
    return {
      tileset: [],
      mergeTest: null,
      selectedTile: 0,
    }
  },
  components: {
    tileMenu
  },
  mounted() {
    window.ipc.send("GET_TILES", "");

    window.ipc.on("GET_TILES", response => {
      this.tileset.push(response);
      if(this.tileset.length == 52){
        console.log(this.tileset);
        window.mergeImages.merge([this.tileset[19].tileImage, this.tileset[40].tileImage], (b64) => {
          this.mergeTest = b64;
        });
      }
    })
  },
  methods: {
    changeSelectedTile(tileId) {
      this.selectedTile = tileId
    }
  }
}
</script>
