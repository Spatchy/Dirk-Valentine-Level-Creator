<template>
  <img :src="tile.tileImage" :title="tile.name" :style="cssProps" :class="{ selected: isSelected }" @click="select()">
</template>

<script>
export default {
  name: "tileDisplay",
  props: {
    tile: Object,
    selectedTile: Number
  },
  emits: [
    "selected"
  ],
  computed: {
    isSelected() {
      return this.selectedTile === this.tile.number
    },
    cssProps() {
      return {
        "--tile-width": `${64*this.tile.width}px`,
        "--tile-height": `${64*this.tile.height}px`,
      }
    }
  },
  methods: {
    select() {
      this.$emit('selected', this.tile.number)
    }
  }
}
</script>

<style scoped>
  img {
    width: var(--tile-width);
    height: var(--tile-height);
    padding: 2px;
  }
  .selected {
    background-color: blue;
  }
</style>