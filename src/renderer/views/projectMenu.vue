<template>
  <div class="columns">
    <div class="column is-two-thirds full-height">
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
                  <li v-if="n[1] > 1"><button @click="openExportModal(n[0])" class="button is-small">Export Project</button></li>
                </ul>
              </ul>
            </aside>
          </a>
          <a class="panel-block">
            <button class="button is-fullwidth" @click="showNewProjectModal = true">New Project</button>
          </a>
        </nav>
      </div>
    </div>

    <div class="column full-height">
      <nav class="panel">
        <p class="panel-heading">Import</p>
        <div @drop.prevent="dropDvpack($event)" @dragover.prevent>
          <div class="columns is-centered my-1">
            <div class="column is-half">
                <article class="notification drop-container">
                  <article class="notification drop-square">
                    <div class="drop-inner level">
                      <div class="drop-text level-item">
                        Drop your .dvpack file here
                      </div>
                    </div>
                  </article>
                </article>
            </div>
          </div>
        </div>
        <a class="panel-block">
          <button class="button is-fullwidth" @click="chooseDvpack()">Choose File</button>
        </a>
      </nav>
    </div>
  </div>

  <div v-if="showExportModal" ref="exportModal" class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Export Project</p>
          <button class="delete" aria-label="close" @click="closeModals()"></button>
        </header>
        <section class="modal-card-body">
          <div v-if="!(exportToFlashpoint || exportDvpack)" class="has-text-danger is-size-7">Please select at least one export option</div>
          <div>Export To Flashpoint: <input type="checkbox" v-model="exportToFlashpoint"></div>
          <div>Export Shareable DVpack: <input type="checkbox" v-model="exportDvpack"></div>
          <div>Project: <input type="text" class="modal-text-area" v-model="exportTitle" /></div>
          <div>Creator: <input type="text" class="modal-text-area" v-model="exportCreator" /></div>
          <div>Version: <input type="text" class="modal-text-area" v-model="exportVersion" /></div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" @click="exportProject()" :disabled="disableModalSubmit">Create</button>
          <button class="button" @click="closeModals()">Cancel</button>
        </footer>
      </div>
    </div>
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
      showExportModal: false,
      exportTitle: null,
      exportCreator: null,
      exportVersion: null,
      exportFolderName: null,
      exportToFlashpoint: true,
      exportDvpack: true,
    }
  },
  mounted() {
    window.ipc.send("GET_PROJECTS", "")

    window.ipc.on("GET_PROJECTS", response => {
      this.projectsList = response
    })

    window.ipc.on("IMPORT_DVPACK", () => { // refresh projects list when import finished
      window.ipc.send("GET_PROJECTS", "")
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

    openExportModal(proj) {
      this.exportTitle = proj
      this.exportFolderName = proj
      this.showExportModal = true
    },

    exportProject() {
      if(this.exportDvpack) {
        window.ipc.send("EXPORT_DVPACK", [this.exportTitle, this.exportCreator, this.exportVersion, this.exportFolderName])
      }
      if(this.exportToFlashpoint) {
        window.ipc.send("EXPORT_TO_FLASHPOINT", [this.exportTitle, this.exportCreator, this.exportVersion, this.exportFolderName])
      }
      this.closeModals()
    },

    dropDvpack(e) {
      const files = e.dataTransfer.files
      const paths = [...files].filter(file => file.name.endsWith(".dvpack")).map(file => file.path)
      if(paths.length > 0) {
        window.ipc.send("IMPORT_DVPACK", paths)
      }
    },

    chooseDvpack() {
      window.ipc.send("IMPORT_DVPACK", [])
    },

    closeModals() {
      this.showNewProjectModal = false
      this.showNewLevelModal = false
      this.showExportModal = false
      this.disableModalSubmit = true
      this.newProjectName = null
      this.newLevelWidth = null
      this.newLevelHeight = null
      this.exportTitle = null
      this.exportCreator = null
      this.exportVersion = null
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
    },

    checkValidExportData() {
      const title = this.exportTitle
      const creator = this.exportCreator
      const ver = this.exportVersion
    
      if((this.exportToFlashpoint || this.exportDvpack) && (title && creator && ver) && title.length > 0 && creator.length > 0 && ver.length > 0) {
        this.disableModalSubmit = false
      } else {
        this.disableModalSubmit = true
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
    },

    exportTitle() {
      this.checkValidExportData()
    },

    exportCreator() {
      this.checkValidExportData()
    },

    exportVersion() {
      this.checkValidExportData()
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

  .drop-container {
    padding: 24px;
  }

  .drop-square {
    border-style: dashed;
    border-color: black;
    border-width: 4px;
    padding-top: 75%;
    width: 100%;
    position: relative;
  }

  .drop-inner{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 100%;
    width: 50%;
    margin-left: auto;
    margin-right: auto;
  }

  .drop-text {
    text-align: center;
    width: 50%;
    margin: auto;
    height: 100%;
  }
</style>