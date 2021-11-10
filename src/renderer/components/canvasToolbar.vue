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
  </div>
</template>

<script>
export default {
  props: {
    initialisedIsOutside: Boolean,
    numberOfLayers: Number,
  },
  emits: [
    "changeBackground",
    "changeLayerSelection"
  ],
  data() {
    return {
      backgroundOptions: [
        {value: true, name: "Outside"},
        {value: false, name: "Inside"},
      ],
    }
  },
  methods: {
    changeBackground(event) {
      this.$emit("changeBackground", event.target.value)
    },
    
    changeLayerSelection(event) {
      this.$emit("changeLayerSelection", event.target.value)
    }
  }
}
</script>