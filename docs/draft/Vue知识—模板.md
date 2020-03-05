

# Vue知识整理—模板

### 模板语法

Vue中最常用的是基于 **HTML 的模板** ，简单的说其标签和HTML标签是一样的，模板语法中插值可以用来实现数据绑定，指令可以实现多种功能，例如：属性绑定、条件渲染、列表渲染、事件处理等。

#### 插值

##### 1.文本

数据绑定最常见的形式就是使用“Mustache”语法 (双大括号) 的文本插值： 

```html
<span>Message: {{ msg }}</span>
```

Mustache 标签将会被替代为对应`data`上 `msg` 属性的值。无论何时，绑定的数据对象上 `msg` 属性发生了改变，插值处的内容都会更新。*需要注意的是，只有当实例被创建时 `data` 中存在的属性才是**响应式**的。* 

##### 2.原始HTML

双大括号会将数据解释为普通文本，而非 HTML 代码。为了输出真正的 HTML，你需要使用 `v-html` 指令：

```html
<p>Using mustaches: {{ rawHtml }}</p>
<p>Using v-html directive: <span v-html="rawHtml"></span></p>
```

```html
data: {
	rawHtml: '<span style="color: red">This should be red.</span>'
}
```

这个 `span` 的内容将会被替换成为属性值 `rawHtml`，直接作为 HTML，同时会忽略rawHtml属性值中的数据绑定。

##### 3.属性

Mustache 语法不能作用在 HTML 属性上，遇到这种情况应该使用 [v-bind 指令](https://cn.vuejs.org/v2/api/#v-bind)，V-bind指令可以用来绑定id、class、style、disabled等属性。

```html
<div v-bind:id="dynamicId"></div>

<button v-bind:disabled="isButtonDisabled">Button</button>
```

如果 `isButtonDisabled` 的值是 `null`、`undefined` 或 `false`，则 `disabled` 属性甚至不会被包含在渲染出来的 `<button>` 元素中。

##### 4.使用Javascript表达式

对于所有的数据绑定，Vue.js 都提供了完全的 JavaScript 表达式支持。

```js
{{ number + 1 }}

{{ ok ? 'YES' : 'NO' }}

{{ message.split('').reverse().join('') }}

<div v-bind:id="'list-' + id"></div>
```

这些表达式会在所属 Vue 实例的数据作用域下作为 JavaScript 被解析。有个限制就是，每个绑定都只能包含**单个表达式**，所以下面的例子都**不会**生效。

```js
<!-- 这是语句，不是表达式 -->
{{ var a = 1 }}

<!-- 流控制也不会生效，请使用三元表达式 -->
{{ if (ok) { return message } }}
```

#### 指令

指令 (Directives) 是带有 `v-` 前缀的特殊属性，指令的职责是，当表达式的值改变时，将其产生的连带影响，响应式地作用于 DOM。 

```html
<p v-if="seen">现在你看到我了</p>
```

这里，`v-if` 指令将根据表达式 `seen` 的值的真假来插入/移除 `<p>` 元素。

##### 1.参数

一些指令能够接收一个“参数”，在指令名称之后以冒号表示。例如，`v-bind` 指令可以用于响应式地更新 HTML 属性：

```html
<a v-bind:href="url">...</a>
```

在这里 `href` 是参数，告知 `v-bind` 指令将该元素的 `href` 属性与表达式 `url` 的值绑定。

另一个例子是 `v-on` 指令，它用于监听 DOM 事件，在这里参数是监听的事件名：

```html
<a v-on:click="doSomething">...</a>
```

##### 2.修饰符

修饰符 (Modifiers) 是以 `.` 指明的特殊后缀，用于指出一个指令应该以特殊方式绑定。例如，`.prevent` 修饰符告诉 `v-on` 指令对于触发的事件调用 `event.preventDefault()`：

```html
<form v-on:submit.prevent="onSubmit">...</form>
```

##### 3.缩写

对于一些频繁用到的指令来说， 如 `v-bind` 和 `v-on` 这两个指令，Vue.提供了特定简写： 

`v-bind` 缩写

```html
<!-- 完整语法 -->
<a v-bind:href="url">...</a>

<!-- 缩写 -->
<a :href="url">...</a>
```

`v-on` 缩写

```html
<!-- 完整语法 -->
<a v-on:click="doSomething">...</a>

<!-- 缩写 -->
<a @click="doSomething">...</a>
```

### [模板的定义的替代品](https://cn.vuejs.org/v2/guide/components-edge-cases.html#X-Templates)

#### 字符串模板

```js
let str=`<div>{{message}}</div>`
let = new Vue({
   el: '#demo',
   data:data,
   template:str
})
```

 字符串模板会**替换** 挂载元素，挂载元素的内容都将被忽略。 

#### X-Templates

另一个定义模板的方式是在一个 `<script>` 元素中，并为其带上 `text/x-template` 的类型，然后通过一个 id 将模板引用过去。例如：

```js
<script type="text/x-template" id="hello-world-template">
  <p>Hello World</p>
</script>
Vue.component('hello-world', {
  template: '#hello-world-template'
})
```

如果值以 `#` 开始，则它将被用作选择符，并使用匹配元素的 innerHTML 作为模板。常用的技巧是用 `<script type="x-template">` 包含模板， 这种方式定义的模板只能在当前组件中使用，在其他组件中无法复用。

