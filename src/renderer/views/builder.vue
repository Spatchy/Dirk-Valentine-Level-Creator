<template>
  <div>
    <div class="hero is-link is-small">
      <div class="hero-body">
        <div class="level is-mobile m-4">
          <div class="level-left">
            <div class="level-item">
              <button @click="goBack()" class="button is-link is-large"><span class="icon is-large"><i class="fas fa-arrow-left"></i></span></button>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <p class="title is-3 is-spaced">{{ newProjectName }}</p>
                <p class="subtitle is-5">level {{ newLevelNum }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-5 m-1" style="z-index: -2">
      <div class="columns my-3 mx-1">
        <div class="column is-one-third">
          <tile-menu
            :tileSet="tileset"
            :selectedTile="selectedTile"
            :characterSpriteTile="characterSpriteTile"
            @selectTile="changeSelectedTile($event)"
          >
          </tile-menu>
        </div>
        <div class="column">
          <level-canvas
            :initialWidth="newLevelWidth"
            :initialHeight="newLevelHeight"
            :selectedTile="selectedTile"
            :tileSet="tileset"
            :characterSpriteTile="characterSpriteTile"
            @saveLevel="saveLevel()"
          ></level-canvas>
        </div>
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
      characterSpriteTile: null
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
    window.ipc.send("GET_TILES", "")
    window.ipc.send("GET_CHARACTER_SPRITE")

    window.ipc.on("GET_TILES", (response) => {
      this.tileset.push(response);
      if (this.tileset.length === 353) {
        window.ipc.send("OPEN_LEVEL_DATA", this.newDir);
      }
    });

    window.ipc.on("GET_CHARACTER_SPRITE", response => {
      this.characterSpriteTile = response
      console.log(this.characterSpriteTile)
    })
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