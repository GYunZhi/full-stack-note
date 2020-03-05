## Vue组件化常用技术

### 组件通信

组件通信一般分为以下几种情况：

- 父子组件通信
- 兄弟组件通信
- 跨多层级组件通信
- 任意组件

对于以上每种情况都有多种方式去实现，接下来就来学习下如何实现。

**父子通信**

父组件通过 `props` 传递数据给子组件，子组件通过 `emit` 发送事件传递数据给父组件，这两种方式是最常用的父子通信实现办法。

当然我们还可以通过访问 `$parent` 、 `$children` 、`$refs` 对象来访问组件实例中的方法和数据。

**兄弟组件通信**

对于这种情况可以通过查找父组件中的子组件实现，也就是 `this.$parent.$children`，在 `$children`中可以通过组件 `name` 查询到需要的组件实例，然后进行通信。

**跨多层级组件通信**

对于这种情况可以使用 **Vue 2.2** 新增的 API **provide / inject**，虽然文档中**不推荐直接使用在业务中**，但是如果用得好的话还是很有用的。

假设有父组件 A，然后有一个跨多层级的子组件 B

```javascript
// 父组件 A
export default {
  provide: {
    data: 1
  }
}
// 子组件 B
export default {
  inject: ['data'],
  mounted() {
    // 无论跨几层都能获得父组件的 data 属性
    console.log(this.data) // => 1
  }
}
```

另外也可以自定义dispatch、boardcast方法实现

```javascript
// dispatch 向上传递
Vue.prototype.$dispatch = function (eventName, data) {
  let parent = this.$parent
  // 查找父元素
  while (parent) {
    if (parent) {
      // 父元素用$emit触发
      parent.$emit(eventName, data)
      // 递归查找父元素
      parent = parent.$parent
    } else {
      break
    }
  }
};

// boardcast 向下传递
Vue.prototype.$boardcast = function (eventName, data) {
  boardcast.call(this, eventName, data)
};

function boardcast(eventName, data) {
  this.$children.forEach(child => {
    // 子元素触发$emit
    child.$emit(eventName, data)
    if (child.$children.length) {
      // 递归调用，通过call修改this指向 child
      boardcast.call(child, eventName, data)
    }
  })
}
```

**任意组件通信**

这种方式可以通过 Vuex 或者 Event Bus（事件总线） 解决，另外如果你不怕麻烦的话，可以使用这种方式解决上述所有的通信情况

```javascript
// Event Bus
class Bus {
  constructor() {
    // {
    //   eventName1:[fn1,fn2],
    //   eventName2:[fn3,fn4],
    // }
    this.callbacks = {}
  }
  $on(name, fn) {
    this.callbacks[name] = this.callbacks[name] || []
    this.callbacks[name].push(fn)
  }
  $emit(name, args) {
    if (this.callbacks[name]) {
      // 存在 遍历所有callback
      this.callbacks[name].forEach(cb => cb(args))
    }
  }
}

// 可以使用 Vue 替代 Bus 类，因为它已经实现了相应的功能
Vue.prototype.$bus = new Bus()
```

### 插槽

Vue2.6.0 之后采用全新v-slot语法取代之前的slot、slot-scope

```vue
<!-- 旧语法 -->
<Comp1>默认插槽</Comp1>

<Comp2>
  <div>默认插槽</div>
  <!-- slot="插槽名" -->
  <template slot="content">content 插槽</template>
</Comp2>

<Comp3>
  <!-- slot-scope="作用域上下文" -->
  <template slot-scope="ctx">来自子组件数据：{{ctx.foo}}</template>
</Comp3>

<!-- 2.6.0 新语法 -->
<!--
在 2.6.0 中，我们为具名插槽和作用域插槽引入了一个新的统一的语法 (即 v-slot 指令)。
它取代了 slot 和 slot-scope属性。

在向具名插槽提供内容的时候，我们可以在一个 <template> 元素上使用 v-slot 指令，并
以 v-slot:name 的参数的形式提供其名称。

一个不带 name 的 <slot> 插槽会带有默认的名字“default”。

任何没有被包裹在带有 v-slot 的 <template> 中的内容都会被视为默认插槽的内容。

推荐为所有的插槽使用完整的基于 <template v-slot:default> 的语法。
-->
<Comp1>默认插槽</Comp1>

<Comp2>
  <!-- 默认插槽用default -->
  <template v-slot:default>默认插槽</template>

  <!-- v-slot:插槽名 -->
  <template v-slot:content>content 插槽</template>
</Comp2>

<Comp3>
  <!-- v-slot:插槽名="作用域上下文" -->
  <template v-slot:default="ctx">来自子组件数据：{{ctx.foo}}</template>
</Comp3>
```

### 递归组件

- 递归组件必须要有结束条件
- name对递归组件时必要的（递归组件调用自己不需要注册，需要提供name）

