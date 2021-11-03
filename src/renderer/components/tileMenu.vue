<template>
  <div class="tile-menu">
    <tile-display v-for="tile in tileSet" :key="tile.number" :tile="tile" :selectedTile="selectedTile" @selected="selectTile($event)"></tile-display>
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
    "tile-display": tileDisplay
  },
  methods: {
    selectTile(tileId) {
      this.$emit("selectTile", tileId)
    }
  }
}
</script>

<style scoped>
  .tile-menu {
    width: 33%;
  }
</style>