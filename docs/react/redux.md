## 案例项目

```bash
为了方便讲解，我写了一个 demo，请先安装一下
$ git clone https://github.com/GYunZhi/cnode.git
$ cd cnode && yarn
$ yarn start
```

## 三大原则

**Redux 可以用这三个基本原则来描述：**

### 单一数据源

**整个应用的 state 被储存在一棵 object tree 中，并且这个 object tree 只存在于唯一一个 store 中。**

这让同构应用开发变得非常容易。来自服务端的  state 可以在无需编写更多代码的情况下被序列化并注入到客户端中。由于是单一的 state tree  ，调试也变得非常容易。在开发中，你可以把应用的 state 保存在本地，从而加快开发速度。此外，受益于单一的 state tree  ，以前难以实现的如“撤销/重做”这类功能也变得轻而易举。

```javascript
console.log(store.getState())

/* 输出
{
  visibilityFilter: 'SHOW_ALL',
  todos: [
    {
      text: 'Consider using Redux',
      completed: true,
    },
    {
      text: 'Keep all state in a single tree',
      completed: false
    }
  ]
}
*／
```

### State 是只读的

**唯一改变 state 的方法就是触发 action，action 是一个用于描述已发生事件的普通对象。**

这样确保了视图和网络请求都不能直接修改  state，相反它们只能表达想要修改的意图。因为所有的修改都被集中化处理，且严格按照一个接一个的顺序执行，因此不用担心 race  condition 的出现。 Action 就是普通对象而已，因此它们可以被日志打印、序列化、储存、后期调试或测试时回放出来。

```javascript
store.dispatch({
  type: 'COMPLETE_TODO',
  index: 1
})

store.dispatch({
  type: 'SET_VISIBILITY_FILTER',
  filter: 'SHOW_COMPLETED'
})
```

### 使用纯函数来执行修改

**为了描述 action 如何改变 state tree ，你需要编写 reducers。**

Reducer  只是一些纯函数，它接收先前的 state 和 action，并返回新的 state。刚开始你可以只有一个  reducer，随着应用变大，你可以把它拆成多个小的 reducers，分别独立地操作 state tree 的不同部分，因为 reducer  只是函数，你可以控制它们被调用的顺序，传入附加数据，甚至编写可复用的 reducer 来处理一些通用任务，如分页器。` `

```javascript
function visibilityFilter(state = 'SHOW_ALL', action) {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter
    default:
      return state
  }
}

function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ]
    case 'COMPLETE_TODO':
      return state.map((todo, index) => {
        if (index === action.index) {
          return Object.assign({}, todo, {
            completed: true
          })
        }
        return todo
      })
    default:
      return state
  }
}
import { combineReducers, createStore } from 'redux'
let reducer = combineReducers({ visibilityFilter, todos })
let store = createStore(reducer)
```

就是这样，现在你应该明白 Redux 是怎么回事了。

## 基本概念

redux中有三个基本概念，Action，Reducer，Store。

### Action

**官方的介绍：**

Actions  are payloads of information that send data from your application to  your store. They are the only source of information for the store. You  send them to the store using store.dispatch().

**中文：**

Actions 是把数据从应用传到 store 的有效载荷。它是 store 数据的唯一来源。用法是通过 store.dispatch() 把 action 传到 store。

**总结：**

Action 有两个作用。

1. 用Action来分辨具体的执行动作。比如是create ?还是delete？或者是update？
2. 操作数据首先得有数据。比如添加数据得有数据，删除数据得有ID,action携带了这些数据。

### Reducer

**官方的介绍：**

Actions  describe the fact that something happened, but don’t specify how the  application’s state changes in response. This is the job of a reducer.

**中文：**

Action 只是描述了有事情发生了这一事实，并没有指明应用如何更新 state。这是 reducer 要做的事情。

**总结：**

Action就像leader，告诉我们应该做哪些事，并且提供数据，真正干活的是苦逼的Reducer。

