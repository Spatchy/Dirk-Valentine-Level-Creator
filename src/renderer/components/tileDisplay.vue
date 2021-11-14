<template>
  <img :src="mergedTileImage()" :title="tile.name" :style="cssProps" :class="{ selected: isSelected }" @click="select()">
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
  data() {
    return {
      combinedImage: null
    }
  },
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
    },

    mergedTileImage() {
      if(this.tile.additionalLayers.length === 0) {
        return this.tile.tileImage
      } else {
        const imagesArr = this.tile.additionalLayers.slice()
        imagesArr.unshift(this.tile.tileImage)
        if(this.tile.name.startsWith("teleporter")) {  // special case for teleporters showing being weird
          const base = imagesArr[0]
          imagesArr[0] = {src: base, x: 0, y: 0}
          const upper = imagesArr[1]
          imagesArr[1] = {src: upper, x: 20, y: 13}
        }
        window.mergeImages.merge(imagesArr, (b64) => {
          this.combinedImage = b64
        })
        return this.combinedImage
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  img {
    width: var(--tile-width);
    height: var(--tile-height);
    padding: 2px;
  }
  .selected {
    background-color: blue;
  }
</style>