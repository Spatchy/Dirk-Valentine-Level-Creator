<template>
  <div>
    <label for="backgroundSelect">Background Style: </label>
    <select :value="initialIsOutside" ref="backgroundSelect" @change="changeBackground($event)" id="backgroundSelect">
      <option v-for="n in backgroundOptions" :key="n.value" :value="n.value">{{n.name}}</option>
    </select>
    <label for="layerSelect">Select Layer</label>
    <select :value="0" id="LayerSelect" @change="changeLayerSelection($event)">
      <option v-for="(n, i) in numberOfLayers" :key="i" :value="i">{{`Layer ${n}`}}</option>
    </select>
    <button @click="addLayer()" class="button is-small">+ New Layer</button>
    Width: <input type="number" @change="changeWidth()" v-model="tilesWidth" max="99" class="size-input"/>
    Height: <input type="number" @change="changeHeight()" v-model="tilesHeight" max="99" class="size-input"/>
    <button @click="saveLevel()" class="button is-small">save level</button>
  </div>
</template>

<script>
export default {
  props: {
    initialIsOutside: Boolean,
    initialNumberOfLayers: Number,
    initialWidth: Number,
    initialHeight: Number,
  },
  emits: [
    "changeBackground",
    "changeLayerSelection",
    "addLayer",
    "saveLevel",
    "changeHeight",
    "changeWidth",
  ],
  data() {
    return {
      backgroundOptions: [
        {value: true, name: "Outside"},
        {value: false, name: "Inside"},
      ],
      numberOfLayers: null,
      tilesWidth: this.initialWidth,
      tilesHeight: this.initialHeight,
    }
  },
  mounted() {
    this.numberOfLayers = this.initialNumberOfLayers
    console.log(this.initialWidth)
    console.log(this.initialHeight)
  },
  methods: {
    changeBackground(event) {
      this.$emit("changeBackground", event.target.value)
    },

    changeLayerSelection(event) {
      this.$emit("changeLayerSelection", event.target.value)
    },

    addLayer() {
      this.$emit("addLayer")
      this.numberOfLayers++
    },

    changeWidth() {
      this.$emit("changeWidth", this.tilesWidth)
    },

    changeHeight() {
      this.$emit("changeHeight", this.tilesHeight)
    },

    saveLevel() {
      this.$emit("saveLevel")
    }
  },
}
</script>

<style lang="scss" scoped>
  .size-input {
    width: 3em;
    height: 2em;
  }
</style>