### Store

一个应用只有一个Store。一个应用只有一个Store。一个应用只有一个Store。

重要的事情放在前面说，而且说三遍。

**官方的介绍：**

In  the previous sections, we defined the actions that represent the facts  about “what happened” and the reducers that update the state according  to those actions.

The Store is the object that brings them together. The store has the following responsibilities:

- Holds application state;
- Allows access to state via getState();
- Allows state to be updated via dispatch(action);
- Registers listeners via subscribe(listener).

**翻译成中文：**

上面章节中，我们学会了使用 action 来描述“发生了什么”，和使用 reducers 来根据 action 更新 state 的用法。

Store 就是把它们联系到一起的对象。Store 有以下职责：

- 保存应用的 state；
- 提供 getState() 方法获取 state；
- 提供 dispatch(action) 方法更新 state；
- 通过 subscribe(listener) 注册监听器。

**总结：**

Store提供了一些方法。让我们很方便的操作数据。

我们不用关心Reducer和Action是怎么关联在一起的，Store已经帮我们做了这些事

### 流程图

![流程图](https://camo.githubusercontent.com/76224d874f32535aa62c0cd01750fb71fb02cf53/687474703a2f2f70362e7168696d672e636f6d2f642f696e6e2f39613331326463632f7265647578466c6f772e706e67)

 

## 详细介绍

这部分主要讲解redux如何在项目中使用。

### Action

Action 是一个普通对象。

redux约定 Action 内使用一个字符串类型的 `type` 字段来表示将要执行的动作。

```javascript
{
  type: 'ADD_ITEM'
}
```

除了 `type` 之外，Action可以存放一些其他的想要操作的数据。例如：

```javascript
{
  type: 'ADD_ITEM',
  text: '我是Berwin'
}
```

上面例子表示

1. 我要创建一条数据
2. 创建的数据为大概是这样的

```javascript
{
  text: '我是Berwin'
}
```

但在实际应用中，我们需要一个函数来为我们创建Action。这个函数叫做actionCreator。它看起来是这样的：

```javascript
function addItem(text) {
  return {
    type: types.ADD_ITEM,
    text
  }
}
```

### Reducer

Reducer 是一个普通的回调函数，其函数签名为reducer(previousState, action)。

当它被Redux调用的时候会为他传递两个参数`State` 和 `Action`。

Reducer会根据 `Action` 的type来对旧的 `State` 进行操作,返回新的State。

看起来是下面这样的：

```javascript
const action = {
  type: 'ADD_TODO',
  text: 'Learn Redux'
};
```

Reducer很简单，但有三点需要注意

1. 不要修改 `state`。
2. 在 default 情况下返回旧的 state。遇到未知的 action 时，一定要返回旧的 state。
3. 如果没有旧的State，就返回一个initialState，这很重要！！！

**这是一部分核心源码：**

```javascript
// currentState 是当前的State，currentReducer 是当前的Reducer
currentState = currentReducer(currentState, action);
```

如果在default或没有传入旧State的情况下不返回旧的State或initialState,那么当前的State会被重置为undefined！！

在使用combineReducers方法时，它也会检测你的函数写的是否标准。如果不标准，那么会抛出一个大大的错误！！

**combineReducers**

真正开发项目的时候`State`会涉及很多功能，在一个`Reducer`处理所有逻辑会非常混乱，，所以需要拆分成多个小`Reducer`，每个`Reducer`只处理它管理的那部分State数据。然后在由一个主`rootReducers`来专门管理这些小`Reducer`。

Redux提供了一个方法 `combineReducers` 专门来管理这些小Reducer。

它看起来是下面这样：

```javascript
/**
 * 这是一个子Reducer
 * @param State
 * @param Action
 * @return new State
 */
let list = (state = [], action) => {
  switch (action.type) {
    case ADD_ITEM:
      return [createItem(action.text), ...state]
    default:
      return state
  }
}

// 这是一个简单版的子Reducer，它什么都没有做。
let category = (state = {}, action) => state;

/**
 * 这是一个主Reducer
 * @param State
 * @param Action
 * @return new State
 */
let rootReducers = combineReducers({list, category});
```

`combineReducers` 生成了一个类似于Reducer的函数。为什么是类似于，因为它不是真正的Reducer，它只是一个调用Reducer的函数，只不过它接收的参数与真正的Reducer一模一样~

**这是一部分核心源码：**

```javascript
function combineReducers(reducers) {
  // 过滤reducers，把非function类型的过滤掉
  var finalReducers = pick(reducers, (val) => typeof val === 'function');

  // 一开始我一直以为这个没啥用，后来我发现，这个函数太重要了。它在一开始，就已经把你的State改变了。变成了，Reducer的key 和 Reducer返回的initState组合。
  var defaultState = mapValues(finalReducers, () => undefined);

  return function combination(state = defaultState, action) {
      // finalReducers 是 reducers
      var finalState = mapValues(finalReducers, (reducer, key) => {

      // state[key] 是当前Reducer所对应的State，可以理解为当前的State
      var previousStateForKey = state[key];
      var nextStateForKey = reducer(previousStateForKey, action);

      return nextStateForKey;      
  });
      // finalState 是 Reducer的key和stat的组合。。
  }
}
```

从上面的源码可以看出，combineReducers 生成一个类似于Reducer的函数`combination`。

当使用combination的时候，combination会把所有子Reducer都执行一遍，子Reducer通过action.type  匹配操作，因为是执行所有子Reducer，所以如果两个子Reducer匹配的action.type是一样的，那么都会成功匹配。

### Store

上面已经介绍什么是Store，以及它是干什么的，这里我就讲讲如何创建Store，以及如何使用Store的方法。

创建Store非常简单。createStore 有两个参数，Reducer 和 initialState。

```javascript
let store = createStore(rootReducers, initialState);
```

store有四个方法。

1. getState： 获取应用当前State。
2. subscribe：添加一个变化监听器。
3. dispatch：分发 action。修改State。
4. replaceReducer：替换 store 当前用来处理 state 的 reducer。

常用的是dispatch，这是修改State的唯一途径，使用起来也非常简单，他看起来是这样的~

```javascript
/**
 * 创建Action
 * @param 添加的数据
 * @return {Object} Action
 */
function addItem(text) {
  return {
    type: types.ADD_ITEM,
    text
  }
}

// 新增数据
store.dispatch(addItem('Read the docs'));
```

**这是一部分核心源码：**

```javascript
function dispatch(action) {
  // currentReducer 是当前的Reducer
  currentState = currentReducer(currentState, action);

  listeners.slice().forEach(function (listener) {
    return listener();
  });

  return action;
}
```

可以看到其实就是把当前的Reducer执行了。并且传入State和Action。

State哪来的？

State其实一直在Redux内部保存着。并且每次执行currentReducer都会更新。在上面代码第一行可以看到。

## React-Redux

Redux 是独立的，它与React没有任何关系。React-Redux是官方提供的一个库，用来结合redux和react的模块。

React-Redux提供了两个接口`Provider`、`connect`。

### Provider

Provider是一个React组件，它的作用是保存store给子组件中的connect使用。

1. 通过getChildContext方法把store保存到context里。
2. 后面connect中会通过context读取store。

它看起来是这个样子的：

```javascript
<Provider store={this.props.store}>
  <h1>Hello World!</h1>
</Provider>
```

**这是一部分核心源码：**

```javascript
getChildContext() {
  return { store: this.store }
}

constructor(props, context) {
  super(props, context)
  this.store = props.store
}
```

可以看到，先获取store，然后用 getChildContext 把store保存起来~

### connect

connect 会把State和dispatch转换成props传递给子组件。它看起来是下面这样的：

```javascript
import * as actionCreators from './actionCreators'
import { bindActionCreators } from 'redux'

function mapStateToProps(state) {
  return { todos: state.todos }
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actionCreators, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
```

它会让我们传递一些参数：mapStateToProps，mapDispatchToProps，mergeProps（可不填）和React组件。

之后这个方法会进行一系列的黑魔法，把state，dispatch转换成props传到React组件上，返回给我们使用。

**mapStateToProps：**

mapStateToProps 是一个普通的函数。

当它被connect调用的时候会为它传递一个参数State。

mapStateToProps需要负责的事情就是   返回需要传递给子组件的State，返回需要传递给子组件的State，返回需要传递给子组件的State，（重要的事情说三遍。。。。）然后connect会拿到返回的数据写入到react组件中，然后组件中就可以通过props读取数据啦~~~~

它看起来是这样的：

```javascript
function mapStateToProps(state) {
  return { list: state.list }
}
```

因为stat是全局State，里面包含整个项目的所有State，但是我不需要拿到所有State，我只拿到我需要的那部分State即可，所以需要返回 state.list 传递给组件

**mapDispatchToProps：**

与mapStateToProps很像，mapDispatchToProps也是一个普通的函数。

当它被connect调用的时候会为它传递一个参数dispatch。

mapDispatchToProps负责返回一个 `dispatchProps`

`dispatchProps` 是actionCreator的key和dispatch(action)的组合。

`dispatchProps` 看起来长这样：

```javascript
{
  addItem: (text) => dispatch(action)
}
```

connect 收到这样的数据后，会把它放到React组件上。然后子组件就可以通过props拿到addItem并且使用啦。

```javascript
this.props.addItem('Hello World~');
```

如果觉得复杂，不好理解，，那我用大白话描述一下

就是通过mapDispatchToProps这个方法，把actionCreator变成方法赋值到props，每当调用这个方法，就会更新State。。。。额，，这么说应该好理解了。。

**bindActionCreators：**

但如果我有很多个Action，总不能手动一个一个加。Redux提供了一个方法叫 `bindActionCreators`。

`bindActionCreators` 的作用就是将 `Actions` 和 `dispatch` 组合起来生成 `mapDispatchToProps` 需要生成的内容。

它看起来像这样：

```javascript
let actions = {
  addItem: (text) => {
    type: types.ADD_ITEM,
    text
  }
}

bindActionCreators(actions, dispatch); // @return {addItem: (text) => dispatch({ type: types.ADD_ITEM, text })}
```

**这是一部分核心源码：**

```
function bindActionCreator(actionCreator, dispatch) {
  return (...args) => dispatch(actionCreator(...args));
}

// mapValues： map第一个参数的每一项，返回对象，key是key，value是第二个参数返回的数据

/*
 * mapValues： map第一个参数的每一项，返回对象，key是key，value是第二个参数返回的数据
 * @param actionCreators
 * @param dispatch
 * @return {actionKey: (...args) => dispatch(actionCreator(...args))}
 */
export default function bindActionCreators(actionCreators, dispatch) {
  return mapValues(actionCreators, actionCreator =>
    bindActionCreator(actionCreator, dispatch)
  );
}
```

可以看到，`bindActionCreators` 执行这个方法之后，它把 `actionCreators` 的每一项的 `key` 不变，`value` 变成 `dispatch(actionCreator(...args))` 这玩意，这表示，`actionCreator` 已经变成了一个可执行的方法，执行这个方法，就会执行 `dispatch` 更新数据。。

**加了React-Redux之后的流程图**

![流程图](https://camo.githubusercontent.com/1d3eb7f2982f8c6982a6e74f1dd6fbe872189845/687474703a2f2f70392e7168696d672e636f6d2f642f696e6e2f61386162336561342f72656163742d72656475782e706e67)

 