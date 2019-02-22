const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const PAGE_PATH = path.resolve(__dirname, './src/page')
//引入glob
const glob = require('glob')
//entries函数
var entries= function () {
    var entryFiles = glob.sync(PAGE_PATH + '/*/*.js')
    var entryFiles2 = glob.sync(__dirname+'/static/js/*.js')
    
    var map = {};
    console.log('entryFiles',entryFiles)
    for (var i = 0; i < entryFiles.length; i++) {
        var filePath = entryFiles[i];
        var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
        map[filename] = filePath;
    }
    map['common'] = entryFiles2
    return map;
}
//多页面输出配置
var htmlPlugin = function() {
  let entryHtml = glob.sync(PAGE_PATH + '/*/*.html')
  console.log('entryHtml',entryHtml)
  
  let arr = []
  entryHtml.forEach((filePath) => {
    let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
    let conf = {
      template: filePath,
      filename: filename + '.html',
      chunks: ['common',filename],
      inject: true
    }
    arr.push(new HtmlWebpackPlugin(conf))
  })
  return arr
}
module.exports = {
  mode: 'development',
  entry: entries(),
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'), // boolean | string | array, static file location
    // compress: false, // enable gzip compression
    port: 9000,
    // historyApiFallback: true, // true for index.html upon 404, object for multiple paths
    // hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
    // https: false, // true for self-signed, object for cert authority
    // noInfo: true, // only errors & warns on hot reload
    // ...
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
  ].concat(htmlPlugin()),
  output: {
    filename: 'js/[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  module: {
    rules: [
      {//处理css/less文件 css-loader用来处理css中url的路径，style-loader可以把css文件变成style标签插入head中，postcss-loader处理css3属性前缀，多个loader是有顺序要求的，从右往左写，因为转换的时候是从右往左转换的
        test: /\.(css|less)$/,
        use: [
          'style-loader',
          'css-loader',
          "less-loader" ,
          'postcss-loader'
        ],
        // include: path.join(__dirname, 'static'), //限制范围，提高打包速度
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
      //         outputPath: 'static/img/', // 图片输出的路径
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