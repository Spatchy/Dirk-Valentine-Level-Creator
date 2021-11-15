<template>
  <div>
    <div class="notification is-info">
      <div class="level is-mobile">
        <div class="level-left">
          <div class="level-item">
            <button @click="goBack()"><span class="icon"><i class="fas fa-arrow-left"></i></span></button>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="title is-3 is-spaced">{{ newProjectName }}</p>
            <p class="subtitle is-5">level {{ newLevelNum }}</p>
          </div>
        </div>
      </div>
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
          @saveLevel="saveLevel()"
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
  emits: [
    "goBack"
  ],
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
        window.ipc.send("OPEN_LEVEL_DATA", this.newDir);
      }
    });
  },
  methods: {
    changeSelectedTile(tileId) {
      this.selectedTile = tileId;
    },
    goBack() {
      this.$emit("goBack")
    },
    saveLevel() {
      window.ipc.send("SAVE_LEVEL", [this.newProjectName, this.newLevelNum])
    }
  },
};
</script>