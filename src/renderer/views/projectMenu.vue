<template>
  <div class="columns is-centered">
    <div class="column is-half full-height">
      <div class="column-scrollable">
        <div v-for="n in projectsList" :key="n[0]" :id="n[0]" :ref="`projectItem${n[0]}`" @click="toggleExpandProject($event, n[0])" class="notification">
          <h4 class="is-size-4">{{n[0]}}</h4>

          <div v-if="expand == n[0]">
            <p v-for="i in n[1]" :key="`${n[0]}:${i}`" @click="openLevel(n[0], i)">{{`Level ${i}`}}</p>
            <button @click="newLevel(n[0])" class="button is-small">+ Add level</button>
          </div>

        </div>
      </div>
      <input type="text" v-model="newLevelWidth" placeholder="width">
      <input type="text" v-model="newLevelHeight" placeholder="height">
    </div>
  </div>
</template>

<script>
export default {
  name: "projectMenu",
  data() {
    return {
      newLevelWidth: null,
      newLevelHeight: null,
      projectsList: null,
      expand: null,
    }
  },
  mounted() {
    window.ipc.send("GET_PROJECTS", "")

    window.ipc.on("GET_PROJECTS", response => {
      this.projectsList = response
    })
  },
  emits: [
    "createNew",
    "openExisting"
  ],
  methods: {
    newLevel(project) {
      window.ipc.send("CREATE_LEVEL", [project, this.newLevelWidth, this.newLevelHeight])
      this.$emit("createNew", [project, this.newLevelWidth, this.newLevelHeight])
    },

    openProject(event, projectName) {
      window.ipc.send("OPEN_PROJECT", projectName)
    },

    openLevel(project, levelNum) {
      console.log("got 1")
      this.$emit("openExisting", [project, levelNum])
    },

    toggleExpandProject(event, project) {
      if(this.expand === project) {
        this.expand = null
      } else {
        this.expand = project
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .column-scollable {
    height: 400px;
    overflow: auto;
  }
</style>