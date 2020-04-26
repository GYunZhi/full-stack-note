## 项目搭建

[Create React App](https://www.html.cn/create-react-app/docs/getting-started/) 脚手架

```bash
# 创建项目
npx create-react-app my-app

# 启动项目
npm start
```

显示 webpack 配置

```bash
# 单向操作，ejet 后不能回退
npm run eject
```

文件结构

```
├── README.md             文档
├── public                静态资源
│ ├── favicon.ico
│ ├── index.html
│ └── manifest.json
└── src                   源码
├── App.css
├── App.js                根组件
├── App.test.js
├── index.css             全局样式
├── index.js              入口文件
├── logo.svg
└── serviceWorker.js      pwa支持
├── package.json          npm依赖
├── config
    ├── env.js            处理.env环境变量配置文件
    ├── paths.js          提供各种路径
    ├── webpack.config.js             webpack配置文件
	└── webpackDevServer.config.js    开发服务器配置文件
└── scripts                启动、打包和测试脚本
    ├── build.js           打包脚本
    ├── start.js           启动脚本
    └── test.js            测试脚本
```

## JSX 语法

JSX是一种JavaScript语法的扩展，其格式比较像模板语言，通过JSX可以很好的描述UI，当然，在 React 中并不强制要求使用 JSX，JSX 仅仅只是 `React.createElement(component, props, ...children)` 函数的语法糖。

> Babel会调用 React.createElement() 方法把 JSX 转换成虚拟 DOM 对象(React元素)，然后通过ReactDOM.render()方法映射成真实DOM

```js
// JSX 写法
import React, { Component } from 'react'
export default class JsxTest extends Component {
  render() {

    let title = this.props.title || 'jsx语法'

    const greet = <p>hello, Jerry</p>

    const user = { firstName: "tom", lastName: "jerry" };
    function formatName(user) {
      return user.firstName + " " + user.lastName;
    }

    let name = true ? <p>jerry</p> : null

    return (
      <div>
        <p>{ title }</p>
        {  greet }
        <p>{ formatName(user) }</p>
        { name }
        <ul>
          {
            [1, 2, 3,4 ].map((item, index) => <li key={item}>{item}</li> )
          }
        </ul>
        <p>这里是通过状态提升传过来的数据：{ this.props.date }</p>
      </div>
    )
  }
}

// React.createElement 写法
import React, { Component } from 'react';
export default class JsxTest extends Component {
  render() {

    let title = this.props.title || 'jsx语法';

    const greet = React.createElement("p", null, "hello, Jerry");

    const user = {
      firstName: "tom",
      lastName: "jerry"
    };

    function formatName(user) {
      return user.firstName + " " + user.lastName;
    }

    let name = true ? React.createElement("p", null, "jerry") : null;
    return (
      React.createElement("div", null,
        React.createElement("p", null, title), greet, 
        React.createElement("p", null, formatName(user)), 
        name, 
        React.createElement("ul", null, [1, 2, 3, 4].map((item, index) => React.createElement("li", { key: item }, item))), 
        React.createElement("p", null, "这里是通过状态提升传过来的数据：", this.props.date)
      )
    )
  }

}

```

**注意：由于 JSX 会编译为 `React.createElement` 调用形式，所以 `React` 库也必须包含在 JSX 代码作用域内。**

例如，在如下代码中，虽然 `React`  并没有被直接使用，但还是需要导入：

```js
import React, { Component } from 'react';
import './App.scss'
import JsxTest from '../components/JsxTest';

// 函数式组件
function App () {
   return (
     <div className="root">
       <JsxTest title="React真有趣"/>
     </div>
   );
}

export default App;

```

如果你不使用 JavaScript 打包工具而是直接通过 `<script>` 标签加载 React，则必须将 `React` 挂载到全局变量中。

## 组件

React中有两种类型组件的方式：class组件和function组件

### class组件

class组件通常拥有状态和生命周期，继承于Component，实现render方法 

```js
import React, { Component } from 'react';
import PropTypes from 'prop-types'
export default class JsxTest extends Component {

  static defaultProps = {
    title: '测试jsx语法'
  }

  render() {
    let title = this.props.title

    const greet = React.createElement("p", null, "hello, Jerry");

    const user = {
      firstName: "tom",
      lastName: "jerry"
    };

    function formatName(user) {
      
      return user.firstName + " " + user.lastName;
    }

    let name = true ? React.createElement("p", null, "jerry") : null;
    return (
      React.createElement("div", null,
        React.createElement("p", null, title), greet, 
        React.createElement("p", null, formatName(user)), 
        name, 
        React.createElement("ul", null, [1, 2, 3, 4].map((item, index) => React.createElement("li", { key: item }, item))), 
        React.createElement("p", null, "这里是通过状态提升传过来的数据：", this.props.date)
      )
    )
  }

}

// prop 类型检查
JsxTest.propTypes = {
  title: PropTypes.string
}
```

### function组件

函数组件通常无状态，仅关注内容展示，返回渲染结果即可

```js
// 函数式组件
function App () {
  return (
    <div className="root">
      <JsxTest title="React真有趣"/>
      <Clock />
      <ClockFun />
      <EventHandle />
    </div>
  );
}

export default App;
```

## 组件状态管理

### 类组件中的状态管理

```js
import React, { Component } from 'react'

export default class Clock extends Component {
  constructor (props) {
    super(props)
	// 使用state属性维护状态，在构造函数中初始化状态
    this.state = { 
      date: new Date() 
    }
  }

  // 组件挂载时启动定时器每秒更新状态
  componentDidMount () {
    this.timer = setInterval(() => {
      // 使用 setState 方法更新状态
      this.setState({
        date: new Date()
      }, () => {
        this.props.change(this.state.date.toLocaleTimeString())
      })
    }, 1000)
  }
	
  // 组件卸载时停止定时器
  componentWillUnmount () {
    clearInterval(this.timer)
  }

  render() {
    return (
      <div>
        { this.state.date.toLocaleTimeString() }
      </div>
    )
  }
}

```

### 函数式组件中的状态管理

函数式组件中的状态管理需要用到最新的 Hooks API  ***(Hook* 是 React 16.8 的新增特性)**

```js
import React from 'react'
import { useState, useEffect } from  'react'

export default function ClockFun() {
  const [date, setDate] = useState(new Date());
    useEffect(() => {
      const timer = setInterval(() => {
      setDate(new Date())
    }, 1000)
    return () => clearInterval(timer)
    }, []);

  return (
    <div>{date.toLocaleTimeString()}</div>
  )
}
```

### **setState 特性讨论**

- state 只能用 setState 更新状态而不能直接修改

```js
this.state.counter += 1; // 错误的
```

- setState是批量执行的，因此对同一个状态执行多次只起一次作用，多个状态更新可以放在同一个 setState 中进行，可以给 setState 传递一个函数，确保每次调用都使用最新的 state

```js
componentDidMount() {
	// 假如couter初始值为 0，执行三次以后其结果是多少？
	this.setState({counter: this.state.counter + 1})
	this.setState({counter: this.state.counter + 1})
	this.setState({counter: this.state.counter + 1})

  // 执行之后结果是多少？
  this.setState((prevState, props) => ({ counter: prevState.counter + 1}))
  this.setState((prevState, props) => ({ counter: prevState.counter + 1}))
  this.setState((prevState, props) => ({ counter: prevState.counter + 1}))
}
```

- setState通常是异步的，因此如果要获取到最新状态值有以下几种方式：

  > setstate在原生事件，setTimeout,setInterval,promise等异步操作中，state会同步更新

  - 使用 setState 第二个参数
  
  ```js
  // setState()函数接受两个参数，一个是一个对象，就是设置的状态，还有一个是一个回调函数,是在设置状态成功之   后执行的
  this.setState({counter: this.state.counter + 1}, () => {
    console.log(this.state.counter)
})
  ```

  - 使用定时器
  
  ```js
  this.setState({counter: this.state.counter + 1})
  console.log(this.state.counter) // 0
  setTimeout(() => {
     console.log(this.state.counter) // 1
}, 0)
  ```

  - 原生事件中修改状态
  
  ```js
  changeValue = () => {
    this.setState({ counter: this.state.counter + 1 })
    console.log(this.state.counter) // 1
  }
  
  document.body.addEventListener('click', this.changeValue, false)
  ```
  
  - promise
  
  ```js
  const promise = new Promise(function (resolve, reject) {
    resolve(1)
  })
  
  promise.then(num => {
    this.setState({ counter: this.state.counter + num })
    console.log(this.state.counter) // 1
  })
  ```

## 事件处理

React 中使用onXXX写法来监听事件，例如：onClick、onChange

**`React.Component` 创建的组件，其成员函数不会自动绑定this，需要开发者手动绑定，否则 this 不能获取当前组件实例对象。**

```
class Contacts extends React.Component {  
  constructor(props) {
    super(props);
  }
  handleClick() {
    console.log(this); // null
  }
  render() {
    return (
      <div onClick={ this.handleClick }></div>
    );
  }
```

`React.Component `有**三种手动绑定方法**： 

在**构造函数中完成绑定**，也可以**在调用时使用`method.bind(this)`来完成绑定**，还可以**使用arrow function来绑定**。拿上例的`handleClick`函数来说，其绑定可以有：

```js
// 构造函数中绑定
constructor(props) {
  super(props);
  this.handleClick = this.handleClick.bind(this);
}

// 使用bind来绑定
<div onClick={this.handleClick.bind(this)}></div> 

// 使用arrow function来绑定
<div onClick={()=>this.handleClick()}></div> 
```

## 表单

React 中的双向绑定是组件自己绑定状态，自己修改状态实现的，这样的组件称之为**受控组件**。

```js
import React, { Component } from 'react'

export default class EventHandle extends Component {

  constructor(props) {
    super(props)
    this.state = {
      name: ''
    }
    // this.handleChange = this.handleChange.bind(this)
  }

  // 这里的 event 是合成事件，不存在兼容性问题
  handleChange (e) {
    this.setState({
      name: e.target.value
    })
  }

  render() {
    return (
      <div>
        <p>这是一个受控组件，React中的双向绑定是组件自己绑定状态，自己修改状态实现的，这样的组件称之为受控组件</p>
        <input value={ this.state.name } onChange={ (e) => { this.handleChange(e) } }></input>
      </div>
    )
  }
}
```

## 组件通信

props 属性传递可以用于父子组件相互通信

```js
// index.js
ReactDOM.render(<App title="React 真的很有趣" />, document.querySelector('#root'));

// App.js
<h2>{this.props.title}</h2>
```

如果父组件传递的是函数，则可以把子组件的数据传入父组件，这种做法称之为 **状态提升**，兄弟组件之间的通信也可以通过状态提升来实现。

```js
<Clock change={this.onChange} />
    
this.timerID = setInterval(() => {
this.setState({ date: new Date()}, ()=>{
    	// 每次状态更新就通知父组件
    	this.props.change(this.state.date);
    });
}, 1000);
```

## 生命周期

React v16.0 之前的生命周期在 React v16 推出的 [Fiber](https://zhuanlan.zhihu.com/p/26027085) 之后就不合适了，因为如果要开启 async rendering，在render函数之前的所有函数，都有可能被执行多次。所以 v16.0 之前和之后的生命周期有所修改，但是大部分团队不见得会跟进升到16版本，所以16前的生命周期还是很有必要掌握的，何况16也是基于之前的修改。

### React 16.0 之前的生命周期

![mark](http://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/20190906/151954752.png)

#### 初始化 (initialization)  阶段

 初始化阶段会执行 `constructor()` 做一些组件的初始化工作

```js
import React, { Component } from 'react';

class Test extends Component {
  constructor(props) {
      super(props)
      this.state= {
          counter: 1
      }
  }
}
```

#### 挂载 (Mounting) 阶段

此阶段分为componentWillMount，render，componentDidMount三个时期

- componentWillMount：在组件挂载到DOM前调用，只会被调用一次，在这边调用 this.setState 不会引起组件重新渲染，也可以把写在这边的内容提前到 constructor() 中，所以项目中很少用。

- render：根据组件的 props 和 state 返回一个React元素（描述组件，即UI），不负责组件实际渲染工作，之后由React自身根据此元素去渲染出页面DOM。render是纯函数（pure  function：函数的返回结果只依赖于它的参数；函数执行过程里面没有副作用），不能在里面执行this.setState，会有改变组件状态的副作用。

- componentDidMount：组件挂载到DOM后调用，只会被调用一次。

#### 更新 (update) 阶段

在讲述此阶段前需要先明确下react组件更新机制。setState 引起的 state 更新或父组件重新 render 引起的props更新，更新后的 state 和 props 相对之前无论是否有变化，都将引起子组件的重新render。

- componentWillReceiveProps(nextProps,  nextState)

- shouldComponentUpdate(nextProps,  nextState)

- componentWillUpdate(nextProps, nextState)

- render

- componentDidUpdate(prevProps, prevState)

**造成组件更新有两类（三种）情况：**

- 1.父组件重新 render

父组件重新render引起子组件重新 render 的情况有两种

a. 直接使用，每当父组件重新 render 导致的重传 props，子组件将直接跟着重新渲染，无论 props 是否有变化。可通过 shouldComponentUpdate 方法优化。

```js
class Child extends Component {
   // 应该使用这个方法，否则无论props是否有变化都将会导致组件跟着重新渲染
   shouldComponentUpdate(nextProps, nextState){ 
        if(nextProps.someThings === this.props.someThings){
          return false
        }
    }
    render() {
        return <div>{this.props.someThings}</div>
    }
}
```

b. 在 componentWillReceiveProps 方法中，将 props 转换成自己的 state

```js
class Child extends Component {
    constructor(props) {
        super(props);
        this.state = {
            someThings: props.someThings
        }
    }
    // 父组件重传 props 时就会调用这个方法
    componentWillReceiveProps(nextProps, nextState) {
        this.setState({ someThings: nextProps.someThings })
    }
    render() {
        return <div>{this.state.someThings}</div>
    }
}
```

根据官网的描述

> 在 componentWillReceiveProps 中调用 this.setState() 将不会引起第二次渲染。

因为 componentWillReceiveProps 中判断props是否变化了，若变化了，this.setState将引起state变化，从而引起render，此时就没必要再做第二次因重传props引起的render了，不然重复做一样的渲染了。

- 2. 组件本身调用 setState，无论 state 有没有变化。可通过 shouldComponentUpdate 方法优化

```js
class Child extends Component {
   constructor(props) {
        super(props);
        this.state = {
          someThings:1
        }
   }
   // 应该使用这个方法，否则无论state是否有变化都将会导致组件重新渲染
   shouldComponentUpdate(nextProps, nextStates){ 
        if(nextStates.someThings === this.state.someThings){
          return false
        }
    }

   handleClick = () => { // 虽然调用了setState ，但state并无变化
        const preSomeThings = this.state.someThings
         this.setState({
            someThings: preSomeThings
         })
   }

    render() {
        return <div onClick = {this.handleClick}>{this.state.someThings}</div>
    }
}
```

#### 卸载阶段

此阶段只有一个生命周期方法：componentWillUnmount ，此方法在组件被卸载前调用，可以在这里执行一些清理工作，比如**清除组件中使用的定时器**，**清除 componentDidMount 中手动创建的DOM元素**等，以避免引起内存泄漏。

### React 16.3 的生命周期

![mark](http://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/20190906/152001877.png)

### React 16.4 的生命周期

![mark](http://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/20190906/152011089.png)

React v16.3，引入了两个新的生命周期函数，`getDerivedStateFromProps`，`getSnapshotBeforeUpdate`，

`getDerivedStateFromProps` 本来（React v16.3中）是只在创建和更新（由父组件引发部分），也就是不是不由父组件引发，那么 getDerivedStateFromProps 也不会被调用，如自身 setState 或者 forceUpdate 引发。

在React v16.4中改正了这一点，让 getDerivedStateFromProps 无论是 Mounting 还是 Updating，也无论是因为什么引起的Updating，都会被调用。

#### getDerivedStateFromProps

**static getDerivedStateFromProps(nextProps, prevState)** 在组件创建时和更新时的 render 方法之前调用，它应该返回一个对象来更新状态，或者返回 null 不更新任何内容。

```js
static getDerivedStateFromProps (nextProps, prevState) {
    console.log('getDerivedStateFromProps', nextProps, prevState)
    if (nextProps.msg !== prevState.name) {
      return { name: nextProps.msg }
    }
    return null
}
```

#### getSnapshotBeforeUpdate

**getSnapshotBeforeUpdate()** 被调用于render之后，可以读取但无法使用 DOM 的时候。它使您的组件可以在可能更改之前从 DOM 捕获一些信息（例如滚动位置）。此生命周期返回的任何值都将作为参数传递给componentDidUpdate

官网给的例子：

```js
class ScrollingList extends React.Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // 我们是否要添加新的 items 到列表?
    // 捕捉滚动位置，以便我们可以稍后调整滚动.
    if (prevProps.list.length < this.props.list.length) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // 如果我们有snapshot值, 我们已经添加了 新的items.
    // 调整滚动以至于这些新的items 不会将旧items推出视图。
    // (这边的snapshot是 getSnapshotBeforeUpdate 方法的返回值)
    if (snapshot !== null) {
      const list = this.listRef.current;
      list.scrollTop = list.scrollHeight - snapshot;
    }
  }

  render() {
    return (
      <div ref={this.listRef}>{/* ...contents... */}</div>
    );
  }
}
```

