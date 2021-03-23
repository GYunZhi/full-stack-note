## 闭包的概念

函数嵌套函数，内部函数可以引用外部函数的参数和变量,外部函数执行完了之后，其变量和参数也不会被垃圾回收机制收回 （注：在JavaScript高级程序设计（第3版）中对闭包的定义是：*闭包是指有有权访问另一个函数作用域中的变量的函数*，这两者并不冲突，我个人更倾向于闭包是一种概念）

![image](https://cdn.nlark.com/yuque/0/2021/png/387995/1616393693202-ad8477d1-60fa-4204-8fc1-e92b37bcb3a7.png)

## 闭包的作用 

**（1） 让变量长期驻扎在内存当中**

```javascript
function fn1(){
  var a=5;
  function fn2(){
   console.log(a);
  }
  return fn2;
}

fn=fn1();	//fn1执行完后，变量a并没有被垃圾回收机制收回

fn();	//在这里，还可以访问到fn1中的变量a
```

**（2） 避免全局变量的污染**

```javascript
var a=1;

// 普通函数
function fn1(){
  a++;
  console.log(a)
}
fn1(); //2
fn1(); //3
console.log(a); //3   全局变量被改变
 
// 使用闭包之后的函数：通过闭包实现每次调用a累加,同时又不会改变全局变量
function fn2(){
  var a=1;
  return function fn3(){
    a++;
    alert(a);
  }
}
fn=fn2();
fn(); //2
fn(); //3
console.log(a); //1   全局变量不变

```

**（3）让函数拥有私有成员**

```javascript
// 让函数拥有私有成员

var fn1 = (function (){
  var a=1;
  // 特权函数
  function fn2(){
    a++;
    console.log(a)
  }

  // 特权函数
  function fn3(){
    a++;
    console.log(a);
  }
  
  return{
    "fn2":fn2,
    "fn3":fn3
  }
})();

fn1.fn2(); //2
fn1.fn3(); //2

console.log(a);//undefined
fn2();//undefined
fn3();//undefined
```

## 闭包的应用 

（1）模仿块级作用域

```javascript
(function (){
  //块级作用域
  var a = 10
  console.log(a)  // 10
})();

console.log(a)  // a is not defined
```

（2）在循环中直接找到对应元素的索引 

```javascript
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>闭包2</title>

  <style type="text/css">
    li{background: #000;border:2px solid #fff;color: #fff;list-style: none;}
  </style>
</head>
<body>
  <ul>
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
  </ul>
<script>

// 普通函数：点击每一个元素输出的都是 4
 for (var i =0;i<aLi.length;i++) {
    aLi[i].onclick=function (){
      console.log(i);
    }
 }

// 闭包函数：使用闭包后，点击对应的元素，输出的是对应元素的索引值
 for (var i =0;i<aLi.length;i++) {
    (function (i){
      aLi[i].onclick=function (){
        console.log(i);
      }
    })(i);
 }

 // 方法二
 for (var i =0;i<aLi.length;i++) {
    aLi[i].onclick=(function (i){
      return function (){
        console.log(i);
      }
    })(i);
 }
</script>
</body>
</html>
```

## 闭包的注意事项

  闭包在`IE8-`下会引发内存泄漏：内存泄漏就是指浏览器不关闭,内存一直不会被释放

  在理解内存泄漏时，我们先来了解一下JS中的垃圾回收机制：

  JS中的内存回收是自动回收的，主要有两种方式:

​    (1) 标记清除

​      变进入环境（例如，在函数中声明一个变量），则将这个变量标记为'进入环境'，当变量离开环境时，则将其标记为离开环境。垃圾收集器会自动回收那些离开环境的变量所占用的内存

   (2) 引用计数

​      引用计数的含义是跟踪每一个值被引用的次数。当声明一个变量并将一个值赋给该变量，则这个值的引用次数加1。如果这个变量又取了另外一个值，则这个值得引用次数减1，当这个值得引用次数变为0时，就可以将其占用的内存空间回收回来。

​	内存泄漏就是由于引用计数方式中的循环引用造成的，在下面的例子中，oBjectA和objectB分别指向一个Object类型的对象，则这两个对象的引用计数都是1，然后oBjectA和objectB通过各自的属性互相引用，oBjectA和objectB指向的那两个对象的引用计数都变成了2，这样就造成内存无法回收。（这里希望大家搞 清楚一个概念，oBjectA和objectB的值才是对象，oBjectA和objectB本身是变量）。现代浏览器都是采用标记清除的垃圾回收策略，但是在`IE8-`中的BOM和DOM并不是原生的JavaScript对象，其BOM和DOM使用c++以COM对象的形式实现的，而COM对象的垃圾回收机制采用的就是引用计数策略

```javascript
  function fn(){
    var objectA = new Object();
    var objectB = new Object();
    
    objectA.attr1 = objectB;
    objectB.attr = objectA;
 }
```

## ES6中新特性

在ES5和之前的版本中，没有块级作用域的概念，所以开发人员巧妙的利用闭包来实现块级作用域，以满足开发需求。但是在ES6中新增了let和const命令，并且定义了块级作用域的命令，所以闭包以后将会慢慢废弃，我们只需要了解有这个东西即可，重要的是积极学习使用ES6的新特性，这里推荐下阮一峰老师的[ECMAScript 6 入门](http://es6.ruanyifeng.com/)。

ES6 新增了`let`命令，用来声明变量。它的用法类似于`var`，但是所声明的变量，只在`let`命令所在的代码块内有效。 

```javascript
{
  let a = 10;
  var b = 1;
}

a // ReferenceError: a is not defined.
b // 1
```

使用`let`命令代替`var`我们可以改写一下上面的for循环

```javascript
// 改成let命令后，点击每个元素时，输出的是对应元素的索引，不需要再使用闭包了
for (let i =0;i<aLi.length;i++) {
    aLi[i].onclick=function (){
      console.log(i);
    }
 }
```