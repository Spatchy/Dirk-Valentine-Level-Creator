<template>
  <div class="hero is-link">
    <div class="level m-2">
      <div class="level-left">
        <div class="level-item">
          <label for="backgroundSelect"><span class="icon"><i class="fas fa-image"></i></span></label>
          <div class="dropdown" :class="{ 'is-active': isOutsideDropdownActive }" @click="isOutsideDropdownActive = !isOutsideDropdownActive">
            <div class="dropdown-trigger">
              <button class="button is-small mx-1" aria-haspopup="true" aria-controls="dropdown-menu">
                <span>{{isOutsideDropdownText}}</span>
                <span class="icon is-small">
                  <i class="fas fa-angle-down" aria-hidden="true"></i>
                </span>
              </button>
            </div>
            <div class="dropdown-menu" role="menu" style="z-index: 999999">
              <div class="dropdown-content">
                <a class="dropdown-item" @click="changeBackground(true)">
                  Outside
                </a>
                <a class="dropdown-item" @click="changeBackground(false)">
                  Inside
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="level-item">
          <label for="layerSelect"><span class="icon"><i class="fas fa-layer-group"></i></span></label>
          <div class="dropdown" :class="{ 'is-active': layerSelectDropdownActive }" @click="layerSelectDropdownActive = !layerSelectDropdownActive">
            <div class="dropdown-trigger">
              <button class="button is-small mx-1" aria-haspopup="true" aria-controls="dropdown-menu">
                <span>{{layerSelectDropdownText}}</span>
                <span class="icon">
                  <i class="fas fa-angle-down" aria-hidden="true"></i>
                </span>
              </button>
            </div>
            <div class="dropdown-menu" role="menu" style="z-index: 999999">
              <div class="dropdown-content">
                <a v-for="(n, i) in numberOfLayers" :key="i" class="dropdown-item" @click="changeLayerSelection(i, n)">
                  {{`Layer ${n}`}}
                </a>
              </div>
            </div>
          </div>
          <button @click="addLayer()" class="button is-small mx-1">
            <span class="icon">
              <i class="fas fa-plus"></i>
            </span> 
            <span>New Layer</span>
          </button>
        </div>
        <div class="level-item">
          <span class="icon"><i class="fas fa-arrows-alt-h"></i></span><input type="number" @change="changeWidth()" v-model="tilesWidth" max="99" class="size-input input is-small"/>
          <span class="icon"><i class="fas fa-arrows-alt-v"></i></span><input type="number" @change="changeHeight()" v-model="tilesHeight" max="99" class="size-input input is-small"/>
        </div>
        <div class="level-item">
          <button @click="saveLevel()" class="button is-small is-success"><span class="icon is-small"><i class="fas fa-save"></i></span><span>save level</span></button>
        </div>
      </div>
    </div>
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
      backgroundMap: {
        true: "Outside",
        false: "Inside"
      },
      numberOfLayers: null,
      tilesWidth: this.initialWidth,
      tilesHeight: this.initialHeight,
      isOutsideDropdownText: null,
      isOutsideDropdownActive: false,
      layerSelectDropdownText: "Layer 1",
      layerSelectDropdownActive: false,
    }
  },
  mounted() {
    this.numberOfLayers = this.initialNumberOfLayers
    console.log(this.initialWidth)
    console.log(this.initialHeight)
    this.isOutsideDropdownText = this.backgroundMap[this.initialIsOutside]
  },
  methods: {
    changeBackground(value) {
      this.isOutsideDropdownText = this.backgroundMap[value]
      this.$emit("changeBackground", value)
    },

    changeLayerSelection(value, name) {
      this.layerSelectDropdownText = "Layer " + name
      this.$emit("changeLayerSelection", value)
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
    width: 4em;
  }
</style>