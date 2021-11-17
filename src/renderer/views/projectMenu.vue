<template>
  <div class="columns is-centered">
    <div class="column is-half full-height">
      <div class="column-scrollable">
        <nav class="panel">
          <p class="panel-heading">Projects</p>
          <a v-for="n in projectsList" :key="n[0]" :id="n[0]" :ref="`projectItem${n[0]}`" @click="toggleExpandProject($event, n[0])" class="panel-block">
            <p v-if="!(expand == n[0])"><span class="panel-icon"><i class="fas fa-folder"></i></span>{{n[0]}}</p>
            <aside v-if="expand == n[0]" class="menu">
              <ul class="menu-list">
                <a><span class="panel-icon"><i class="fas fa-folder"></i></span><b>{{n[0]}}</b></a>
                <ul>
                  <li v-for="i in n[1]" :key="`${n[0]}:${i}`" @click="openLevel(n[0], i)"><a class="level-option">{{`Level ${i}`}}</a></li>
                  <li v-if="n[1] < 24"><button @click="newLevel(n[0])" class="button is-small">+ Add level</button></li>
                </ul>
              </ul>
            </aside>
          </a>
          <a class="panel-block">
            <button class="button is-fullwidth" @click="showNewProjectModal = true">New Project</button>
          </a>
        </nav>
      </div>
      <div v-if="showNewProjectModal" ref="newProjectModal" class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-content">
          <div class="modal-card">
            <header class="modal-card-head">
              <p class="modal-card-title">Create Project</p>
              <button class="delete" aria-label="close" @click="showNewProjectModal = false"></button>
            </header>
            <section class="modal-card-body">
              <p>Choose a name for the new project</p>
              <input type="text" class="modal-text-area" v-model="newProjectName" />
            </section>
            <footer class="modal-card-foot">
              <button class="button is-success" @click="newProject()" :disabled="disableNewProjectButton">Create</button>
              <button class="button" @click="showNewProjectModal = false">Cancel</button>
            </footer>
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
      showNewProjectModal: false,
      newProjectName: null,
      showNewLevelModal: false,
      newLevelName: null,
      disableNewProjectButton: false,
    }
  },
  mounted() {
    window.ipc.send("GET_PROJECTS", "")

    window.ipc.on("GET_PROJECTS", response => {
      this.projectsList = response
      console.log(this.projectsList)
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

    newProject() {
      window.ipc.send("NEW_PROJECT_FOLDER", this.newProjectName)
      this.projectsList.push([this.newProjectName, 0])
      this.newProjectName = null
      this.showNewProjectModal = false
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
  },
  watch: {
    newProjectName(contents) {
      if(contents !== null) {
        const checkArr = this.projectsList.map(x => x[0].toLowerCase())
        if(checkArr.includes(contents.toLowerCase())) {
          this.disableNewProjectButton = true
          }
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

  .level-option:hover {
    text-decoration: underline;
  }
</style>