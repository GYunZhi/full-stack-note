## HMR（模块热替换）

### 配置

```js
const webpack = require("webpack");

plugins: [
	new webpack.HotModuleReplacementPlugin() // 模块热替换插件
]

// 启动 HMR
devServer: {
	contentBase: "./dist",
	open: true,
	hot:true,
	// 即便HMR不⽣效，浏览器也不⾃动刷新，就开启hotOnly
	hotOnly:true
}
```

### css 模块HMR

```js
var btn = document.createElement("button");
btn.innerHTML = "新增";
document.body.appendChild(btn);
btn.onclick = function() {
  var div = document.createElement("div");
  div.innerHTML = "item";
  document.body.appendChild(div);
};
```

**注意：启动HMR后，不⽀持hash，chunkhash，contenthash且不能使用 MiniCssExtractPlugin.loader 抽离css ，因为 HMR 加载样式是借助于 `style-loader`，此 loader 使用了 `module.hot.accept`，在 CSS 依赖模块更新之后，会将其 patch 到 `<style>` 标签中。**

### js 模块的 HMR

测试时需要使⽤ module.hot.accept 来观察模块是否更新，实际开发中，不需要手动观察模块是否更新，在Vue项目中，Vue loader 支持 vue 组件的HMR。

```js
// counter.js
function counter() {
	var div = document.createElement("div");
	div.setAttribute("id", "counter");
	div.innerHTML = 1;
	div.onclick = function() {
		div.innerHTML = parseInt(div.innerHTML, 10) + 1;
	};
	document.body.appendChild(div);
}
export default counter;


// number.js
function number() {
	var div = document.createElement("div");
	div.setAttribute("id", "number");
	div.innerHTML = 13000;
	document.body.appendChild(div);
}
export default number;


// index.js
import number from './number'
import counter from './counter'

number()
counter()

if (module.hot) {
  module.hot.accept("./number", function() {
  	document.body.removeChild(document.getElementById("number"))
  	number()
  })
}
```

## Babel 处理 ES6

开发过程中，我们会用到很多 ES6 的新特性，但是部分浏览器对这些新特性的支持并不是很好，所以我们需要使用Babel 对代码进行转换，使得我们的项目可以兼容更多的浏览器版本。

Babel 默认只转换新的 JavaScript 句法，而不转换新的 API，比如`Iterator`、`Generator`、`Set`、`Map`、`Proxy`、`Reflect`、`Symbol`、`Promise`等全局对象，以及一些定义在全局对象上的方法（比如`Object.assign`）都不会转码。

举例来说，ES6 在`Array`对象上新增了`Array.from`方法。Babel 就不会转码这个方法。如果想让这个方法运行，必须使用`@babel-polyfill`，为当前环境提供一个垫片。

`babel-polyfill`主要包含了`core-js`和`regenerator`两部分。

- core.js：提供了如ES5、ES6、ES7等规范中新定义的各种对象、方法的模拟实现。
- regenerator：提供 generator 支持，如果应用代码中用到 generator、async 函数的话需要用到。

**`babel-polyfill`实现的Promise对象扩展了finally方法，引用后不需要再使用es6-promise扩展`Promise.finally`(在ES2018中finally方法已经成为了标准)**

> 在 7.x 的版本中，babel 的依赖都添加了@前缀

### 安装

```bash
yarn add babel-loader @babel/core @babel/preset-env -D

yarn add @babel/polyfill
```

> @babel/core 的作用是把 js 代码转换成 AST（抽象语法树），方便各个插件分析语法进行相应的处理

### 配置

```js
// 可以把 options 抽离到 .babelrc 文件中
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader",
      options: {
        presets: [ "@babel/preset-env" ]
      }
    }
  ]
}

// index.js 引入 @babel/polyfill
import "@babel/polyfill";
```

经过上面的配置，我们的项目就可以在大部分的浏览器上运行，但是我们会发现打包之后文件的体积大了很多，因为 polyfill 默认会把所有的 ES6+ 的特性注入进来，如果想要按需注入，可以设置 **useBuiltIns** 参数。

**useBuiltIns 选项是 babel 7 的新功能，这个选项告诉 babel 如何配置 @babel/polyfill 。** 

它有三个参数可以使⽤： 

- entry：需要在 webpack 的⼊⼝⽂件⾥手动 import "@babel/polyfill" 。 babel 会根据你的使⽤情况导⼊垫⽚，没有使⽤的功能不会被导⼊相应的垫⽚。

- usage:：不需要 import ，全⾃动检测，但是要安装 @babel/polyfill 。（试验阶段） 

- false:：如果你 import "@babel/polyfill" ，它不会排除掉没有使⽤的垫⽚，文件的体积会很大。 (不推荐) 

```js
// .babelrc
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
        },
        "corejs": {
          "version": 2,
          "proposals": true
        },
        "useBuiltIns": "usage" // 按需注⼊
      }
    ]
  ]
}
```

> @babel/preset-env 在升级到 7.4.0 以上的版本以后，既支持core-js@2，也支持core-js@3。所以增加了`corejs`的配置，来指定所需的版本。如果没有配置，默认使用 core-js@2， 并且会提示我们指定一个版本。

