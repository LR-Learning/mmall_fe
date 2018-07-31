const path = require('path');
var webpack = require("webpack");
var ExtractTextPlugin = require('extract-text-webpack-plugin');


var config = {
  entry: {
  	'common' : ['./src/page/common/index.js'],
  	'index' : ['./src/page/index/index.js'],
  	'login' : ['./src/page/login/index.js']
  },
  output: {
    
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js'
  },
  externals : {
  	'jquery' : 'window.jQuery'
  },
  module: {
  	rules: [
  	{ test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader!css-loader")}
  	]
  },
  plugins: [
        new webpack.optimize.SplitChunksPlugin({
            cacheGroups: {
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
                //打包重复出现的代码
                vendor: {
                    chunks: 'initial',
                    minChunks: 2,
                    maxInitialRequests: 5, // The default limit is too small to showcase the effect
                    minSize: 0, // This is example is too small to create commons chunks
                    name: 'vendor'
                },
                //打包第三方类库
                commons: {
                    name: "common",
                    filename: 'js/base.js',
                    chunks: "initial",
                    minChunks: Infinity
                }
            }
        }),

        new webpack.optimize.RuntimeChunkPlugin({
            name: "base"
        }),
        new ExtractTextPlugin("css/[name].css"),
        ]
};

module.exports = config;
