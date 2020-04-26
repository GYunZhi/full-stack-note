# 常用设计模式

## 单例模式

**作用**

保证一个类仅有一个实例，并提供一个访问它的全局访问点。

**实现单例核心思想**

用一个变量来标志当前是否已经为某个类创建过对象，如果是，则在下一次获取该类的实例时，直接返回之前创建的对象，接下来我们用 JavaScript 来强行实现这个思路，请看代码：

```
// 单例模式抽象，分离创建对象的函数和判断对象是否已经创建
var getSingle = function (fn) {
  var result;
  	return function () {
  	return result || ( result = fn.apply(this, arguments) );
  }
};
```

待更新...

