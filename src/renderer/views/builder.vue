<template>
  <div>
    <button @click="test()">trigger test</button>
    <div>{{tileset.length}}</div>
    <img :src="mergeTest" alt="">
  </div>
</template>

<script>
export default {
  data() {
    return {
      tileset: [],
      mergeTest: null,
    }
  },
  mounted() {
    window.ipc.on("GET_TILES", response => {
      this.tileset.push(response);
      if(this.tileset.length == 52){
        console.log(this.tileset);
        window.mergeImages.merge(["data:image/png;base64," + this.tileset[19].tileImage, "data:image/png;base64," + this.tileset[40].tileImage], (b64) => {
          this.mergeTest = b64;
        });
        console.log(this.mergeTest);
      }
    })
  },
  methods: {
    test() {
      window.ipc.send("GET_TILES", "");
    }
  }
}
</script>