```html
<template>
  <div>
    <Node :data="data"></Node>
  </div>
</template>

<script>
import Node from "./Node.vue";

export default {
  data() {
    return {
      data: {
        id: "1",
        title: "递归组件",
        children: [
          { id: "1-1", title: "使用方法" },
          { id: "1-2", title: "注意事项" }
        ]
      }
    };
  },
  components: {
    Node
  }
};
</script>


// Node.vue
<template>
  <div>
    <h3>{{data.title}}</h3>
    <!-- 必须有结束条件，这里的 v-for 可以作为结束条件 -->
    <Node v-for="d in data.children" :key="d.id" :data="d"></Node>
  </div>
</template>

<script>
export default {
  name: "Node", // name对递归组件是必要的
  props: {
    data: {
      type: Object,
      require: true
    }
  }
};
</script>
```

### v-model 和 .sync

#### v-model

```vue
<!-- v-model是语法糖 -->
<input v-model="username">

<!-- 默认等效于下面这行 -->
<input :value="username" @input="username = $event.target.value">

<!-- v-model是语法糖 -->
<input type="checkbox" v-model="check">

<!-- 默认等效于下面这行-->
<input type="checkbox" :checked="check" @change="check = $event.target.checked">
```

**自定义 input 组件**

```vue
<template>
  <input type="text" :value="value" @input="$emit('input', $event.target.value)">
</template>

<script>
export default {
  name: 'c-input',
  // 默认，不需要写
  // model: {
  //   prop: 'value',
  //   event: 'input'
  // }
  props: {
    value: String
  }
}
</script>

<style>

</style>
```

**自定义 checkbox 组件**

```vue
<template>
  <div>
    <input type="checkbox" :checked="checked" @change="$emit('change', $event.target.checked)">
  </div>
</template>

<script>
export default {
  name: 'c-checkbox',
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: Boolean
  }
}
</script>

<style>

</style>
```

#### .sync

```vue
<c-input-sync :value.sync="username"></c-input-sync>

<c-input-sync :value="username" @update:value="username = $event"></c-input-sync>

<!-- 这里绑定属性名称可以随意更改，update 相应的属性名也会变化 -->
<c-input-sync :foo="username" @update:foo="username = $event"></c-input-sync>
```

```vue
<template>
  <input type="text" :value="value" @input="$emit('update:value', $event.target.value)" />
</template>

<script>
export default {
  name: 'c-input-sync',
  props: {
    value: String
  }
}
</script>

<style>

</style>
```

## 自定义表单组件

[inheritAttrs](https://cn.vuejs.org/v2/api/#inheritAttrs)：默认情况下父组件中不被认作 props 的特性绑定将会“回退”且作为普通的 HTML 特性应用在子组件的根元素上，通过设置 `inheritAttrs: false `，就不会绑定到根元素上。

[$attrs](https://cn.vuejs.org/v2/api/#vm-attrs)： 包含了父组件中不作为 prop 被识别 (且获取) 的特性绑定 (class 和 style 除外)。 使用 `v-bind="$attrs"` 这些属性会可以直接绑定到非根元素上。

```vue
<c-input v-model="model.username" autocomplete="off" placeholder="输入用户名"></c-input>
```

```vue
<template>
  <div>
    <input :value="value" @input="onInput" v-bind="$attrs">
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  methods: {
    onInput(e) {
      this.$emit("input", e.target.value);

      this.$parent.$emit("validate");
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

```

## 自定义弹框组件

弹框组件通常在当前 vue 实例之外独立存在，通常挂载于 body 上，通过 js 动态创建，不需要再任何组件中声明，可以使用**单例模式**，避免重复创建。

> 思考：使用单例模式处理弹框组件

```javascript
import Vue from 'vue';

// create.js 作用是把传递的组件配置（对象）转换为组件实例返回
export default function create(Component, props) {
  // 先创建Vue实例
  const vm = new Vue({
    // render 方法会调用 h 方法创建虚拟DOM
    render(h) {
      // h就是createElement，它返回 VNode
      return h(Component, {
        props
      })
    }
  }).$mount(); 
  
  // $mount里面会调render生成VNode，生成的VNode会执行update函数生成DOM

  // $mount('body') 直接把 body 作为挂载元素会抛错

  // 手动挂载: vm.$el是真实DOM
  document.body.appendChild(vm.$el);

  // 销毁方法 vm.$children vue实例下的 $children[0] | vm.$root 就是我们创建的组件实例
  const comp = vm.$children[0];
  comp.remove = function () {
    document.body.removeChild(vm.$el);
    vm.$destroy();
  }
  return comp;
}

```

## 自定义Tree组件

```vue
<template>
  <li>
    <div @click="toggle">
      {{model.title}}
      <span v-if="isFolder">[{{open ? '-' : '+'}}]</span>
    </div>
    <ul v-show="open" v-if="isFolder">
      <item 
            class="item" 
            v-for="model in model.children" 
            :model="model" :key="model.title">
  		</item>
    </ul>
  </li>
</template>

<script>
export default {
  name: "item", // name对递归组件是必要的
  props: {
    model: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      open: false
    };
  },
  computed: {
    // 递归组件必须要有结束条件
    isFolder() {
      return this.model.children && this.model.children.length;
    }
  },
  methods: {
    toggle() {
      if (this.isFolder) {
        this.open = !this.open;
      }
    }
  }
};
</script>
```

 