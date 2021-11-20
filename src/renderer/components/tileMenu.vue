<template>
  <div class="tile-menu">
    Tools
    <div id="menu-tools"></div>
    Basic Tiles
    <div id="menu-basic-tiles"></div>
    Multi-Tiles (mostly decorative)
    <div id="menu-multi-tiles"></div>
    Decoration
    <div id="menu-decoration"></div>
    Moving Platforms
    <div id="menu-moving-platforms"></div>
    Teleporters
    <div id="menu-teleporters"></div>
    Hazards
    <div id="menu-hazards"></div>
    Enemies
    <div id="menu-enemies"></div>
    Other
    <div id="menu-other"></div>
    <teleport v-for="tile in tileSet" :key="tile.number" :to="returnGroupId(tile.number)">
      <tile-display :tile="tile" :selectedTile="selectedTile" @selected="selectTile($event)" v-show="tile.name != 'UNUSED'" @load="tilesLoaded++"></tile-display>
    </teleport>
  </div>
  <div v-if="tilesLoaded < 352" ref="signModal" class="modal is-active" style="z-index: 999999">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Loading Tiles</p>
          <button class="delete" aria-label="close" @click="getSignModalResult(false)"></button>
        </header>
        <section class="modal-card-body">
          <p>Loaded {{tilesLoaded}} tiles of 352</p>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import tileDisplay from './tileDisplay.vue'
export default {
  name: "tileMenu",
  props: {
    tileSet: Array,
    selectedTile: Number
  },
  components: {
    tileDisplay
  },
  emits: [
    "selectTile"
  ],
  data() {
    const s = this
    return {
      tools: [0, 1, 333],
      multi: [...s.range(30, 33), 62],
      decoration: [...s.range(34, 44), ...s.range(63, 68), ...s.range(275, 316)],
      moving: [...s.range(89, 124), ...s.range(245, 248)],
      teleporters: [...s.range(125, 244)],
      hazards: [...s.range(249, 268)],
      enemies: [...s.range(269, 273), ...s.range(317, 323), ...s.range(325, 329), ...s.range(335, 343)],
      other: [324, ...s.range(330, 332), 334, 344],
      // Basic is everything else, own arr not needed
      tilesLoaded: 0
    }
  },
  methods: {
    selectTile(tileId) {
      this.$emit("selectTile", tileId)
    },

    returnGroupId(index) {
      if(this.tools.includes(index)) {
        return "#menu-tools"
      } else if (this.multi.includes(index)) {
        return "#menu-multi-tiles"
      } else if (this.decoration.includes(index)) {
        return "#menu-decoration"
      } else if (this.moving.includes(index)) {
        return "#menu-moving-platforms"
      } else if (this.teleporters.includes(index)) {
        return "#menu-teleporters"
      } else if (this.hazards.includes(index)) {
        return "#menu-hazards"
      } else if (this.enemies.includes(index)) {
        return "#menu-enemies"
      } else if (this.other.includes(index)) {
        return "#menu-other"
      } else {
        return "#menu-basic-tiles"
      }
    },
    
    range(bottom, top) {
      return Array.from(new Array((top-bottom)+1), (x, i) => i + bottom)
    }
  }
}
</script>

<style lang="scss" scoped>
  .tile-menu {
    height: 70vh;
    overflow-y: scroll;
  }
</style>