### core-js@3

当 core-js 升级到 3 .0 的版本后，我们就不需要再使用 @babel/polyfill，因为它只包含 core-js 2.0 的版本。所以在 @babel/prest-env 升级到 7.4.0 及以上版本并且使用 core-js@3，需要做如下的替换工作：

```js
// 安装 core-js@3.0 和 regenerator-runtime
yarn add core-js@3 regenerator-runtime
 
// .babelrc
presets: [
  ["@babel/preset-env", {
    useBuiltIns: "entry", // or "usage"
    corejs: 3,
  }]
]
 
 
// 入口文件index.js
// 如果配置了 "useBuiltIns": "usage"，下面的操作就不需要了

// before
import "@babel/polyfill";
 
// after
import "core-js/stable";
import "regenerator-runtime/runtime";
```

### @babel/plugin-transform-runtime

当我们开发的是组件库、⼯具库的时候， @babel-polyfill 就不适合了，因为 ployfill 是注⼊到全局变量 window 对象下的，会污染全局环境。所以推荐闭包方式：@babel/plugin-transform-runtime 。

```js
// 安装
yarn add  @babel/plugin-transform-runtime @babel/runtime-corejs2 -D

// 配置
"plugins": [
  [
    "@babel/plugin-transform-runtime",
    {
      "absoluteRuntime": false,
      "corejs": 2,
      "helpers": true,
      "regenerator": true,
      "useESModules": false
    }
  ]
]

// 如果要使用 core-js@3，只需要安装 @babel/runtime-corejs3,并且修改 "corejs": 3 就可以了
```

**注意：在之前的版本中，@babel/runtime 最大的问题就是无法模拟实例上的方法，比如数组的 includes 方法就无法被 polyfill。但是在 core-js@3 的版本中，所有的实例方法都可以被polyfill了。**

## 配置 React 打包环境

```js
// 安装依赖
yarn add @babel/preset-react -D
yarn add react react-dom

// 配置
{
  "presets": [
    [
      "@babel/preset-env"
      {
        "targets": {
          "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
        },
        "corejs": 3,
        "useBuiltIns": "usage" // 按需注⼊
      }
    ]
    "@babel/preset-react"
  ]
}


// react 代码
import React, { Component } from "react";
import ReactDom from "react-dom";
class App extends Component {
	render() {
		return <div>hello world</div>;
	}
}
ReactDom.render(<App />, document.getElementById("app"));
```

## tree Shaking

开启 tree Shaking 之后，生产环境下 webpack 会帮助我们把没有用到的的代码去掉 （只⽀持 ES Module 方式引入的模块 ）

```js
// webpack 配置
optimization: {
  // 开启 tree Shanking
  usedExports: true, 
}

// 开启 tree Shaking 之后会产生一些副作用，需要在 package.json 中配置 sideEffects 选项来清除副作用
"sideEffects": [
    "*.css",
    "*.less",
    "@babel/polyfill"
 ]
```

## 代码分割 code splitting

假如我们引⼊⼀个第三⽅的⼯具库，体积为1mb，⽽我们的业务逻辑代码也有1mb，那么打包出来的体积⼤⼩会是2mb ，会影响代码加载速度和首页渲染速度。我们可以使用 code splitting 将第三方工具库代码单独打包。其实code Splitting 概念 与 webpack 并没有直接的关系，只不过webpack中提供了⼀种更加⽅便的⽅法供我们实现代码分割 ，基于 https://webpack.js.org/plugins/split-chunks-plugin。

```js
optimization:{
	// ⾃动做代码分割
	splitChunks:{
		chunks:"all"
	}
}

// 详细配置
optimization: {
  splitChunks: {
      chunks: 'async', // 对同步 initial，异步 async，所有的模块有效 all
      minSize: 30000, // 最⼩尺⼨，当模块⼤于30kb
      maxSize: 0, // 对模块进⾏⼆次分割时使⽤，不推荐使⽤
      minChunks: 1, // 打包⽣成的chunk⽂件最少有⼏个chunk引⽤了这个模块
      maxAsyncRequests: 5, // 最⼤异步请求数，默认5
      maxInitialRequests: 3, // 最⼤初始化请求书，⼊⼝⽂件同步请求，默认3
      automaticNameDelimiter: '~', // 打包分割符号
      name: true, // 打包后的名称，除了布尔值，还可以接收⼀个函数function
      cacheGroups: { //缓存组
        vendors: {
        test: /[\\/]node_modules[\\/]/,
        name:"vendor", // 要缓存的 分隔出来的 chunk 名称
        priority: -10 // 缓存组优先级 数字越⼤，优先级越⾼
      },
      other:{
        chunks: "initial", // 必须三选⼀： "initial" | "all" | "async"(默认就是async)
        test: /react|lodash/, // 正则规则验证，如果符合就提取
        chunk,
        name:"other",
        minSize: 30000,
        minChunks: 1,
      },
      commons:{
        test:/(react|react-dom)/,
        name:"react_vendors",
        chunks:"all"
      },
      default: {
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true//可设置是否重⽤该chunk
      }
    }
  }
}
```