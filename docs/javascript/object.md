## 理解对象

### 基本概念

在学习面向对象开发之前，我觉的有必要先来了解对象这个东西是什么，ECMA-262把对象定义为：“无序属性的集合，其属性可以包含基本值、对象或者函数”。对象都是基于一个引用类型创建的，这个引用类型可以是原生类型，也可以是开发人员自定义的类型。

原生的引用类型有：Object、Array、Date、RegExp、Function，基本包装类型Boolean、Number、String以及两个单体内置对象Global（在浏览器环境window对象就是Global）、Math。

说明：Object、Array、...、String、Global、Math都是内置对象，ECMA-262对内置对象的定义是：“由ECMAScript提供的，不依赖于宿主环境的对象，这些对象在ECMAScript执行之前就已经存在了”，也就是说开发人员不需要显式的实例化内置对象，因为它们已经实例化了。那么单体内置对象又是什么意思呢。其实也很好理解，看一下下面的代码：

```javascript
// 在chromo控制台操作
Object
ƒ Object() { [native code] }

Array
ƒ Array() { [native code] }

Math
Math {abs: ƒ, acos: ƒ, acosh: ƒ, asin: ƒ, asinh: ƒ, …}
```

我们可以看到Object、Array是函数，而Math是对象，所以可以直接使用Math的API，而其他的内置对象一般是作为构造函数，通过new关键字用来来创建一个对象的。

创建自定义对象最简单的方式就是创建一个Object实例，Object是所有对象的基础，也就是说Object类型所具有的属性和方法同样也存在于具体的对象中。（*在后面的讲解原型链会做出具体说明*）

```javascript
var person = new Object()
person.name='leo'
person.sayName = function (){ 
	console.log('名字:'+this.name);
}
person.sayName() // leo
```

上面的例子中，我们创建了一个person对象，并且给它添加了name属性和sayName方法，但现在有更简洁的写法，通过对象字面量形式来创建对象：

```javascript
var person = {
  name: 'leo',
  showName: function () {
    console.log(this.name);
  }
}
person.showName();
```

#### 对象的属性类型

ECMAScript-262 的定义中，对象的属性有两种，一种是数据属性，另一种是访问器属性 ，这两种属性都有一些特性值来描述该属性。这些特性是为了实现JavaScript引擎用的，因此在JavaScript中不能直接访问它们。而且为了表示这些特性是内部值，该规范把它们放在了两对方括号中，例如[[Enumerable]]。

##### 数据属性

数据属性共有4个描述其行为的特性，其中包含一个存放数据值得特性。

```
[[Configurable]]： 表示能否通过delete删除属性，能否修改属性的特性，或者能否把属性修改为访问器属性。默认为true。

[[Enumerable]]： 表示能否通过for-in遍历属性。默认为true。

[[Writable]]： 表示能否修改属性的值。默认为true。

[[Value]]： 用于存放属性的数据值，默认为undefined。
```

**要修改属性默认的特性，必须使用 ESMAScript 5 的`Object.defineProperty()`方法。这个方法接收三个参数：属性所在的对象、属性的名字和一个描述符对象。其中，描述符对象的属性必须是：configurable、enumerable、writable和value。设置其中一个或多个值，可以修改对应的特性值。**

```javascript
let person = {
  name: 'gongyz'
}
Object.defineProperty(person, "name", {
  writable: false,
  value: 'zhangsan'
})
person.name = '123'
console.log(person) // 'zhangsan'
```

上面的代码创建了一个name属性，当我们调用`Object.defineProperty()`writable特性设为false后，如果为它指定新值，非严格模式下操作会被忽略，严格模式下，赋值操作将会抛出错误。

##### 访问器属性

访问器属性不包括数据值，但它包含一对getter和setter函数（不过这两个函数都不是必须的）。在读取访问器属性时，会调用getter函数，这个函数负责返回有效的值；在写入访问器属性时，会调用setter函数并传入新值，这个函数负责处理数据。访问器属性有如下4个特性。

    [[Configurable]]：同上。
    [[Enumerable]]：同上。
    [[Get]]：在读取属性时调用的函数。默认为undefined。
    [[Set]]：在写入属性时调用的函数。默认为undefined。

**注意：访问器属性不能被直接定义，必须使用`Object.defineProperty()`方法**

