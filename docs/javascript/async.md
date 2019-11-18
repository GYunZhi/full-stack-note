## Javascript 异步的由来

### Javascript 单线程

大家都知道 js 是单线程的，那为什么要是单线程的呢？

因为 js 的运用场景是浏览器，包含了很多用户的交互，如果是多线程，那一个线程要在某个 DOM 上添加内容，另一个线程直接要删除这个 DOM，那浏览器到底听哪个的好呢？所以为了降低复杂性，js 从一诞生，就是单线程，这也是这门语言的核心特征，因为 js 一开始就是为浏览器而生的。

既然是单线程，也就是每次只执行一个任务，只有等到当前任务执行完毕，才能执行后面的任务，这些任务会形成一个任务队列，排队等候执行。

就像大家去超市买东西排队结账，得前面一个人付完钱，排在他后面的那个才能买单。但是如果前面一个任务很耗时，比如正常每个人手里都是拿着一两样东西等着排队，而你前面那位大哥推着满满一车的东西，你是不是得崩溃了？

所以像我们平时遇到的浏览器无响应和页面假死，往往是因为某段 js 代码执行时间过长，或者直接陷入死循环，导致页面卡死，后面的任务当然就无法继续执行了。

但是，在前端的某些任务的确是非常耗时的，比如网络请求、定时器和事件监听等等，如果让他们和别的任务一样都老老实实的排队等待执行的话，执行效率会非常低。所以，这时候浏览器为这些耗时的任务开辟了另外的线程，主要包括**事件触发线程**、**定时器触发线程**和**异步 HTTP 请求线程**。

### 浏览器多线程

浏览器**渲染进程**是多线程的，它包含如下线程：

- GUI 渲染线程
- JS 引擎线程
- 事件触发线程
- 定时器触发线程
- 异步 HTTP 请求线程

#### 1、GUI 渲染线程

负责渲染浏览器界面，解析 HTML、CSS，当界面需要重绘（Repaint）或由于某种操作引发回流（Reflow）时，该线程就会执行，GUI 渲染线程与 JS 引擎线程是互斥的，因为 JS 可以操作 DOM 元素， 从而影响到 GUI 的渲染结果，当 JS 引擎执行时 GUI 线程会被挂起，GUI 更新会被保存在一个队列中等到 JS 引擎空闲时立即被执行。

#### 2、JS 引擎线程

JS 内核（例如V8引擎），负责处理 Javascript 脚本程序，JS 引擎一直等待着任务队列中任务的到来，然后加以处理，因为 GUI 渲染线程与JS引擎线程是互斥的，所以如果 JS 执行时间过长，页面渲染就不连贯，造成页面渲染加载阻塞。

#### 3、事件触发线程

由于 JS 引擎这个单线程的家伙自己都忙不过来，所以需要浏览器另开一个线程协助它，当对应的事件符合触发条件被触发时，该线程会把事件添加到待处理队列的队尾，等待JS引擎的处理。由于JS的单线程关系，所以这些待处理队列中的事件都得排队等待JS引擎处理（当JS引擎空闲时才会去执行）。

#### 4、定时触发器线程

setInterval 与 setTimeout所在线程，JS 引擎阻塞状态下计时不准确，所以由浏览器另开线程单独计时，计时完毕后，添加到事件队列中，等待 JS 引擎空闲后执行。

#### 5、异步 HTTP 请求线程

如果请求有回调事件，异步线程就产生**状态变更事件**，将这个回调再放入事件队列中，等 JS 引擎空闲后执行

### 事件循环（Event Loop）

js 一直在做一个工作，就是从任务队列里提取任务，放到主线程里执行，看下面这张图：

