下面是一段简单的代码，通过这段代码分析一下如何去实现一个自己的 vue-router，并且思考下面两个问题：

> 思考1：为什么要在创建 vue 实例时指定 router？
>
> 思考2：如何实现 router-view 和 router-link 这两个组件以及这两个组件的作用是什么？

```js
import Vue from 'vue'
import Router from 'vue-router'

const layout = () => import('@/pages/layout')
const home = () => import('@/pages/home')

Vue.use(Router)

const redirect = {
  path: '*',
  redirect: '/'
}

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'layout',
      component: layout,
      redirect: '/home',
      children: [
        {
          path: 'home',
          name: 'home',
          component: home,
          meta: {
            title: '首页',
            noLogin: true
          }
        }
      ]
    },
    redirect
  ]
})

export default router

// login.vue
<router-link :to="{name: 'home'}"></router-link>

// app.vue
<router-view/>

// main.js
import router from './router'

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
```

 经过分析我们得出 Vue Router 需要满足下面四个基本功能：

- 作为 Vue 插件 — 实现 install 方法
- 监听url变化，渲染对应的组件
- 路由配置解析，`{ path: '/', component: 'home'}  =>   '/'  —> home`
- 实现两个全局组件：router-link、route-view

## 实现插件功能

Vue.js 的插件应该暴露一个 `install` 方法。这个方法的第一个参数是 `Vue` 构造器，第二个参数是一个可选的选项对象。

```js
// 实现 install 方法
VueRouter.install = function(Vue) {
  // 全局混入
  Vue.mixin({
    beforeCreate() {
      // this 是 Vue 实例
      if (this.$options.router) {
        // 仅在根组件执行一次
        Vue.prototype.$router = this.$options.router;
        this.$options.router.init();
      }
    }
  });
};
```

## 创建 Router 类

```js
import Vue from "vue";

class VueRouter {
  constructor(options) {
    this.$options = options;
    this.routeMap = {};
    // 通过 Vue 实现路由响应式，所以 Vue Router 只能用于 Vue 中，它们之间是强绑定的
    this.app = new Vue({
      data: {
        current: "/"
      }
    });
  }

  init() {
    this.bindEvents();
    this.createRouteMap(this.$options);
    this.initComponent();
  }

  // 监听url变化，渲染对应的组件
  bindEvents() {
    window.addEventListener("load", this.onHashChange.bind(this));
    window.addEventListener("hashchange", this.onHashChange.bind(this));
  }
    
  // hash 值改变时，current 值也跟着改变 
  onHashChange() {
    this.app.current = window.location.hash.slice(1) || "/";
  }
    
  // 解析路由配置
  createRouteMap(options) {
    options.routes.forEach(item => {
      this.routeMap[item.path] = item.component;
    });
  }
    
  // 实现两个全局组件 router-link、router-view，当组件实例中的 current 变化时，这两个全局组件都会重新渲染
  initComponent() {
    Vue.component("router-link", {
      props: { to: String },
      render(h) {
        // h(tag, data, children)
        return h("a", { attrs: { href: "#" + this.to } }, [
          this.$slots.default
        ]);
      }
    });

    Vue.component("router-view", {
      // 使用箭头函数, 通过 this 获取 routeMap 中对应 current 的组件
      render: h => {
        const comp = this.routeMap[this.app.current];
        return h(comp);
      }
    });
  }
}
```

## 思考解答

```js
// 思考1
保证通过router对象仅在根组件的时候挂载和执行init方法

// 思考2
使用 Vue.component 注册为全局组件

router-link：改变 hash 值，触发浏览器的历史状态管理

route-view：根据 hash 值，渲染对应的组件
```

## 完整代码

```js
import Home from "./views/Home";
import About from "./views/About";
import Vue from "vue";

class VueRouter {
  constructor(options) {
    this.$options = options;
    this.routeMap = {};

    // 通过 Vue 实现路由响应式，所以 Vue Router 只能用于 Vue 中
    this.app = new Vue({
      data: {
        current: "/"
      }
    });
  }

  init() {
    this.bindEvents();
    this.createRouteMap(this.$options);
    this.initComponent();
  }

  // 监听url变化，渲染对应的组件
  bindEvents() {
    window.addEventListener("load", this.onHashChange.bind(this));
    window.addEventListener("hashchange", this.onHashChange.bind(this));
  }

  onHashChange() {
    this.app.current = window.location.hash.slice(1) || "/";
  }

  // 解析路由配置
  createRouteMap(options) {
    options.routes.forEach(item => {
      this.routeMap[item.path] = item.component;
    });
  }
  
  // 实现两个全局组件 router-link、router-view，当组件实例中的 current 变化时，这两个全局组件都会重新渲染
  initComponent() {
    Vue.component("router-link", {
      props: { to: String },
      render(h) {
        // h(tag, data, children)
        return h("a", { attrs: { href: "#" + this.to } }, [
          this.$slots.default
        ]);
      }
    });

    Vue.component("router-view", {
      // 使用箭头函数, 通过 this 获取 routeMap 中对应 current 的组件
      render: h => {
        const comp = this.routeMap[this.app.current];
        return h(comp);
      }
    });
  }
}

// 实现 install 方法
VueRouter.install = function(Vue) {
  // 全局混入
  Vue.mixin({
    beforeCreate() {
      // this 是 Vue 实例
      if (this.$options.router) {
        // 仅在根实例执行一次 （main.js中 new Vue 时）
        Vue.prototype.$router = this.$options.router;
        this.$options.router.init();
      }
    }
  });
};

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    { path: "/", component: Home }, 
    { path: "/about", component: About }
  ]
});
```