```javascript
// 访问器属性
var book = {
  _year: 2004, // _year前面的下划线是一种常用的记号，用于表示只能通过对象方法访问的属性
  version: 1
}

Object.defineProperty(book, 'year', {
  get: function () {
    return this._year
  },
  set: function (newVal) {
    if (newVal > 2004) {
      this._year = newVal
      this.version += newVal - 2004
    }
  }
})

book.year = 2008
console.log(book)
```

上面的代码创建了一个book对象，并给它定义了两个默认属性；`_year`和`version`。`_year`前面的下划线是一种常用的记号，用于表示只能通过对象方法访问的属性。而访问器属性year包含一个getter和setter函数。getter函数返回`_year`的值，setter函数通过计算来确定正确的版本。因此把year属性修改为2008会导致`_year`变成2008，而`version`变成5。这是访问器属性的常见方式，即设置一个属性的值会导致其他属性发生变化。

注意：在IE8及之前的IE浏览器不支持`Object.defineProperty()`方法，要创建访问器属性，一般使用两个非标准的方法`__defineGetter__` 和`__defineSetter__`。

```
// 定义访问器属性的旧方法
book.__defineGetter__('year', function () {
  return this._year
})

book.__defineSetter__('year', function (newVal) {
  if (newVal > 2004) {
    this._year = newVal
    this.version += newVal - 2004
  }
})
```

##### 定义多个属性

ESMAScript 5 定义了一个Object.defineProperties()方法。利用这个方法可以通过描述符一次性定义多个属性。这个方法接收两个对象参数：第一个是要添加和修改其属性的对象，第二个对象的属性与第一个对象要添加或修改的属性一 一对应。

```javascript
let book = {}
Object.defineProperties(book, {
  _year: {
    value: 2004
  },
  version: {
    value: 1
  },
  year: {
    get: function () {
      return this._year
    },
    set: function (newVal) {
      if (newVal > 2004) {
        this._year = newVal
        this.version += newVal - 2004
      }
    }
  }
})

book.year = 2008
console.log(book)
console.log(book.year)
```

##### 读取属性的特性

ESMAScript 5 的`Object.getOwnPropertyDescriptor()` 方法，可以获取给定属性的特性。同样的IE9+的浏览器支持此方法。

```javascript
Object.getOwnPropertyDescriptor(book, 'year')
```

## 创建对象

### 工厂模式

虽然Object构造函数或对象字面量都可以用来创建单个对象，但这些方式有个明显的缺点：使用同一个接口创建多个对象，会产生大量重复代码。为了解决这个问题，同时考虑到在ECMAScript中无法创建类，开发人员就用封装函数来创建对象。这种通过用函数封装以特定接口创建对象的细节，并通过调用函数来创建对象的方式，称为*工厂模式*。

```javascript
function createPerson(name, sex) {
  //原料
  var obj = new Object();

  //加工
  obj.name = name;
  obj.sex = sex;

  obj.showName = function () {
    console.log('名字:' + this.name);
  };

  obj.showSex = function () {
    console.log('性别:' + this.sex);
  }

  //出厂
  return obj;
};

var p1 = createPerson('leo', 'male');
var p2 = createPerson('gongyz', 'male');

p1.showName(); // leo
p2.showName(); // gongyz
console.log(p1 instanceof Object); // true
console.log(p2 instanceof Object); // true
console.log(p1.showName === p2.showName) // false
```

函数createPerson()能够根据接收的参数来创建一个包含基本信息的person对象。可以多次调用这个函数，而每次它都会返回一个包含两个属性和两个方法的对象。**工厂模式虽然解决了创建多个相似对象的问题，但是却没有解决对象识别问题（没有办法通过 instance 判断创建出来的对象是什么类型，因为它总是Object）**，随着JavaScript的发展，有一个新的模式出现了。

### 构造函数模式

我们知道，像Object、Array这样的原生构造函数，在运行时会自动出现在执行环境中。此外，也可以创建自定义的构造函数，从而创建自定义对象类型的属性和方法。例如，我们可以使用构造函数模式将前面的例子重写如下：

