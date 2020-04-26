## 安装

建议局部安装，不同项目 webpack 版本可能不一样

```bash
# 查看webpack历史发布信息
npm info webpack

# 局部安装
npm install webpack webpack-cli -D

# 安装指定版本
npm install webpack@x.xx webpack-cli -D

# 检查安装是否成功，npx帮助我们在项⽬中的 node_modules ⾥查找 webpack
npx webpack -v || ./node_modules/.bin/webpack -v
```

## 什么是 webpack

webpack是一个模块打包工具，它会从入口文件开始，分析各个模块之间的依赖关系，并使用 loader 处理那些非js文件的模块，最终打包生成能够供浏览器使用的文件。

![mark](http://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/20190903/142752654.png)

## webpack核心概念

webpack默认的配置文件名称为 webpack.config.js，可通过 -- config 选项指定自定义的名称。

```bash
npx webpack --config webpack.dev.config.js
```

webpack默认的入口文件为 src/index.js，输出文件为 dist/main.js。

**webpack默认的配置比较弱，大部分的功能需要通过自定义配置实现。**

### entry

指定 webpack 打包入口文件，入口分为**单入口**和**多入口**，webpack 执行构建的第一步将从entry开始。

```js
// 单入口也可以使用对象语法
entry: "./src/index.js",
  
// index、login是 chunkName，可自定义
entry: {
   index: "./src/index.js",
   login: "./src/login.js"
}
```

### output

webpack 打包后的输出结果

```js
// 单入口的处理
output: {
	filename: "bundle.js", // 输出⽂件的名称，默认为 main.js
	path: path.resolve(__dirname, "dist"), // 输出⽂件到磁盘的⽬录，必须是绝对路径
  publicPath: '/' // 资源基础路径,index.html 中加载的资源都会以这个路径为基础
},
    
// 多⼊⼝的处理
output: {
	filename: "[name][chunkhash:8].js", // 利⽤占位符，指定输出的文件名称为入口处的 chunkName
	path: path.resolve(__dirname, "dist") // 输出⽂件到磁盘的⽬录，必须是绝对路径
}
```

> hash：每次打包构建时都会改变
>
> chunkhash：入口文件对应的chunk改变，chunkhash才会发生改变
>
> contenthash：文件内容发生变化，contenthash才会改变

### mode

指定当前构建环境，用于webpack内部优化

![mark](http://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/20190903/145302772.png)

### loader

webpack 默认只知道处理 js 和 json 文件。loader 让 webpack 能够去处理其他类型的文件，并将它们转换为有效的模块。

当 webpack 处理到不认识的模块时，需要在 `module.rules` 中进行配置，使用相应的 loader 来处理:

```js
module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/,
        // use: "url-loader",
        use: {
          loader: "url-loader",
          // 额外的配置
          options: {
            name: "[name].[ext]", // name、ext： 未打包的资源模块的名称和后缀
            outputPath: "images/", // 打包后文件放置的位置
            limit: 2048
          }
        }
      },
      {
        test: /\.(woff2|woff)$/,
        use: {
          loader: "file-loader"
        }
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "less-loader",
          "postcss-loader"
        ]
      }
    ]
  }
```

#### file-loader、url-loader

file-loader 用来处理静态资源模块，它会把需要处理的模块，从源代码移动到打包目录。

url-loader 内部使⽤了 file-loader，所以可以处理 file-loader处理的所有的事情，不同的是url-loader 可以通过 limit 属性对图片分情况处理，当图片小于 limit（单位：byte）大小时转为 base64 格式，大于 limit 时调用 file-loader 对图片进行处理。

#### style、css、less loader

style-loader 会把 css-loader ⽣成的内容，放入 style 中挂载到⻚⾯的 head 部分 

css-loader 分析css模块之间的关系，并合成⼀个css 

less-load 把 less 语法转换成 css 

> loader 的加载顺序：从右到左，从下到上

#### postcss-loader autoprefixer

[PostCss](https://postcss.org/)是一个样式处理工具，它通过自定义的插件来重新定义css。它鼓励开发者使用规范的css原生语法编写代码，然后配置编译器转换需要兼容的浏览器版本，最后通过编译将源码转换为目标浏览器可用的css代码。

> postCss 插件：https://github.com/postcss/postcss/blob/master/docs/plugins.md
>

postcss-loader autoprefixer 配合使用，用于样式自动添加前缀

```js
{
	test: /\.less$/,
	use: [
		"style-loader",
		"css-loader",
		"less-loader",
		{
			loader: "postcss-loader",
			options: {
				plugins: () => [
					require("autoprefixer")({
					// autoprefixer 新版本中 browsers 替换成 overrideBrowserslist
					overrideBrowserslist: ["last 2 versions",">1%"]
				})]
			}
		}
	]
}
```

可以将 autoprefixer 的配置抽离到 postcss.config.js 中

```js
module.exports = {
  plugins: [
    require("autoprefixer")({
      overrideBrowserslist: ["last 2 versions", ">1%"]
    })
  ]
}
```

### watch

watch选项用于开启文件监听，轮询判断文件是否发生了变化，监听到文件发生变化之后，会重新打包。

```js
watch: true, // 默认false,不开启
// 配合watch,只有开启才有作⽤
watchOptions: {
    // 默认为空，不监听的⽂件或者⽬录，⽀持正则
    ignored: /node_modules/,
    // 监听到⽂件变化后，等300ms再去执⾏，默认300ms,
    aggregateTimeout: 300,
    // 判断⽂件是否发⽣变化是通过不停的询问系统指定⽂件有没有变化，默认每秒问1次
    poll: 1000 // ms
}
```

### plugins

plugin 可以在 webpack 运行到某一阶段的时候， 注入扩展逻辑，改变构建结果或者做一些你想做的事情。插件作用于整个构建过程。

```js
plugins: [
  new HtmlWebpackPlugin({
    title: "首页",
    template: "./src/index.html",
    inject: true,
    chunks: ["index"],
    filename: "index.html"
  }),
  new HtmlWebpackPlugin({
    title: "注册",
    template: "./src/index.html",
    inject: true,
    chunks: ["login"],
    filename: "login.html"
  }),
  new CleanWebpackPlugin(),
  new MiniCssExtractPlugin({
    filename: "[name]_[contenthash:8].css"
  })
]
```

#### HtmlWebpackPlugin

htmlwebpackplugin 会在打包结束后，⾃动⽣成⼀个 html ⽂件，并把打包⽣成的 js 模块引⼊到该 html 中。 

```js
title: HTML 文档的标题,需要使用ejs模板语法形式配置：{%= o.htmlWebpackPlugin.options.title %}

filename: 输出的 HTML 的⽂件名称，默认是 index.html, 可以为输出文件指定子目录位置（例如'html/index.html'）

template: 模板⽂件路径

inject: 配置生成的js文件插入到模板中的位置
	true 默认值，script标签位于html文件的 body 底部
	'body' script标签位于html文件的 body 底部
	'head' script标签位于html文件的 head中
	false 不插入生成的js文件，这个几乎不会用到的                                

favicon: 添加特定的 favicon 路径到输出的 HTML ⽂件中

minify: Boolean | Object，是否启用 html-minifier 对代码进行压缩，默认是 false，html-webpack-plugin 内部集成了 html-minifier 插件，可以传递一个对象对 html-minifier 进行配置

hash: true | false, 如果为 true, 将添加⼀个唯⼀的 webpack 编译 hash 到所有包含的脚本和 CSS ⽂件，对于解除 cache 很有⽤

cache: true | false，如果为 true, 这是默认值，仅仅在⽂件修改之后才会生成新文件

showErrors: true | false, 如果为 true, 这是默认值，错误信息会写⼊到 HTML ⻚⾯中

chunks: 允许插入到模板中的一些chunk，不配置此项默认会将 entry 中所有的 chunk 注入到模板中。在配置多个页面时，每个页面注入的 chunk 应该是不相同的，需要通过该配置为不同页面注入不同的thunk

chunksSortMode: 允许控制 chunk 在添加到⻚⾯之前的排序⽅式，⽀持的值： 'none' | 'default' | {function}-default:'auto'

excludeChunks: 允许跳过某些 chunk (⽐如，跳过单元测试的chunk)
```

#### clean-webpack-plugin 

```js
// 清空 dist 文件夹
const { CleanWebpackPlugin } = require("clean-webpackplugin");
...
plugins: [
	new CleanWebpackPlugin()
]
```

#### mini-css-extract-plugin

```js
// 把 css-loader 合成的 css 放到一个单独的文件中 
const MiniCssExtractPlugin = require("mini-css-extractplugin");
{
	test: /\.css$/,
	use: [MiniCssExtractPlugin.loader, "css-loader"]
}
new MiniCssExtractPlugin({
	filename: "[name][chunkhash:8].css"
})
```

### sourceMap

源代码与打包后的代码映射关系，通过sourceMap定位到源代码。

在 development 模式中，默认开启，关闭的话 可以在配置⽂件⾥修改 [devtool](https://webpack.js.org/configuration/devtool#devtool)。

```js
devtool: 'none'
```

eval：速度最快,使⽤ eval 包裹模块代码,

source-map：产⽣ .map ⽂件

cheap：较快，不⽤管列的信息,也不包含 loader 的 sourcemap

module：第三⽅模块，包含 loader 的 sourcemap（⽐如 jsx to js ， babel 的sourcemap）

inline： 将 .map 作为DataURI嵌⼊，不单独⽣成 .map ⽂件

**推荐配置：**

```js
devtool: 'cheap-module-eval-source-map', // 开发环境配置
devtool: 'cheap-module-source-map',     // 线上⽣成配置 
```

### webpackDevServer

每次改完代码都需要重新打包⼀次，打开浏览器，刷新⼀次，很麻烦。我们可以安装使⽤ webpackdevserver 来提升开发体验，devServer把打包后的模块放到内存中，从⽽提升加载速度。

#### 处理跨域问题

联调期间，前后端分离，直接获取数据会跨域，上线后我们使⽤nginx转发，开发期间， webpack就可以搞定这件事。
启动⼀个服务器， mock⼀个接⼝：

```js
const express = require("express");
const app = express();
app.get("/api/info", (req, res) => {
  res.json({
    name: "webpack",
    age: 5,
    msg: "欢迎学习webpack"
  });
});
app.listen("9092");
```

webpackDevServer配置代理

```js
// 测试跨域问题
import axios from 'axios'
axios.get('/api/info').then(res=>{
  console.log(res)
})

devServer: {
  contentBase: "./dist", // 默认是 './dist'
  open: true,
  port: 8081,
  proxy: {
    '/api': {
      target: 'http://localhost:9092'
    }
  }
}
```