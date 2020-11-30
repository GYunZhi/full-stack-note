

# Vue知识整理—表单输入绑定

### v-model 原理

```javascript
<input v-model="searchText">

<input v-bind:value="searchText" v-on:input="searchText = $event.target.value">
```

### 自定义输入组件

#### custom-input组件

```javascript
Vue.component('custom-input', {
  props: ['value'],
  template: `<input v-bind:value="value" v-on:input="$emit('input', $event.target.value)">`
})

<custom-input v-model="searchText"></custom-input>

<custom-input v-bind:value="searchText" v-on:input="(payload) => searchText = payload"></custom-input>
```

#### custom-checkbox组件

```javascript
Vue.component('custom-checkbox', {
   model: {
      prop: 'checked',
      event: 'change' // 要触发的事件
   },
   props: {
     checked: Boolean
   },
   template: `
     <input
       type="checkbox"
       v-bind:checked="checked"
       v-on:change="$emit('change', $event.target.checked)"
     >
   `
})

<custom-checkbox v-model="checked"></custom-checkbox>

<custom-checkbox v-bind:checked="checked" v-on:change="(payload) => checked = payload"></custom-checkbox>
```



