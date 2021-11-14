module.exports = {
  pluginOptions: {
    electronBuilder: {
      mainProcessFile: 'src/main/background.js',
      rendererProcessFile: 'src/renderer/main.js',
      externals:['node-pty'],
    },
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/renderer/assets/globals.scss";`
      }
    }
  }
};