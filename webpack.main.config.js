const nodeExternals = require("webpack-node-externals")

module.exports = {
  entry: [
    "./src/main/background.js"
  ],
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.node$/,
        use: 'node-loader',
      },
      {
        test: /\.(m?js|node)$/,
        parser: { amd: false },
        use: {
          loader: '@vercel/webpack-asset-relocator-loader',
          options: {
            outputAssetBase: 'native_modules',
          },
        },
      },
    ]
  }
}