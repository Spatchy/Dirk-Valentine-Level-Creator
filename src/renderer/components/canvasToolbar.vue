<template>
  <div>
    <label for="backgroundSelect">Background Style: </label>
    <select :value="initialisedIsOutside" @change="changeBackground($event)" id="backgroundSelect">
      <option v-for="n in backgroundOptions" :key="n.value" :value="n.value">{{n.name}}</option>
    </select>
  </div>
</template>

<script>
export default {
  props: {
    initialisedIsOutside: Boolean,
  },
  emits: [
    "changeBackground",
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
    }
  }
}
</script>