```javascript
function Person(name, sex) {

  // 假想的系统内部的工作流程
  // var this=new Object();

  this.name = name;
  this.sex = sex;

  this.showName = function () {
    console.log('名字:' + this.name);
  };

  this.showSex = function () {
    console.log('性别:' + this.sex);
  }

  // 假想的系统内部的工作流程
  // return this;
};

var p1 = new Person('leo', 'male');
var p2 = new Person('lili', 'female');

p1.showName(); // leo
p2.showName(); // lili

console.log(p1 instanceof Person); // true
console.log(p2 instanceof Person); // true

console.log(p1 instanceof Object);  // true
console.log(p2 instanceof Object);  // true
```

在上面的代码中，Person()函数取代了createPerson()函数，同时Person()中的代码与createPerson()还存在一下不同之处：

- 没有显示的创建对象
- 直接将属性和方法赋给了this对象
- 没有return语句
- 首字母大写（按照惯例，构造函数首字母应该大写）
- 使用new关键字调用构造函数来创建对象

其实，要创建Person的新实例，必须使用new操作符。使用new关键字调用构造函数时实际上会经历下面4个步骤：

- 创建一个新的对象
- this指向这个新的对象
- 执行构造函数中的代码，为对象添加属性和方法
- 返回新对象

使用构造函数创建对象可以将它的实例标识为一种特定的类型，这样就解决了工厂模式中对象识别问题。上面代码中创建的对象p1、p2都是Person的实例，但同时也都是Object的实例，这是因为所有的对象都继承自Object（这个在后面的继承中会说明）。

**1、将构造函数当做函数**

构造函数与普通函数的唯一区别就在于调用它们的方式不同。任何函数，只要通过 new 操作符来调用，那它就可以作为构造函数；如果不通过 new 操作符调用，那它就和普通的函数调用没什么区别。例如前面定义的Person函数可以通过下列的任何一种方式调用：

```javascript
// 当做构造函数使用
var person = new Person('gongyz', 'male')
person.showName() // gongyz

// 当做普通函数使用
var person = Person('gongyz', 'male')
window.showName() // gongyz // 添加到window

// 在另一个对象作用域中调用
var obj = new Object()
Person.call(obj,'gongyz', 'male')
obj.showName() // gongyz
```

**2、构造函数的问题**

构造函数模式使用了new关键字，解决了对象识别问题，但是没有解决方法复用问题，每次创建一个实例的时候，方法就会在那个实例上重新创建一遍，好在，这个问题可以通过原型模式解决。

### 原型模式

几乎所有的函数（除了一些内建函数）都有一个prototype（原型）属性，这个属性是一个指针，指向一个对象，而这个对象的用途是用来存放所有实例共享的属性和方法。我们把这个对象称为**原型对象**。我们可以给内置对象的prototype添加属性和方法，但是不推荐这样做，这样可能会覆盖掉内置对象的属性或方法。拿上面的例子来说，我们可以把方法和属性都放到原型对象中。

```javascript
function Person() {
}

Person.prototype.name = 'gongyz';
Person.prototype.sex = 'male';

Person.prototype.showName = function () {
  console.log('名字:' + this.name);
};

Person.prototype.showSex = function () {
  console.log('性别:' + this.sex);
}

var p1 = new Person();
var p2 = new Person();

p1.showName(); // gonygz

p2.showName(); // gongyz

console.log(p1.showName == p2.showName) // true
```

### 组合使用构造函数和原型模式

通常情况下，公用的属性和方法才会放在prototype上，所以我们一般使用构造模式 + 原型模式的混合方式来创建对象 ，这样每一个实例既可以有自己的属性和方法，同时也有了共有的属性和方法。

```javascript
function Person(name, sex) {
  this.name = name;
  this.sex = sex;
};

Person.prototype.showName = function () {
  console.log('名字:' + this.name);
};

Person.prototype.showSex = function () {
  console.log('性别:' + this.sex);
}

var p1 = new Person('leo', 'male');
var p2 = new Person('lili', 'female');

p1.showName();
p1.showSex();

p2.showName();
p2.showSex();
```

### this指向问题

在JavaScript，this的指向是很多该开始接触这门语言的人比较头疼的问题，大部分情况下，函数的调用方式决定了this的值，但也有一些例外的情况，同时在严格模式和非严格模式下this的值也会有一些差别。

通常情况下：

1. 函数通过 new 调用，this 绑定的是新创建的对象
2. 函数在某个上下文对象中调用，this 绑定的是那个上下文对象
3. 函数通过call、apply、bind调用，this 绑定的是指定的上下文对象
4. 全局环境下调用，默认绑定的是window对象。如果在严格模式下，绑定到undefined。

