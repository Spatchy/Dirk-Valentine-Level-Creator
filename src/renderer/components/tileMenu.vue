<template>
  <div class="tile-menu">
    Tools
    <div id="menu-tools"></div>
    Basic Tiles
    <div id="menu-basic"></div>
    Multi-Tiles (mostly decorative)
    <div id="menu-multi"></div>
    Decoration
    <div id="menu-decoration"></div>
    Moving Platforms
    <div id="menu-moving"></div>
    Teleporters
    <div id="menu-teleporters"></div>
    Hazards
    <div id="menu-hazards"></div>
    Enemies
    <div id="menu-enemies"></div>
    Other
    <div id="menu-other"></div>
    <div id="menu-undefined" v-show="false"></div> <!--unused tiles will be teleported here implicitly-->
    <teleport v-for="tile in tileSet" :key="tile.number" :to="returnGroupId(tile.number)">
      <tile-display :tile="tile" :selectedTile="selectedTile" @selected="selectTile($event)" v-if="tile.name != 'UNUSED'"></tile-display>
    </teleport>
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
      basic: [...s.range(2, 29), ...s.range(45, 59), 61, ...s.range(73, 78), ...s.range(345, 352)],
      multi: [...s.range(30, 33), 62],
      decoration: [...s.range(34, 44), ...s.range(63, 68), ...s.range(275, 316)],
      moving: [...s.range(89, 124), ...s.range(245, 248)],
      teleporters: [...s.range(125, 244)],
      hazards: [...s.range(249, 268)],
      enemies: [...s.range(269, 273), ...s.range(317, 323), ...s.range(325, 329), ...s.range(335, 343)],
      other: [324, ...s.range(330, 332), 334, 344],
      // everything else is unused, own arr not needed
      tilesLoaded: 0,
      lookupTable: {}
    }
  },
  created() {
    const arrsToCheck = {
      tools: this.tools,
      basic: this.basic,
      multi: this.multi,
      decoration: this.decoration,
      moving: this.moving, 
      hazards: this.hazards, 
      enemies: this.enemies,
      other: this.other
    }
    Object.keys(arrsToCheck).forEach(arrName => {
      arrsToCheck[arrName].forEach(tile => {
        this.lookupTable[tile] = arrName
      })
    })
  },
  methods: {
    selectTile(tileId) {
      this.$emit("selectTile", tileId)
    },

    returnGroupId(index) {
      return `#menu-${this.lookupTable[index]}`
      /* if(this.tools.includes(index)) {
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
      } */
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