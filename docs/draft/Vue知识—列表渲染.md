# Vue知识整理—列表渲染

在实际开发过程中，我们的通过接口拿到数据，然后通过`v-for`指令渲染在页面中，整个过程非常简单。但有些时候我们会对数据进行增、删、改、查操作，在开发过程中，大部分人会认为，数据改变了，视图会自动更新。问题在于，有一些数组、对象的更新操作，并不会触发视图的更新。

### [数组更新检测](https://cn.vuejs.org/v2/guide/list.html#数组更新检测)

#### 1.变异方法

Vue 包含一组观察数组的变异方法，当我们调用这些方法改变数组的时候，视图会自动更新。

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

#### 2.非变异方法

**变异方法 (mutation method)，顾名思义，会改变被这些方法调用的原始数组。**相比之下，也有非变异 (non-mutating method) 方法，例如：`filter()`, `concat()` 和 `slice()` 。这些不会改变原始数组，但**总是返回一个新数组**。当使用非变异方法时，可以用新数组替换旧数组，从而触发视图更新：

```
example1.items = example1.items.filter(function (item) {
  return item.message.match(/Foo/)
})
```

你可能认为这将导致 Vue 丢弃现有 DOM 并重新渲染整个列表。幸运的是，事实并非如此。Vue 为了使得 DOM 元素得到最大范围的重用而实现了一些智能的、启发式的方法，所以用一个含有相同元素的数组去替换原来的数组是非常高效的操作。

#### 3.注意事项

由于 JavaScript 的限制，Vue 不能检测以下变动的数组：

1. 当你利用索引直接设置一个项时，例如：`vm.items[indexOfItem] = newValue`
2. 当你修改数组的长度时，例如：`vm.items.length = newLength`

举个例子：

```
var vm = new Vue({
  data: {
    items: ['a', 'b', 'c']
  }
})
vm.items[1] = 'x' // 不是响应性的
vm.items.length = 2 // 不是响应性的

```

为了解决第一类问题，以下两种方式都可以实现和 `vm.items[indexOfItem] = newValue` 相同的效果，同时也将触发状态更新：

```
// Vue.set
Vue.set(vm.items, indexOfItem, newValue)

```

```
// Array.prototype.splice
vm.items.splice(indexOfItem, 1, newValue)
```