this指向出问题的情况：

1. 构造函数里面有定时器
2. 构造函数里面有事件

```javascript
	// 构造函数里面有定时器
	function Person(){
		this.n = 12
		var _this = this
		setInterval(function () {
			_this.show()
			console.log(this) // window
		}, 1000)
	}

	Person.prototype.show = function (){
		console.log(this.n)
	}
	var person = new Person()

	
	// 构造函数里面有事件
	var oBtn = document.getElementsByTagName('input')[0]
	function Person(){
		this.n = 12
		var _this = this
		oBtn.onclick = function (){
			_this.show()
			console.log(this) // input
		}
	}

	Person.prototype.show = function (){
		console.log(this.n)
	}
	var person = new Person()
```

上面两种情况下，this指向的分别是window和input对象，解决这个问题很简单，另外保存一份当前对象的this引用就可以了。

## 继承

继承是复用代码的一种形式，子类通过继承父类的属性和方法达到代码复用的目的。

### 原型链

在每个**对象**上面都有一个`__proto__`属性，可称为隐式原型 。这不是一个标准的属性，但是每个浏览器都支持。该隐式原型指向的是创建该对象的构造函数的原型对象。这样就保证了实例能够访问在构造函数的原型中定义的属性和方法。对象和原型对象之间通过`__proto__`就构成了一条原型链。原型链的最外层是`Object.prototype` ，因为Object是所有对象的基础。

### 拷贝继承

父类

```javascript
function Person(name, sex) {
	this.name = name;
	this.sex = sex;
}

Person.prototype.showName = function () {
	console.log(this.name);
}

Person.prototype.showSex = function () {
	console.log(this.sex);
}
```

子类

```javascript
function Worker(name, sex, job) {
  // 调用父级的构造函数继承属性		
  Person.call(this, name, sex); // this -> new 出来的Worker对象  
  this.job = job;
  
  // Worker.prototype = Person.prototype // 直接把父类的引用给子类，会导致子类修改父类
  
  // 通过原型来继承父级的方法	
  for (var i in Person.prototype) {
  	Worker.prototype[i] = Person.prototype[i];
  }
  Worker.prototype.showJob = function () {
  	console.log(this.job);
  };
}
```

通过在子类的构造函数中调用父类的构造函数，并且通过call方法修改this指向，可以继承父类的属性。接下来我们需要继承父类的方法，如果直接把父类构造函数的原型对象引用赋值给子类原型对象，可以实现继承父类的方法，但是这样会导致我们在修改子类原型对象的时候会影响到父类的原型对象，所以我们通过for-in来继承父类的方法。可以封装一个extend方法来进行拷贝操作。下面是一个简单的extend方法封装。感兴趣可以去看看JQuery中的extend方法。实现起来更加复杂。

```javascript
function extend(obj1, obj2){
	for(var attr in obj2){
		obj1[attr] = obj2[attr]
	}
}
```

拷贝方法有一个很大的问题就是，如果父类中存在不可枚举的方法，那么通过for-in是无法继承的。

### 类式继承

在JavaScript中其实没有类的概念的，类式继承是通过构造函数实现继承。

子类

```javascript
function Worker(name, sex, job) {
  // 调用父级的构造函数继承属性		
  Person.call(this, name, sex); // this -> new 出来的Worker对象  
  this.job = job;
}

// 继承父级原型中的方法
Worker.prototype = new Person()
Worker.prototype.constructor = Worker; // 让constructor 指向 Worker
Worker.prototype.showJob = function () {
	console.log(this.job);
}
```

## 对象中常用的属性和方法

hasOwnProperty : 判断是否是对象自身下面的属性 

```javascript
var arr = []
arr.num = 10
Array.prototype.num2 = 20
console.log( arr.hasOwnProperty('num')  ) // true
console.log(  arr.hasOwnProperty('num2')  )  // false
```

constructor : 查看对象的构造函数

```javascript
function Person (){}
var person = new Person()
console.log( a1.constructor )  // Person
Person.prototype.constructor = Person  // 每一个函数都会有的，都是自动生成的
```

instanceof : 对象与构造函数在原型链上是否有关系

```javascript
function Person(){}
var person = new Person()
console.log( person instanceof Object )  // true
```
