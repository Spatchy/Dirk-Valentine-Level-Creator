<template>
  <div>
    <button @click="test()">trigger test</button>
  </div>
</template>

<script>
export default {
  methods: {
    test() {
      window.ipc.send("TEST", "test");
    }
  }
}
</script>