你也可以使用 [`vm.$set`](https://vuejs.org/v2/api/#vm-set) 实例方法，该方法是全局方法 `Vue.set` 的一个别名：

```
vm.$set(vm.items, indexOfItem, newValue)

```

为了解决第二类问题，你可以使用 `splice`：

```
vm.items.splice(newLength)
```

### 对象更新检测的注意事项

还是由于 JavaScript 的限制，**Vue 不能检测对象属性的添加或删除**：

```
var vm = new Vue({
  data: {
    a: 1
  }
})
// `vm.a` 现在是响应式的

vm.b = 2
// `vm.b` 不是响应式的

```

对于已经创建的实例，Vue 不能动态添加根级别的响应式属性。但是，可以使用 `Vue.set(object, key, value)` 方法向嵌套对象添加响应式属性。例如，对于：

```
var vm = new Vue({
  data: {
    userProfile: {
      name: 'Anika'
    }
  }
})

```

你可以添加一个新的 `age` 属性到嵌套的 `userProfile` 对象：

```
Vue.set(vm.userProfile, 'age', 27)

```

你还可以使用 `vm.$set` 实例方法，它只是全局 `Vue.set` 的别名：

```
vm.$set(vm.userProfile, 'age', 27)

```

有时你可能需要为已有对象赋予多个新属性，比如使用 `Object.assign()` 或 `_.extend()`。在这种情况下，你应该用两个对象的属性创建一个新的对象。所以，如果你想添加新的响应式属性，不要像这样：

```
Object.assign(vm.userProfile, {
  age: 27,
  favoriteColor: 'Vue Green'
})

```

你应该这样做：

```
vm.userProfile = Object.assign({}, vm.userProfile, {
  age: 27,
  favoriteColor: 'Vue Green'
})
```

### 显示过滤/排序结果

有时，我们想要显示一个数组的过滤或排序副本，而不实际改变或重置原始数据。在这种情况下，可以创建返回过滤或排序数组的计算属性。

例如：

```
<li v-for="n in evenNumbers">{{ n }}</li>
```

```
data: {
  numbers: [ 1, 2, 3, 4, 5 ]
},
computed: {
  evenNumbers: function () {
    return this.numbers.filter(function (number) {
      return number % 2 === 0
    })
  }
}
```

在计算属性不适用的情况下 (例如，在嵌套 `v-for` 循环中) 你可以使用一个 method 方法：

```
<li v-for="n in even(numbers)">{{ n }}</li>
```

```
data: {
  numbers: [ 1, 2, 3, 4, 5 ]
},
methods: {
  even: function (numbers) {
    return numbers.filter(function (number) {
      return number % 2 === 0
    })
  }
}
```

### 一段取值范围的 `v-for`

`v-for` 也可以取整数。在这种情况下，它将重复多次模板。

```
<div>
  <span v-for="n in 10">{{ n }} </span>
</div>
```

但我们只想循环数组中前n个数组元素的时候，我们可以配合`v-if`一起使用，`v-for` 的优先级比 `v-if` 更高，这意味着 `v-if` 将分别重复运行于每个 `v-for` 循环中。当你想为仅有的*一些*项渲染节点时，这种优先级的机制会十分有用，如下：

```
<li v-for="(item, index) in dataList" v-if="index<n">
  {{ item }}
</li>
```

上面的`v-for`只循环了`index < n`的数组项

而如果你的目的是有条件地跳过循环的执行，那么可以将 `v-if` 置于外层元素 或`<template>`上，此时可以把一个 `<template>` 元素当做不可见的包裹元素，并在上面使用 `v-if`。最终的渲染结果将不包含 `<template>` 元素。如：

```
<ul v-if="todos.length">
  <li v-for="todo in todos">
    {{ todo }}
  </li>
</ul>
<p v-else>No todos left!</p>
```

### [组件的 `v-for`](https://cn.vuejs.org/v2/guide/list.html#一个组件的-v-for)

在自定义组件里，你可以像任何普通元素一样用 `v-for` 。

```
<my-component v-for="item in items" :key="item.id"></my-component>
```

然而，任何数据都不会被自动传递到组件里，因为组件有自己独立的作用域。为了把迭代数据传递到组件里，我们要用 `props` ，手动把数据传入到组件中：

```
<my-component
  v-for="(item, index) in items"
  v-bind:item="item"
  v-bind:index="index"
  v-bind:key="item.id"
></my-component>

```

不自动将 `item` 注入到组件里的原因是，这会使得组件与 `v-for` 的运作紧密耦合。明确组件数据的来源能够使组件在其他场合重复使用。

下面是一个简单的 todo list 的完整例子：

```
<div id="todo-list-example">
  <form v-on:submit.prevent="addNewTodo">
    <label for="new-todo">Add a todo</label>
    <input
      v-model="newTodoText"
      id="new-todo"
      placeholder="E.g. Feed the cat"
    >
    <button>Add</button>
  </form>
  <ul>
    <li
      is="todo-item"
      v-for="(todo, index) in todos"
      v-bind:key="todo.id"
      v-bind:title="todo.title"
      v-on:remove="todos.splice(index, 1)"
    ></li>
  </ul>
</div>

```

**注意这里的 `is="todo-item"` 属性。这种做法在使用 DOM 模板时是十分必要的，因为在 `<ul>` 元素内只有 `<li>` 元素会被看作有效内容。**这样做实现的效果与 `<todo-item>` 相同，但是可以避开一些潜在的浏览器解析错误。查看 [DOM 模板解析说明](https://cn.vuejs.org/v2/guide/components.html#解析-DOM-模板时的注意事项) 来了解更多信息。

```
Vue.component('todo-item', {
  template: '\
    <li>\
      {{ title }}\
      <button v-on:click="$emit(\'remove\')">Remove</button>\
    </li>\
  ',
  props: ['title']
})

new Vue({
  el: '#todo-list-example',
  data: {
    newTodoText: '',
    todos: [
      {
        id: 1,
        title: 'Do the dishes',
      },
      {
        id: 2,
        title: 'Take out the trash',
      },
      {
        id: 3,
        title: 'Mow the lawn'
      }
    ],
    nextTodoId: 4
  },
  methods: {
    addNewTodo: function () {
      this.todos.push({
        id: this.nextTodoId++,
        title: this.newTodoText
      })
      this.newTodoText = ''
    }
  }
})
```