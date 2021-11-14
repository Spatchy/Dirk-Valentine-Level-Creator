<template>
  <div>
    <div class="box">
      <div>{{ tileset.length }}</div>
      <img :src="mergeTest" alt="" />
      <h1>{{ newProjectName }}</h1>
      <h6>level {{ newLevelNum }}</h6>
    </div>
    <div class="columns">
      <div class="column is-one-third">
        <tile-menu
          :tileSet="tileset"
          :selectedTile="selectedTile"
          @selectTile="changeSelectedTile($event)"
        >
        </tile-menu>
      </div>
      <div class="column">
        <level-canvas
          :tilesWidth="newLevelWidth"
          :tilesHeight="newLevelHeight"
          :selectedTile="selectedTile"
          :tileSet="tileset"
        ></level-canvas>
      </div>
    </div>
  </div>
</template>

<script>
import tileMenu from "../components/tileMenu.vue";
import levelCanvas from "../components/levelCanvas.vue";

export default {
  name: "builder",
  data() {
    return {
      tileset: [],
      mergeTest: null,
      selectedTile: 0,
      selectedLayer: 0,
    };
  },
  props: {
    newLevelWidth: Number,
    newLevelHeight: Number,
    newDir: String,
    newProjectName: String,
    newLevelNum: Number,
  },
  components: {
    tileMenu,
    levelCanvas,
  },
  mounted() {
    window.ipc.send("GET_TILES", "");
    console.log(this.newLevelWidth);
    console.log(this.newLevelHeight);

    window.ipc.on("GET_TILES", (response) => {
      this.tileset.push(response);
      if (this.tileset.length === 353) {
        window.mergeImages.merge(
          [this.tileset[19].tileImage, this.tileset[40].tileImage],
          (b64) => {
            this.mergeTest = b64;
          }
        );
        window.ipc.send("OPEN_LEVEL_DATA", this.newDir);
      }
    });
  },
  methods: {
    changeSelectedTile(tileId) {
      this.selectedTile = tileId;
    },
  },
};
</script>
