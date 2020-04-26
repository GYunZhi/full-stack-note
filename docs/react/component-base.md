## **组件跨层级通信** **-** **Context**

[context参考](https://reactjs.org/docs/context.html)

**范例：模拟redux存放全局状态，在组件间共享**

```js
// 组件跨层级通信
import React, { Component } from 'react'

// 1、创建上下文对象
const Context = React.createContext()

// 2、获取 Provider 和  Consumer 
const { Provider, Consumer } = Context

// Child显示计数器，并能修改它，多个Child之间需要共享数据
function Child(props) {
  return (
    <div onClick={ () => props.add() }>{props.counter}</div>
  )
}

export default class ContextTest extends Component {
	// state 是要传递的数据
  state = {
    counter: 0
  }
	
	// add 方法可以修改状态
  add = () => {
    this.setState({ counter: this.state.counter + 1 })
  }

  render() {
    return (
      <Provider value={{ counter: this.state.counter, add: this.add }}>
        <Consumer>{ value => <Child {...value}></Child> }</Consumer>
        <Consumer>{ value => <Child {...value}></Child> }</Consumer>
        <Consumer>{ value => <Child {...value}></Child> }</Consumer>
      </Provider>
    )
  }
}

```

## 高阶组件-HOC

[HOC参考](https://reactjs.org/docs/higher-order-components.html)

高阶组件：高阶组件是一个工厂函数，它接收一个组件并返回另一个组件

**范例：为展示组件添加获取数据的能力**

```js
import React from 'react'

// Lesson保证功能单一，它不关心数据来源，只负责显示
function Lesson(props) {
  return (
    <div>
      {props.stage} - {props.title}
    </div>
  )
}

// 模拟数据
const lessons = [
  {
    stage: '高中',
    title: '数学'
  },
  {
    stage: '初中',
    title: '英语'
  },
  {
    stage: '小学',
    title: '语文'
  }
]


// 定义高阶组件 withContent
// 包装后的组件可以根据传入的参数显示组件

// ES5 写法
// function withContent (Comp) {
//   return function (props) {
//     const content = lessons[props.idx]
//     return <Comp {...content}/>
//   }
// }

// ES6 写法
const withContent = Comp => props => {
  const content = lessons[props.idx]
  return <Comp {...content}/>
}

const LessonWithContent = withContent(Lesson)

export default function HOCTest() {
  return (
    <div>
      { [0, 0, 0].map((item, idx) => <LessonWithContent key={idx} idx={idx} />)}
    </div>
  )
}
```

**范例：改造前面案例使上下文使用更优雅**

> 这里和前面的范例有所不同，withConsumer 高阶组件工厂，根据配置返回一个高阶组件，，大家想一想react-redux 里面的 connect 函数是不是和这个很类似。

```js
import React, { Component } from 'react'

// 1、创建上下文对象
const Context = React.createContext()

// 2、获取 Provider 和  Consumer 
const { Provider, Consumer } = Context

function Child(props) {
  return (
    <div onClick={ () => props.add() }>{props.counter}</div>
  )
}


// withConsumer高阶组件工厂，根据配置返回一个高阶组件
const withConsumer = Consumer => {
  return Comp => props => {
    return <Consumer>{ value => <Comp {...value}/>}</Consumer>
  }
}

let ChildWithConsumer = withConsumer(Consumer)(Child)

export default class ContextTest extends Component {

  state = {
    counter: 0
  }

  add = () => {
    this.setState({ counter: this.state.counter + 1 })
  }

  render() {
    return (
      <Provider value={{ counter: this.state.counter, add: this.add }}>
        <ChildWithConsumer />
        <ChildWithConsumer />
        <ChildWithConsumer />
      </Provider>
    )
  }
}

```

### 链式调用

```js
// withLog高阶组件，在组件挂载时输出日志
const withLog = Comp => {
  return class extends React.Component {
    componentDidMount () {
      console.log('componentDidMount', this.props)
    }
    render () {
      return <Comp { ...this.props }/>
    }
  }
}

// 高阶组件的链式调用（层级过多的话，代码可读性会很差，可以使用装饰器语法）
const LessonWithContent = withLog(withContent(Lesson))
```

### 装饰器写法

CRA项目中默认不支持js代码使用装饰器语法，需要安装并配置 @babel/plugin-proposal-decorators 之后才能使用：

```js
// package.json
"babel": {
  "plugins": [
    [
      "@babel/plugin-proposal-decorators",
      {
        "legacy": true
      }
    ]
  ],
  "presets": [
    "react-app"
  ]
},
```

**范例：通过装饰器来使用高阶组件**

```js
// 装饰器
import React, { Component } from 'react'

// 模拟数据
const lessons = [
  {
    stage: '高中',
    title: '数学'
  },
  {
    stage: '初中',
    title: '英语'
  },
  {
    stage: '小学',
    title: '语文'
  }
]

// 定义高阶组件 withContent
// 包装后的组件可以根据传入的参数显示组件
const withContent = Comp => props => {
  const content = lessons[props.idx]
  return <Comp {...content}/>
}

// withLog高阶组件，在组件挂载时输出日志
const withLog = Comp => {
  return class extends React.Component {
    componentDidMount () {
      console.log('componentDidMount', this.props)
    }
    render () {
      return <Comp { ...this.props }/>
    }
  }
}

// 装饰器写法 @withLog @withContent 装饰器语法只能用在 class 组件上
@withLog
@withContent
class Lesson extends Component {
  render() {
    return (
      <div>
        {this.props.stage} - {this.props.title}
      </div>
    )
  }
}

export default function DecoraterTest() {
  return (
    <div>
      { [0, 0, 0].map((item, idx) => <Lesson key={idx} idx={idx} />)}
    </div>
  )
}
```

## **组件复合** **-** **Composition**

组件复合：类似于 Vue 的插槽，具体内容由外部传入

### 普通插槽

范例：Dialog组件负责展示，内容从外部传入即可，components/Composition.js**

```js
// 组件复合：类似于 vue 的插槽，具体内容由外部传入
import React, { Component } from 'react'

function Dialog(props) {
  // props.children：children 是一个合法的 js 表达式
  return (
    <div style={{border: '1px solid #000'}}>
      { props.children }
    </div>

  )
}

export default class Composition extends Component {
  render() {
    return (
      <div>
        <Dialog>
          <h1>组件复合</h1>
          <p>通过组件符合去自定义组件内容</p>
        </Dialog>
      </div>
    )
  }
}
```

### 具名插槽

**范例：传个对象进去，key表示具名插槽**

```js
// 组件复合：类似于 vue 的插槽，具体内容由外部传入
import React, { Component } from 'react'

function Dialog(props) {
  // props.children：children 是一个合法的 js 表达式
  return (
    <div style={{border: '1px solid #000'}}>
      { props.children.def }
      <div>
        { props.children.footer }
      </div>
    </div>

  )
}

export default class Composition extends Component {
  render() {
    return (
      <div>
        <Dialog>
          {
            {
             def: (
                // React.Fragment的速记语法<></>，仅在最新版本（和Babel 7+）中受支持
                <>
                  <h1>组件复合</h1>
                  <p>通过组件符合去自定义组件内容</p>
                </>
              ),
              footer: (
                <button onClick={ () => alert('组件复合') }>确定</button>
              )
            }
          }
        </Dialog>
      </div>
    )
  }
}
```

### 作用域插槽

**范例：传个函数进去，实现作用于插槽的功能**

```js
// 组件复合进阶用法：实现作用域插槽
import React, { Component } from 'react'

function Dialog(props) {
  const message = {
    foo: { title: 'foo', content: 'foo~' },
    bar: { title: 'bar', content: 'bar~' }
  }

  const { def, footer } = props.children(message[props.msg])

  return (
    <div style={{border: '1px solid #000'}}>
      { def }
      <div>
        { footer }
      </div>
    </div>
  )
}

export default class HComposition extends Component {
  render() {
    return (
      <div>
        <Dialog msg="foo">
          {
            ({title, content}) => (
              {
                def: (
                  <>
                    <h1>{title}</h1>
                    <p>{content}</p>
                  </>
                ),
                footer: (
                  <button onClick={ () => alert('组件复合') }>确定</button>
                )
              }
            )
          }
        </Dialog>
      </div>
    )
  }
}
```

### 实现修改 children

如果props.children是jsx，此时它是不能修改的。

**范例：实现RadioGroup和Radio组件，可通过RadioGroup设置Radio的name**

```js
// 组件复合进阶用法：实现修改 children

import React, { Component } from 'react'

function RadioGroup (props) {
  // 如果 props.children是jsx，不能直接修改它
    return (
      <div>
        {
          React.Children.map(props.children, radio => {
            // 要修改虚拟DOM（jsx编译之后的结果），只能克隆后重新设置属性，不能直接修改
            // 参数1：克隆对象
            // 参数2：设置的属性
            return React.cloneElement(radio, { name: props.name })
          })
          // props.children.map(radio => {
          //   return React.cloneElement(radio, { name: props.name })
          // })
        }
      </div>
    )
}

function Radio ({children, ...rest}) {
  return (
    <label>
      <input type="radio" {...rest} />
      { children }
    </label>
  )
}

export default class HComposition extends Component {
  render() {
    return (
      <div>
        <RadioGroup name="mvvm">
          <Radio value="vue">vue</Radio>
          <Radio value="react">react</Radio>
          <Radio value="ng">angular</Radio>
        </RadioGroup>
      </div>
    )
  }
}
```

## Hooks

[Hooks](https://zh-hans.reactjs.org/docs/hooks-intro.html)是React 16.8的新特性，他可以让你在 function 组件中使用 state 以及其他的 React 特性。

Hooks的特点：

- 使你在无需修改组件结构的情况下复用状态逻辑
- 可将组件中相互关联的部分拆分成更小的函数，复杂组件将变得更容易理解
- 更简洁、更易理解代码

Hook 就是 JavaScript 函数，但是使用它们会有两个额外的规则：

- 只能在函数最外层调用 Hook。不要在循环、条件判断或者子函数中调用
- 只能在 React 的函数组件中调用 Hook

### useState

> useState(initialState) 接收初始状态，返回一个由状态和更新函数组成的数组

```js
import React, { useState } from 'react';

// 声明列表组件
function FruitList ({ fruits, onSetFruit }) {
  return (
    <ul>
      { fruits.map(item => <li onClick={ () => onSetFruit(item)} key={item}>{item}</li>) }
    </ul>
  )
}

// 声明输入组件
function FruitAdd (props) {

  const [pname, setPname] = useState("") // 键盘事件处理

  const onAddFruit = e => {
    if (e.key === "Enter") {
      props.onAddFruit(pname); 
      setPname("");
    }
  }

  return (
    <div>
      <input
      placeholder="请输入需要添加的水果"
      type="text"
      value={pname}
      onChange={e => setPname(e.target.value)}
      onKeyDown={onAddFruit}
      />
    </div>
  )
}

export default function HooksTest() {
  // useState(initialState) 接收初始状态，返回一个由状态和更新函数组成的数组
  const [fruit, setFruit] = useState("")
  const [fruits, setFruits] = useState(['香蕉', '草莓', '芒果'])

  return (
    <div>
      <p>{ fruit === "" ? "请选择喜爱的水果" : `你的的选择是：${fruit}` }</p>
      <FruitList fruits={fruits} onSetFruit={setFruit}></FruitList>
      <FruitAdd onAddFruit={pname => setFruits([...fruits, pname])}></FruitAdd>
    </div>
  );
}
```

### useEffect

useEffect 给函数组件增加了执行副作用操作的能力。

副作用（Side Eﬀect）是指一个 function 做了和本身运算、返回值无关的事，比如：修改了全局变量、修改了传入的 参数、甚至是 console.log()，所以 ajax 操作，修改 dom 都是算作副作用。

- 异步获取数据

```js
import { useEffect } from "react";

useEffect(()=>{
   setTimeout(() => {
   		setFruits(['香蕉','西瓜'])
   }, 1000);
},[]) // 设置空数组意为没有依赖，则副作用操作仅执行一次
```

如果副作用对某状态有依赖，需要添加依赖选项

```js
useEffect(() => {
 	document.title = fruit; 
}, [fruit]);
```

- 清除工作：有一些副作用是需要清除的，清除工作非常重要，可以防止内存泄漏

```js
useEffect(() => {
  const timer = setInterval(() => {
    console.log('msg')
  }, 1000)

  // 返回一个清理函数，组件卸载后会执行清理函数
  return function () {
    clearInterval(timer)
  }
})
```

### useReducer

useReducer是useState的可选项，常用于组件有复杂状态逻辑时，类似于redux中reducer概念。

**范例：使用 useReducer 改写上面的代码**

```js
import React, { useState, useEffect, useReducer } from 'react';



function FruitList ({ fruits, onSetFruit }) {
  return (
    <ul>
      { fruits.map(item => <li onClick={ () => onSetFruit(item)} key={item}>{item}</li>) }
    </ul>
  )
}

// 声明输入组件
function FruitAdd (props) {

  const [pname, setPname] = useState("") // 键盘事件处理

  const onAddFruit = e => {
    if (e.key === "Enter") {
      props.onAddFruit(pname); 
      setPname("");
    }
  }
  return (
    <div>
      <input
      placeholder="请输入想要添加的水果"
      type="text"
      value={pname}
      onChange={e => setPname(e.target.value)}
      onKeyDown={onAddFruit}
      />
    </div>
  )
}

// 添加fruit状态维护fruitReducer
function fruitReducer (state, action) {
  switch(action.type) {
    case "init": 
      return action.payload
    case "add": 
      return [...state, action.payload]
    default: 
      return state
  }
}


export default function HooksTest() {
  // useState(initialState) 接收初始状态，返回一个由状态和更新函数组成的数组
  const [fruit, setFruit] = useState("")

  // 接收一个 reducer 和初始值，返回 state 和 dispatch 
  const [fruits, dispatch] = useReducer(fruitReducer, [])

  // useEffect 接收回调函数和一个依赖数组（依赖为空时，useEffect函数只执行一次）
  useEffect(() => {
    setTimeout(() => {
      // setFruits(['香蕉', '草莓', '芒果'])
      dispatch({ type: 'init', payload: ['香蕉', '草莓', '芒果']})
    }, 1000)
  }, [])


  // 如果副作用操作对某状态有依赖，需要添加依赖选项
  useEffect(() => {
    document.title = fruit; }, 
  [fruit]);


  // 清除工作：有一些副作用是需要清除的，清除工作非常重要，可以防止内存泄漏
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('msg')
    }, 1000)

    // 返回一个清理函数，组件卸载后会执行清理函数
    return function () {
      clearInterval(timer)
    }
  })

  return (
    <div>
      <p>{ fruit === "" ? "请选择喜爱的水果" : `你的的选择是：${fruit}` }</p>
      <FruitList fruits={fruits} onSetFruit={setFruit}></FruitList>
      <FruitAdd onAddFruit={pname => dispatch({ type: 'add', payload: pname })}></FruitAdd>
    </div>
  );
}
```

### useContext

useContext用于在快速在函数组件中导入上下文，useContext可以实现组件之间的解耦，复杂组件会更变得更加容易理解。

```js
import React, { useState, useEffect, useReducer, useContext } from 'react';



function FruitList ({ fruits, onSetFruit }) {
  return (
    <ul>
      { fruits.map(item => <li onClick={ () => onSetFruit(item)} key={item}>{item}</li>) }
    </ul>
  )
}

// 声明输入组件
function FruitAdd (props) {

  // 使用 useContent 获取上下文
  const { dispatch } = useContext(Context)

  const [pname, setPname] = useState("") // 键盘事件处理

  const onAddFruit = e => {
    if (e.key === "Enter") {
      // props.onAddFruit(pname); 
      dispatch({ type: 'add', payload: pname })
      setPname("");
    }
  }

  return (
    <div>
      <input
      placeholder="请输入想要添加的水果"
      type="text"
      value={pname}
      onChange={e => setPname(e.target.value)}
      onKeyDown={onAddFruit}
      />
    </div>
  )
}

// 添加fruit状态维护fruitReducer
function fruitReducer (state, action) {
  switch(action.type) {
    case "init": 
      return action.payload
    case "add": 
      return [...state, action.payload]
    default: 
      return state
  }
}

// 创建上下文对象
const Context = React.createContext()

export default function HooksTest() {
  // useState(initialState) 接收初始状态，返回一个由状态和更新函数组成的数组
  const [fruit, setFruit] = useState("")

  // const [fruits, setFruits] = useState([])

  // 接收一个 reducer 和初始值，返回 state 和 dispatch 
  const [fruits, dispatch] = useReducer(fruitReducer, [])

  // useEffect 接收回调函数和一个依赖数组（依赖为空时，useEffect函数只执行一次）
  useEffect(() => {
    setTimeout(() => {
      // setFruits(['香蕉', '草莓', '芒果'])
      dispatch({ type: 'init', payload: ['香蕉', '草莓', '芒果']})
    }, 1000)
  }, [])


  // 如果副作用操作对某状态有依赖，需要添加依赖选项
  useEffect(() => {
    document.title = fruit; }, 
  [fruit]);


  // 清除工作：有一些副作用是需要清除的，清除工作非常重要，可以防止内存泄漏
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('msg')
    }, 1000)

    // 返回一个清理函数，组件卸载后会执行清理函数
    return function () {
      clearInterval(timer)
    }
  })

  return (
    <Context.Provider value={{ fruits, dispatch }}>
      <div>
        <p>{ fruit === "" ? "请选择喜爱的水果" : `你的的选择是：${fruit}` }</p>
        <FruitList fruits={fruits} onSetFruit={setFruit}></FruitList>
        <FruitAdd></FruitAdd>
      </div>
    </Context.Provider>
  );
}
```

