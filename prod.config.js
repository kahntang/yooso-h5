const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const PAGE_PATH = path.resolve(__dirname, './src/page')
//引入glob
const glob = require('glob')
//entries函数
const entries= function () {
    var entryFiles = glob.sync(PAGE_PATH+'/*/*.js')
    var entryFiles2 = glob.sync(__dirname+'/static/js/*.js')
    console.log('entryFiles',entryFiles,entryFiles2)
    var map = {};

    for (var i = 0; i < entryFiles.length; i++) {
        var filePath = entryFiles[i];
        var filename = filePath.substring(filePath.lastIndexOf('\/')+1, filePath.lastIndexOf('.'));
        map[filename] = filePath;
    }
    map['common']=entryFiles2
    return map;
}
//多页面输出配置
const htmlPlugin = function() {
  let entryHtml = glob.sync(PAGE_PATH+'/*/*.html')
  console.log('entryHtml',entryHtml)
  
  let arr = []
  console.log('process.env.NODE_ENV',process.env.NODE_ENV)
  entryHtml.forEach((filePath) => {
    let filename = filePath.substring(filePath.lastIndexOf('\/')+1, filePath.lastIndexOf('.'))
    let conf = {
      template: filePath,
      filename: filename+'.html',
      chunks: ['common','vendor',filename],
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunksSortMode: 'dependency'
    }
    arr.push(new HtmlWebpackPlugin(conf))
  })
  return arr
}
module.exports = {
  mode: "production",
  entry: entries(),
  optimization: {
    sideEffects: false,
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      // new OptimizeCSSAssetsPlugin({})
    ],
    splitChunks: {
      chunks     :'all',
      minSize    : 30000,
      minChunks  : 1,
      cacheGroups: {
        js: {//将node_modules里的js分离出来合并成一个vendor.js文件
          test:/[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all",
          priority: -10,
          enforce : true
        },
        // css: {
        //   name: 'baseStyle',
        //   // test:/\.css$/,
        //   test: /\.(less|css)$/,
        //   chunks: 'all',
        //   enforce: true
        // }
      }
    }
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'), // boolean | string | array, static file location
    compress: true, // enable gzip compression
    // historyApiFallback: true, // true for index.html upon 404, object for multiple paths
    // hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
    // https: false, // true for self-signed, object for cert authority
    // noInfo: true, // only errors & warns on hot reload
    // ...
  },
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(['dist']),
    // new UglifyJsPlugin({//压缩文件
    //   sourceMap: true
    // }),
    new CopyWebpackPlugin([{//复制静态文件及文件夹
      // from: __dirname + '/src/public',
      from: __dirname + '/static',
      to: __dirname + '/dist/static',
      ignore: ['.*']
    }]),
    new MiniCssExtractPlugin({//给分离出来的css文件制定路径并命名
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "static/css/[name].[chunkhash:5].css",
      chunkFilename: "static/css/[name].[chunkhash:5].css"
    }),
  ].concat(htmlPlugin()),
  output: {
    filename: 'static/js/[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  module: {
    rules: [
      {//处理css/less文件 css-loader用来处理css中url的路径，style-loader可以把css文件变成style标签插入head中，postcss-loader处理css3属性前缀，多个loader是有顺序要求的，从右往左写，因为转换的时候是从右往左转换的
        test: /\.(css|less)$/,
        use: [
          MiniCssExtractPlugin.loader,//MiniCssExtractPlugin.loader与style-loader不能一起使用
          'css-loader',
          'less-loader', // compiles Less to CSS
          'postcss-loader'
        ],
        // include: path.join(__dirname, 'src'), //限制范围，提高打包速度
        exclude: /node_modules/  //忽略node_modules
      },
      {//处理图片,file-loader是解析图片地址，把图片从源文件拷贝到目标文件并且修改源文件名字
        test: /\.(png|svg|jpg|gif)$/,
        loader: 'file-loader',  
        query: {  
            name: 'static/img/[name].[ext]'  
        }
      },
      // {//url-loader可以在文件比较小的时候，直接变成base64字符串内嵌到页面中
      //     test: /\.(png|jpg|jpeg|gif|svg)/,
      //     use: {
      //       loader: 'url-loader',
      //       options: {
      //         // outputPath: 'static/img/', // 图片输出的路径
      //         limit: 5 * 1024
      //       }
      //     }
      // },
      {//处理img标签上的src路径
        test: /\.(htm|html)$/i,
        loader: 'html-withimg-loader'
      },
      {//处理字体
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      },
      {// env转换es6 stage-0转es7 
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          query: {
            presets: ['env', 'stage-0'] 
          }
        }
      }
    ]
  }
};