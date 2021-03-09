const path = require('path')

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: path.resolve(__dirname, 'src', 'ts', 'main.ts'),
  output: {
    path: path.resolve(__dirname, 'scripts'),
    filename: 'gurps.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader'
      },
      {
        test: /\.s[ca]ss$/,
        use: [
          'style-loader',
          {
            loader: "css-loader",
            options: {
              url: false
            }
          },
          "sass-loader"
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [
  ],
  watch: true
}
