<template>
  <div class="columns is-centered">
    <div class="column is-half full-height">
      <div class="column-scrollable">
        <nav class="panel">
          <p class="panel-heading">Projects</p>
          <a v-for="(n, j) in projectsList" :key="n[0]" :id="n[0]" :ref="`projectItem${n[0]}`" @click="toggleExpandProject($event, n[0])" class="panel-block">
            <p v-if="!(expand == n[0])"><span class="panel-icon"><i class="fas fa-folder"></i></span>{{n[0]}}</p>
            <aside v-if="expand == n[0]" class="menu">
              <ul class="menu-list">
                <a><span class="panel-icon"><i class="fas fa-folder"></i></span><b>{{n[0]}}</b></a>
                <ul>
                  <li v-for="i in n[1]" :key="`${n[0]}:${i}`" @click="openLevel(n[0], i)"><a class="level-option">{{`Level ${i}`}}</a></li>
                  <li v-if="n[1] < 24"><button @click="openNewLevelModal(n[0], j)" class="button is-small">+ Add level</button></li>
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
              <button class="delete" aria-label="close" @click="closeModals()"></button>
            </header>
            <section class="modal-card-body">
              <p>Choose a name for the new project</p>
              <input type="text" class="modal-text-area" v-model="newProjectName" />
            </section>
            <footer class="modal-card-foot">
              <button class="button is-success" @click="newProject()" :disabled="disableModalSubmit">Create</button>
              <button class="button" @click="closeModals()">Cancel</button>
            </footer>
          </div>
        </div>
      </div>

      <div v-if="showNewLevelModal" ref="newLevelModal" class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-content">
          <div class="modal-card">
            <header class="modal-card-head">
              <p class="modal-card-title">Create Level</p>
              <button class="delete" aria-label="close" @click="closeModals()"></button>
            </header>
            <section class="modal-card-body">
              <p>Input starting dimensions for the level in tiles (these can be changed later)</p>
              <p>Tip: for best results, use numbers between 8 and 64 (minimum of 4 allowed) </p>
              <input type="number" v-model="newLevelWidth" placeholder="width" />
              <input type="number" v-model="newLevelHeight" placeholder="height" />
            </section>
            <footer class="modal-card-foot">
              <button class="button is-success" @click="newLevel()" :disabled="disableModalSubmit">Create</button>
              <button class="button" @click="closeModals()">Cancel</button>
            </footer>
          </div>
        </div>
      </div>
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
      disableModalSubmit: true, // prevent sending blank data
      projectToAddTo: null,
      projectToAddToIndex: null,
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
    "openExisting"
  ],
  methods: {
    newLevel() {
      window.ipc.send("CREATE_LEVEL", [this.projectToAddTo, this.projectToAddToIndex, this.newLevelWidth, this.newLevelHeight])
      this.projectsList[this.projectToAddToIndex][1]++
      this.closeModals()
    },

    newProject() {
      window.ipc.send("NEW_PROJECT_FOLDER", this.newProjectName)
      this.projectsList.push([this.newProjectName, 0])
      this.closeModals()
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
    },

    openNewLevelModal(projectName, projectIndex) {
      this.projectToAddTo = projectName
      this.projectToAddToIndex = projectIndex
      this.showNewLevelModal = true
    },

    closeModals() {
      this.showNewProjectModal = false
      this.showNewLevelModal = false
      this.newProjectName = null
      this.newLevelWidth = null
      this.newLevelHeight = null
      this.disableModalSubmit = true
    },

    checkValidDimenstions() {
      const w = this.newLevelWidth
      const h = this.newLevelHeight
      if(w === null || isNaN(parseInt(w)) || w.length === 0 || parseInt(w) < 4) {
        this.disableModalSubmit = true
      } else if (h === null || isNaN(parseInt(h)) || h.length === 0 || parseInt(h) < 4) {
        this.disableModalSubmit = true
      } else {
        this.disableModalSubmit = false
      }
    }
  },
  watch: {
    newProjectName(contents) {
      if(contents !== null) {
        const checkArr = this.projectsList.map(x => x[0].toLowerCase())
        if(checkArr.includes(contents.toLowerCase()) || contents.length === 0) {
          this.disableModalSubmit = true
        } else {
          this.disableModalSubmit = false
        }
      }
    },

    newLevelWidth() {
      this.checkValidDimenstions()
    },

    newLevelHeight() {
      this.checkValidDimenstions()
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