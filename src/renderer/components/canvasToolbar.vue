<template>
  <div>
    <label for="backgroundSelect">Background Style: </label>
    <select :value="initialisedIsOutside" @change="changeBackground($event)" id="backgroundSelect">
      <option v-for="n in backgroundOptions" :key="n.value" :value="n.value">{{n.name}}</option>
    </select>
    <label for="layerSelect">Select Layer</label>
    <select :value="0" id="LayerSelect" @change="changeLayerSelection($event)">
      <option v-for="(n, i) in numberOfLayers" :key="i" :value="i">{{`Layer ${n}`}}</option>
    </select>
    <button @click="addLayer()">+ New Layer</button>
    <button @click="saveLevel()">save level</button>
  </div>
</template>

<script>
export default {
  props: {
    initialisedIsOutside: Boolean,
    initialNumberOfLayers: Number,
  },
  emits: [
    "changeBackground",
    "changeLayerSelection",
    "addLayer",
  ],
  data() {
    return {
      backgroundOptions: [
        {value: true, name: "Outside"},
        {value: false, name: "Inside"},
      ],
      numberOfLayers: null
    }
  },
  mounted() {
    this.numberOfLayers = this.initialNumberOfLayers
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
    saveLevel() {
      window.ipc.send("SAVE_LEVEL", "")
    }
  }
}
</script>