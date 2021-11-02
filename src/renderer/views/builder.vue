<template>
  <div>
    <button @click="test()">trigger test</button>
    <div>{{tileset.length}}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tileset = [],
    }
  },
  mounted() {
    window.ipc.on("GET_TILES", response => {
      tileset.push(response);
    })
  },
  methods: {
    test() {
      window.ipc.send("GET_TILES", "");
    }
  }
}
</script>