![mark](https://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/u8rkfQEHPu7h.png?imageslim)

- JS 运行时引擎(runtime)：也就是 js 线程，由内存堆(heap)和调用栈(stack)组成，其中内存堆是用于内存分配，调用栈是代码执行时的栈
- Web APIs：上文中说到的浏览器为异步任务单独开辟的线程在这里可以统一理解为 Web APIs
- 回调队列(callback queue)：也就是任务队列，上面 Web APIs 子线程任务执行结束后会将任务的回调函数推入回调队列
- 事件循环(Event Loop)：事件轮询机制，观察运行时调用栈是否为空，如果为空，将回调队列中的任务推到调用栈，回调队列遵循先入先出(FIFO)的原则，也就是按照子线程执行任务完成顺序依次被调用

我们再来看一个经典的问题，下面代码输出的结果是什么：

```javascript
setTimeout(function(){
    console.log(1)
},0);
console.log(2)
```

结果是 2、1，因为执行 setTimeout 会立即交给浏览器的定时触发器线程去处理，计时完毕后会把匿名函数放到任务队列里等待 js 主线程调用，但这个时候 js 线程里的 stack 并不是空的，因为还有一句 `console.log(2)`。要等到 `console.log(2)`执行完之后，才通过事件循环把匿名函数推到 stack 里面去执行。

### 小结

js 从诞生起是单线程的，所谓的 js 异步，其实是由单线程的 js、多线程的宿主浏览器和事件循环机制共同作用而成



## Javascript 异步编程的演进

### 1、回调函数

实现 js 异步编程最基础方式的就是**回调函数**，这里列举几个大家熟悉的场景，比如：Ajax 请求、IO 操作或者定时器。

```javascript
ajax(url, function(){
   //回调函数
});
setTimeOut(function(){
   //回调函数
}, 1000)
```

如上面代码，回调本身没什么毛病，是比较好用的，但是随着 Web 前端的复杂度不断提高，以及 js 应用场景的不断拓宽，光是回调已经不够用了。

因为我们阅读和编写程序是顺序的，对于复杂的回调函数会不易理解，所以我们需要一种同步的、顺序的方式来表达异步，看下面栗子：

```javascript
// 回调函数实现两数相加，两个数字都是异步获取
// 这里 fetchX() 和 fetchY() 是异步获取数字的 Ajax 请求，接受一个回调函数作为参数
function add(getX,  getY, cb) {
  var x, y
  getX(function(xVal) {
    x = xVal
    if (y != undefined) {
      cb(x + y)
    }
  })
  getY(function(yVal) {
    y = yVal
    if(x != undefined) {
      cb(x + y)
    }
  })
}
add(fetchX, fetchY, function(sum) {
  console.log(sum)
})
```

再来看下用 Promise 怎么实现：

```javascript
//Promise 实现两数相加
function add(xPromise, yPromise) {
  return Promise.all([xPromise, yPromise])
  .then(function(values) {
    return values[0] + values[1]
  })
}
//这里 fetchX()、fetchY()返回相应值的 Promise
add(fetchX(), fetchY()).then(function(sum){
  console.log(sum)
})
```

这里只需保证 fetchX() 和 fetchY() 返回的是 Promise，然后直接用 `Promise.all` 即可，显然第二种处理起来是不是顺畅得多？

### 2、Promise

`Promise` 是一种弥补回调函数不足的异步解决方案，最早由社区提出并实现，后来写进了 es6 规范，简单地说，`Promise` 是一个特殊的对象，它可以表示异步操作的成功或者失败，同时返回异步操作的执行结果。

#### 理解 Promise

什么意思呢，上面的解释可能还是不够直观，咱们举个栗子：

假设你苦苦追求的女神，有一天终于禁不住你的死缠烂打，答应跟你去看电影了。那答应跟你去看电影这个事情就是一个**承诺（Promise）**。可其实你心里也没底，你并不知道女神会不会真的陪你去看电影，女神可能兑现承诺，也可能放你鸽子。

这就是 Promise，一个 Promise 有三种状态：

1. Promise 是**待定的（pending）**： 你并不知道女神会不会真的陪你去看电影
2. Promise 是**已解决的（resolved）**：女神兑现承诺
3. Promise 是**被拒绝的（rejected）**:  被放鸽子


#### 创建一个 Promise

```javascript
let isHayyp = false
let watchingMovies = new Promise(function (resolve, reject) {
  if (isHayyp) {
      const movie = {
        name: '海王',
        time: '2018-12-27 18:20'
      }
    resolve(movie)
  } else {
    reject(new Error('女神心情不好'))
  }
})

watchingMovies.then((movie) => {
    // 女神兑现承诺，一起去看了电影
    // 然后再一起去吃饭
}, (err) => {
    // 女神心情不好，被放鸽子了，回家打游戏
})

```

以上两段代码，第一段是调用 `Promise ` 构造函数，第二段是调用了 `Promise` 实例的 `.then` 方法

1. 构造函数
   - 构造函数接受一个函数作为参数
   - 调用构造函数得到实例 watchingMovies 的同时，作为参数的函数会立即执行
   - 参数函数接受两个回调函数参数 resolve 和 reject
   - 在参数函数被执行的过程中，如果在其内部调用 resolve，会将 watchingMovies 的状态变成 fulfilled，或者调用 reject，会将 watchingMovies 的状态变成 rejected
2. 调用 `.then`
   - 调用 `.then` 可以为实例 p 注册两种状态回调函数
   - 当实例 watchingMovies 的状态为 fulfilled，会触发第一个函数执行
   - 当实例 watchingMovies 的状态为 rejected，则触发第二个函数执行

我们结合上面讲的 js 异步，再来看下面这段代码：

```javascript
let promise = new Promise(function(resolve, reject) {
  console.log(1)
  resolve()
})

promise.then(function() {
  console.log(2)
})

console.log(3)
```

打印结果是 132，`Promise` 新建后立即执行，所以首先输出的是 1。然后，`then` 方法注册的回调函数，将在当前脚本所有同步任务执行完才会执行，所以 2 最后输出。

#### Promise API

Promise 的 API 分为构造函数、实例方法和静态方法

- 1个构造函数： `new Promise`
- 3个实例方法：`.then` 、 `.catch` 和 `.finally`
- 4个静态方法：`Promise.all`、`Promise.race`、`Promise.resolve` 和 `Promise.reject`

##### 1、`.then`方法

`.then`方法返回的是一个新的 `Promise` 实例（注意，不是原来那个 `Promise` 实例）。因此可以采用链式写法，即 `.then` 方法后面再调用另一个 `.then` 方法

```javascript
getJSON("/posts.json").then(function(json) {
  return json.post
}).then(function(post) {
  // ...
})
```

上面的代码使用 `.then` 方法，依次注册了两个回调函数。第一个回调函数完成以后，会将返回结果作为参数，传入第二个回调函数

##### 2、`.catch  `方法

处理异常的推荐写法

```javascript
// 不推荐
promise.then((data) => {
  // success
}, (err) => {
  // error
})
// 推荐
promise.then((data) => {
  // success
}).catch(err => {
  // error
})
```

因为 catch 可以捕获到 then 里的异常，Promise 对象的错误具有『冒泡』性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个 `catch` 捕获。

```javascript
getJSON('/post/1.json').then(function(post) {
  return getJSON(post.commentURL)
}).then(function(comments) {
  // some code
}).catch(function(error) {
  // 处理前面三个Promise产生的错误
})
```

上面代码中，一共有三个 Promise 对象：一个由 `getJSON` 产生，两个由 `then` 产生。它们之中任何一个抛出的错误，都会被最后一个 `catch` 捕获。

##### 3、`Promise.all`方法

`Promise.all` 方法用于将多个 Promise 实例，包装成一个新的 Promise 实例

```javascript
const p = Promise.all([p1, p2, p3])
```

上面代码中，`Promise.all` 方法接受一个数组作为参数，`p1`、`p2`、`p3` 都是 Promise 实例，如果不是，就会先调用 `Promise.resolve` 方法，将参数转为 Promise 实例`p` 的状态由`p1`、`p2`、`p3`决定，分成两种情况：

（1）只有`p1`、`p2`、`p3`的状态都变成`fulfilled`，`p`的状态才会变成`fulfilled`，此时`p1`、`p2`、`p3`的返回值组成一个数组，传递给`p`的回调函数。

（2）只要`p1`、`p2`、`p3`之中有一个被`rejected`，`p`的状态就变成`rejected`，此时第一个被`reject`的实例的返回值，会传递给`p`的回调函数。

```javascript
// 生成一个 Promise 对象的数组
const promiseList = [2, 3, 5, 7, 11, 13].map(function (id) {
  return getJSON('/post/' + id + ".json")
})

Promise.all(promises).then(function (posts) {
  // ...
}).catch(function(reason){
  // ...
})
```

上面代码中，`promiseList` 是包含 6 个 Promise 实例的数组，只有这 6 个实例的状态都变成 `fulfilled`，或者其中有一个变为 `rejected`，才会调用 `Promise.all` 方法后面的回调函数。

##### 4、`Promise.race`方法

`Promise.race` 方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例

```javascript
const p = Promise.race([p1, p2, p3])
```

但不同的是，这里只要 `p1`、`p2`、`p3 `之中有一个实例率先改变状态，`p `的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给 `p` 的回调函数。

##### 5、`Promise.resolve` 和 `Promise.reject`方法

`Promise.resolve` 会返回一个状态为 fulfilled 状态的 Promise 对象，`Promise.reject` 与 `Promise.resolve` 同理，区别在于返回的 Promise 对象状态为 rejected。

`Promise.resolve` 等价于下面的写法：

```javascript
Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))
```

#### Promise 和 setTimeout 的执行顺序

```javascript
setTimeout(function () {
    console.log(1)
}, 0)
new Promise(function (resolve) {
	console.log(2)
	resolve()
}).then(function () {
    console.log(3)
})
console.log(4)
```

以上代码运行结果是 2431，为什么不是 2413，不是 setTimeout 先加入任务队列的么？

所以这里又要从任务队列说起了，任务队列可以细分为 **MacroTask Queue(宏任务队列)** 和 **MicroTask Queue(微任务队列)** 两种

整个 script 代码放在了宏任务队列，setTimeout 也放在了宏任务队列，但 `promise.then` 放到了微任务队列

这两个队列的执行顺序如下：

1. 取宏任务队列里第一个 task，执行之
2. 把微任务队列里**所有** task 执行完
3. 再取宏任务队列里下一个 task 执行之，周而复始

代码开始执行时，所有这些代码在宏任务队列中，取出来执行之。

后面遇到了setTimeout，又加入到macrotask queue中，

然后，遇到了 `promise.then`，**放入到了另一个队列，微任务队列**。

等整个 stack 执行完后，

下一步该取的是**微任务队列**中的任务了。

因此 `promise.then` 的回调比 setTimeout 先执行

### 3、Generator 函数（生成器函数）

Generator 函数，也可以叫生成器函数，是 ES6 提供的一种异步编程解决方案，执行生成器函数会返回一个迭代器对象，所以我们先来看下什么是迭代器。

#### 迭代器

迭代器并不是某一个语法或者对象，而是一个协议，只要遵循了这个协议，所实现的都是迭代器对象，下面我们来看一个简易的迭代器：

```javascript
function makeIterator(array) {
  var nextIndex = 0
  // 返回迭代器对象
  return {
    // next() 方法返回的结果对象
    next: function() {
      return nextIndex < array.length ?
        {value: array[nextIndex++], done: false} :
        {value: undefined, done: true}
    }
  }
}
var it = makeIterator(['a', 'b'])

it.next() // { value: "a", done: false }
it.next() // { value: "b", done: false }
it.next() // { value: undefined, done: true }
```

上面代码定义了一个`makeIterator`函数，它是一个迭代器生成函数，作用就是返回一个迭代器对象。对数组`['a', 'b']`执行这个函数，就会返回该数组的迭代器对象`it`

迭代器对象的`next`方法，用来移动指针。开始时，指针指向数组的开始位置。然后，每次调用`next`方法，指针就会指向数组的下一个成员。第一次调用，指向`a`；第二次调用，指向`b`

`next`方法返回一个对象，表示当前数据成员的信息。这个对象具有`value`和`done`两个属性，`value`属性返回当前位置的成员，`done`属性是一个布尔值，表示遍历是否结束

#### 生成器

借助于迭代器的这个特征，我们现在可以理解一下生成器，字面意思呢，就是生成一个东西，那生成器函数就是一个返回迭代器的函数

生成器函数从语法上来看，只是`function`关键字与函数名之间比普通函数多了一个星号，同时每一次迭代，都会通过 `yield`关键字来实现

我们把上面代码改写一下：

```javascript
function *makeIterator(array) {
    for (let i = 0; i < array.length; i++) {
        yield array[i]
    }
}
var it = makeIterator(['a', 'b'])

it.next() // { value: "a", done: false }
it.next() // { value: "b", done: false }
it.next() // { value: undefined, done: true }
```

打印的值和上面代码是一模一样的，所以生成器的出现实际上是为了简化掉我们上面那一坨代码，简化创建迭代器的过程

咱们再来看个简单的栗子：

```javascript
function* helloWorldGenerator() {
  yield 'hello'
  yield 'world'
  return 'ending'
}

var hw = helloWorldGenerator()
```

上面代码定义了一个生成器函数`helloWorldGenerator`，它内部有两个`yield`表达式（`hello`和`world`），即该函数有三个状态：hello，world 和 return 语句（结束执行）
```javascript
hw.next()
// { value: 'hello', done: false }
hw.next()
// { value: 'world', done: false }
hw.next()
// { value: 'ending', done: true }
hw.next()
// { value: undefined, done: true }
```
下一步，我们必须调用遍历器对象的`next`方法，使得指针移向下一个状态。也就是说，每次调用`next`方法，内部指针就从函数头部或上一次停下来的地方开始执行，直到遇到下一个`yield`表达式（或`return`语句）为止。我们可以理解为，生成器函数是分段执行的，`yield`表达式是暂停执行的标记，而`next`方法可以恢复执行

#### co 模块

[co 模块](https://github.com/tj/co)是著名程序员 TJ Holowaychuk 于 2013 年 6 月发布的一个小工具，用于生成器函数的自动执行

下面是一个生成器函数，用于依次读取两个文件，这里的 `yield` 关键字后面跟的是一个 Promise：

```javascript
var fs = require('fs')

var readFile = function (fileName){
  return new Promise(function (resolve, reject){
    fs.readFile(fileName, function(error, data){
      if (error) reject(error)
      resolve(data)
    })
  })
}

var gen = function* () {
  var f1 = yield readFile('/etc/fstab')
  var f2 = yield readFile('/etc/shells')
  console.log(f1.toString())
  console.log(f2.toString())
}
```

co 模块可以让你不用编写 Generator 函数的执行器。

```javascript
var co = require('co')
co(gen)
```

上面代码中，Generator 函数只要传入`co`函数，就会自动执行。

`co`函数返回一个`Promise`对象，因此可以用`then`方法添加回调函数。

```javascript
co(gen).then(function (){
  console.log('Generator 函数执行完成')
})
```

上面代码中，等到 Generator 函数执行结束，就会输出一行提示

为什么 co 可以自动执行 Generator 函数？简单的说就是将异步操作包装成 Promise 对象，用`then`方法交回执行权，具体细节大家可以去看 co 库的源码。

### 4、Async/await

ES2017 标准引入了 async 函数，使得异步操作变得更加方便

`async/await`调用方式跟使用`co`库后的`Generator`函数看起来很相似，自带执行器，并且语义更清楚

```javascript
var fs = require('fs')
var co = require('co')

var readFile = function (fileName){
  return new Promise(function (resolve, reject){
    fs.readFile(fileName, function(error, data){
      if (error) reject(error)
      resolve(data)
    })
  })
}

var gen = function* (){
  var f1 = yield readFile('/etc/fstab')
  var f2 = yield readFile('/etc/shells')
  console.log(f1.toString())
  console.log(f2.toString())
}

co(gen)
```

写成 async 函数，就是下面这样：

```javascript
var fs = require('fs')

var readFile = function (fileName){
  return new Promise(function (resolve, reject){
    fs.readFile(fileName, function(error, data){
      if (error) reject(error)
      resolve(data)
    })
  })
}

var asyncReadFile = async function (){
  var f1 = await readFile('/etc/fstab')
  var f2 = await readFile('/etc/shells')
  console.log(f1.toString())
  console.log(f2.toString())
}

asyncReadFile()
```

一比较就会发现，async 函数就是将 Generator 函数的星号（*）替换成 async，将 yield 替换成 await，仅此而已。

所以说，生成器函数和 co 库都只是 async/await 标准化落地之前的过度方案，现在我们只要掌握 Promise 和 async/await 即可。

## 总结

然后最后总结一下，今天我们探讨了 js 异步的实现以及 js 异步流程的演进路线，js 异步的实现，相信大家现在都能理解了，而 js 异步流程，从 promise 到 async 函数，无论如何，promise都是基石，是必须要掌握的，而生成器函数和 co 只是为了引出 async/await 的过度方案，所以大家只要掌握 promise 和 最终方案 async/await 即可。