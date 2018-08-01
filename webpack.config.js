const path = require('path');
var webpack = require("webpack");
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

// 环境变量, dev, (test), online
var WEBPACK_ENV            = process.env.WEBPACK_ENV || 'dev'; 

var getHtmlConfig 		= function(name){
		return {
					template : './src/view/'+name+'.html',
        	filename : 'view/'+name+'.html',
        	inject   : true,
        	hash     : true,
        	chunks   : ['common', name]
		};
};

var config = {
  entry: {
  	'common' : ['./src/page/common/index.js', 'webpack-dev-server/client?http//localhost:8086/'],
  	'index' : ['./src/page/index/index.js'],
  	'login' : ['./src/page/login/index.js']
  },
  output: {
    
    path: path.resolve(__dirname, 'dist'),
    publicPath  : WEBPACK_ENV === 'online' ? '//s.happymmall.com/mmall_admin_fe/dist/' : '/dist/',
    filename: 'js/[name].js'
  },
  externals : {
  	'jquery' : 'window.jQuery'
  },
  module: {
  	rules: [
  	{ test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader!css-loader")},
  	{ test: /\.(gif|png|jpg|woff|svg|eot|ttf)\??.*$/, loader: 'url-loader?limit=100&name=resource/[name].[ext]' },
    { test: /\.string$/, loader: 'html-loader'}
  	]
  },
  resolve : {
        alias : {
            node_modules    : __dirname + '/node_modules',
            util            : __dirname + '/src/util',
            page            : __dirname + '/src/page',
            service         : __dirname + '/src/service',
            image           : __dirname + '/src/image'
        }
    },
  plugins: [
  			// 独立通用模块到js/base.js
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
        // 把css单独打包到文件里
        new ExtractTextPlugin("css/[name].css"),
        // html模板的处理
        new HtmlWebpackPlugin(getHtmlConfig('index')),
        new HtmlWebpackPlugin(getHtmlConfig('login'))
 
        ]
};

// 开发环境下，使用devServer热加载
if(WEBPACK_ENV === 'dev'){
    config.entry.common.push('webpack-dev-server/client?http://localhost:8086');
}

module.exports = config;
