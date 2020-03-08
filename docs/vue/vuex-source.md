下面是一段简单的代码，通过这段代码分析一下如何去实现一个自己的 vuex

```js
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: { count: 0 },
  mutations: {
    increment(state, n = 1) {
      state.count += n;
    }
  },
  getters: {
    score(state) {
      return `共扔出：${state.count}`
    }
  },
  actions: {
    incrementAsync({ commit }) {
      setTimeout(() => {
        commit("increment", 2);
      }, 1000);
    }
  }
});

```

经过分析我们得出 Vuex 需要满足下面四个基本功能

- 作为 Vue 插件 — 实现 install 方法
- 实现：state、mutations、actions、getters
- Store 类
- 数据响应式

## 实现插件功能

这里与 Vue Router 中的 install 方法类似，不同的地方在于我们不再全局引入 Vue，之前的代码也可以同样处理

```js
let Vue;

// 实现 install 方法
function install(_Vue) {
  // 这里和 Vue Router 代码略有不同，不在全局引入 Vue
  Vue = _Vue;
  // 全局混入
  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store;
      }
    }
  });
}
```

## 创建 Store 类

```js
class Store {
  constructor(options) {
    this.state = new Vue({
      data: options.state
    });

    this.mutations = options.mutations;

    this.actions = options.actions;

    options.getters && this.handleGetters(options.getters);
  }

  // 声明为箭头函数，保留 commit 中 this 的指向
  commit = (type, args) => {
    this.mutations[type](this.state, args);
  };

  dispatch (type, args) {
    this.actions[type](
      {
        commit: this.commit,
        state: this.state
      },
      args
    );
  }

  handleGetters(getters) {
    this.getters = {};
    // 遍历 getters 所有 key
    Object.keys(getters).forEach(key => {
      // 为 this.getters 定义若干属性，这些属性是只读的
      // $store.getters.score
      Object.defineProperty(this.getters, key, {
        get: () => {
          return getters[key](this.state);
        }
      });
    });
  }
}

export default { Store, install };
```

## 思考解答

> 思考：为什么 Store 类中的 commit 方法声明为箭头函数？

```js
// Store 类中的 commit 方法声明为箭头函数是为了保证 this 指向 store，避免下面的情况导致报错
actions: {
    incrementAsync({ commit }) {
      setTimeout(() => {
        commit("increment", 2); // 此处 commit 方法 中 this 指向的是 window
      }, 1000);
    }
  }
```

## 完整代码

```js
let Vue;

class Store {
  constructor(options) {
    this.state = new Vue({
      data: options.state
    });

    this.mutations = options.mutations;

    this.actions = options.actions;

    options.getters && this.handleGetters(options.getters);
  }

  // 声明为箭头函数，保留 commit 中 this 的指向
  commit = (type, args) => {
    this.mutations[type](this.state, args);
  };

  dispatch (type, args) {
    this.actions[type](
      {
        commit: this.commit,
        state: this.state
      },
      args
    );
  }

  handleGetters(getters) {
    this.getters = {};
    // 遍历 getters 所有 key
    Object.keys(getters).forEach(key => {
      // 为 this.getters 定义若干属性，且这些属性是只读的
      // $store.getters.score
      Object.defineProperty(this.getters, key, {
        get: () => {
          return getters[key](this.state);
        }
      });
    });
  }
}

// 实现 install 方法
function install(_Vue) {
  // 这里和 Vue Router 代码略有不同，不在全局引入 Vue
  Vue = _Vue;
  // 全局混入
  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store;
      }
    }
  });
}

export default { Store, install };
```

