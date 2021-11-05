<template>
  <input type="text" v-model="newLevelWidth" placeholder="width">
  <input type="text" v-model="newLevelHeight" placeholder="height">
  <button @click="newProject()">Create Project</button>
</template>

<script>
export default {
  name: "projectMenu",
  data() {
    return {
      newLevelWidth: null,
      newLevelHeight: null,
    }
  },
  emits: [
    "createNew",
  ],
  methods: {
    newProject() {
      window.ipc.send("CREATE_LEVEL", [this.newLevelWidth, this.newLevelHeight])
      this.$emit("createNew", [this.newLevelWidth, this.newLevelHeight])
    }
  }
}
</script>