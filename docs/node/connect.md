## 简介

Connect](https://github.com/senchalabs/connect) 是一个可扩展(中间件作为插件)的 Http 服务器框架，Connect 刚出道之时自带了许多中间件，为保证其框架的轻量级以及扩展性，最终还是将这些中间件的实现抛给了社区。可能在搜索 Connect 的相关项目时，你会发现 `connect().use(connect.bodyParser())`这些的写法，这对于现在的 Connect (最新版本3.6.0) 是不支持的，而只能通过 npm 下载第三方的模块 (如 body-parser) 替代原先的中间价。

## 基本使用

```javascript
const connect = require('connect');
var createError = require('http-errors');
var http = require('http');

var app = connect()

app.use('/', function(req, res, next) {
  res.writeHead(200,'OK',{
    //'content-type': 'text/plain' //纯文本
    'content-type': 'text/html;charset=utf-8'
  })
  res.write('<h1>你好，欢迎学习connect</h1>')
  res.end()
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.statusCode = 404;
  res.end('Not Found');
});

// 两种方式监听指定端口
app.listen(3000) // 这种方式在connect里面调用了http.createServer方法

// http.createServer(app).listen(3000);
```

## 源码分析

这篇文章是基于`"version": "3.6.6"`这个版本来对源码进行分析的，这个版本所有的代码都在`index.js`文件中。下面我们来看一下connect是怎么工作的。

首先我们看一下这个文件的模块出口，可以看到导出了一个`createServer`函数，这个函数最终返回的是app，app本身是一个函数，在下面一段代码中我们可以的看到它是作为了request事件的处理函数。同时它既继承了proto、EventEmitter属性和方法，也有自己的route、stack属性。

```javascript
// 模块出口
module.exports = createServer;

// 判断当前环境，初始化proto 对象
var env = process.env.NODE_ENV || 'development';
var proto = {};

function createServer() {
  // app 函数对象，可以添加属性和方法
  function app(req, res, next){ 
    app.handle(req, res, next); 
  }
  // merge： 相当于Object.assign
  merge(app, proto);  // 继承proto的属性和方法
  merge(app, EventEmitter.prototype); // 继承EventEmitter（事件派发器）属性和方法
  app.route = '/';
  app.stack = []; // 存放中间件的数组,中间件会被格式化成形为{route: route , handle : fn}的匿名对象存放
  return app;
}

// 监听指定端口号
proto.listen = function listen() {
  var server = http.createServer(this); // this ——> app函数对象,作为request事件的处理函数
  return server.listen.apply(server, arguments); // 从 arguments 拿到端口号
};
```

connect框架的核心是use、handle、call三个方法，我们来分析一下这三个方法分别有什么作用。

**use方法：添加中间件**

```javascript
// 添加中间件
proto.use = function use(route, fn) {
  var handle = fn;
  var path = route;

  // 如果参数只有一个，那么path默认是 '/', 传入的参数作为处理函数
  if (typeof route !== 'string') {
    handle = route;
    path = '/';
  }

  // 如果fn为一个app的实例，则将其自身handle方法的包裹给fn
  if (typeof handle.handle === 'function') {
    var server = handle;
    server.route = path;
    handle = function (req, res, next) {
      server.handle(req, res, next);
    };
  }

  // 如果fn为一个http.Server实例，则fn为其request事件的第一个监听器
  if (handle instanceof http.Server) {
    handle = handle.listeners('request')[0];
  }

  // 如果route参数的以 '/' 结尾，则删除 '/'
  if (path[path.length - 1] === '/') {
    path = path.slice(0, -1);
  }

  // 把中间件添加到stack数组中
  debug('use %s %s', path || '/', handle.name || 'anonymous');
  this.stack.push({ route: path, handle: handle });

  // 返回自身，以便继续链式调用
  return this;
};
```

**handle方法：根据当前路径找到stack中所有与之相匹配的中间件，通过call方法调用中间件处理函数**

```javascript
proto.handle = function handle(req, res, out) {
  var index = 0;
  var protohost = getProtohost(req.url) || '';
  var removed = '';
  var slashAdded = false;
  var stack = this.stack;

  // final function handler
  var done = out || finalhandler(req, res, {
    env: env,
    onerror: logerror
  });

  // store the original URL
  req.originalUrl = req.originalUrl || req.url;

  // 调用next方法传递的err信息，可以在下一个中间件处理函数的err参数中获取到
  function next(err) {
    if (slashAdded) {
      req.url = req.url.substr(1);
      slashAdded = false;
    }

    if (removed.length !== 0) {
      req.url = protohost + removed + req.url.substr(protohost.length);
      removed = '';
    }

    // 取出第一个中间件，index+1，再次调用取出第二个中间件....
    var layer = stack[index++];

    // all done
    if (!layer) {
      defer(done, err);
      return;
    }

    // route data
    var path = parseUrl(req).pathname || '/';
    var route = layer.route;
      
    // skip this layer if the route doesn't match
    if (path.toLowerCase().substr(0, route.length) !== route.toLowerCase()) {
      return next(err);
    }

    // skip if route match does not border "/", ".", or end
    var c = path.length > route.length && path[route.length];
    if (c && c !== '/' && c !== '.') {
      return next(err);
    }

    // trim off the part of the url that matches the route
    if (route.length !== 0 && route !== '/') {
      removed = route;
      req.url = protohost + req.url.substr(protohost.length + removed.length);

      // ensure leading slash
      if (!protohost && req.url[0] !== '/') {
        req.url = '/' + req.url;
        slashAdded = true;
      }
    }

    // 执行handler中匹配到的中间件
    call(layer.handle, route, err, req, res, next);
  }

  next();
};
```

**call方法:：执行handler中匹配到的中间件**

```javascript
function call(handle, route, err, req, res, next) {
  // handle函数的参数个数(3个参数为一般中间件，4个参数为错误处理中间件)
  // next参数接收的是上面定义的next函数，然后传入到中间件的handle函数中，handle函数同样通过next参数接  			收，所以在中间件中调用next后会继续执行下一个中间件
  var arity = handle.length;
  var error = err;
  var hasError = Boolean(err);

  debug('%s %s : %s', handle.name || '<anonymous>', route, req.originalUrl);

  try {
    if (hasError && arity === 4) {
      // 执行错误处理中间件
      handle(err, req, res, next);
      return;
    } else if (!hasError && arity < 4) {
      // 执行一般中间件
      handle(req, res, next);
      return;
    }
  } catch (e) {
    // replace the error
    error = e;
  }

  // continue
  next(error);
}
```

## connect运行过程

通过下面的这张图，总结一下connect工作流程，app.use方法负责把中间件添加到stack数组中，中间件会被格式化成形为{route: route , handle : fn}的匿名对象存放 ；app.handle方法根据当前路径找到stack中所有与之相匹配的中间件，并通过call方法调用中间件处理函数 ；app.call方法根据handle函数的参数个数(3个参数为一般中间件，4个参数为错误处理中间件) 来执行中间件，并把接收的next函数传给中间件。

![mark](https://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/5ce8BaBg39.png)

## 完整源码

```javascript
'use strict';

// 引入依赖
var debug = require('debug')('connect:dispatcher');
var EventEmitter = require('events').EventEmitter;
var finalhandler = require('finalhandler');
var http = require('http');
var merge = require('utils-merge');
var parseUrl = require('parseurl');


// 模块出口
module.exports = createServer;


// 判断当前环境，初始化proto 对象
var env = process.env.NODE_ENV || 'development';
var proto = {};


var defer = typeof setImmediate === 'function'
  ? setImmediate
  : function(fn){ process.nextTick(fn.bind.apply(fn, arguments)) }


function createServer() {
  // app 函数对象，可以添加属性和方法
  function app(req, res, next){ 
    app.handle(req, res, next); 
  }
  // 相当于Object.assign
  merge(app, proto); // 继承proto的属性和方法
  merge(app, EventEmitter.prototype); // 继承EventEmitter（事件派发器）属性和方法
  app.route = '/';
  app.stack = []; // 存放中间件的数组,中间件会被格式化成形为{route: route , handle : fn}的匿名对象存放
  return app;
}

// 监听指定端口号
proto.listen = function listen() {
  var server = http.createServer(this); // this ——> app函数对象,作为request事件的处理函数
  return server.listen.apply(server, arguments); // 从 arguments 拿到端口号
};

// 添加中间件
proto.use = function use(route, fn) {
  var handle = fn;
  var path = route;

  // 如果参数只有一个，那么path默认是 '/', 传入的参数作为处理函数
  if (typeof route !== 'string') {
    handle = route;
    path = '/';
  }

  // 如果fn为一个app的实例，则将其自身handle方法给fn
  if (typeof handle.handle === 'function') {
    var server = handle;
    server.route = path;
    handle = function (req, res, next) {
      server.handle(req, res, next);
    };
  }

  // 如果fn为一个http.Server实例，则fn为其request事件的第一个监听器
  if (handle instanceof http.Server) {
    handle = handle.listeners('request')[0];
  }

  // 如果route参数的以 '/' 结尾，则删除 '/'
  if (path[path.length - 1] === '/') {
    path = path.slice(0, -1);
  }

  // 把中间件添加到stack数组中
  debug('use %s %s', path || '/', handle.name || 'anonymous');
  this.stack.push({ route: path, handle: handle });

  // 返回自身，以便继续链式调用
  return this;
};

// 这个函数作用是根据当前路径找到stack中所有与之相匹配的中间件，并通过call方法调用中间件处理函数
proto.handle = function handle(req, res, out) {
  var index = 0;
  var protohost = getProtohost(req.url) || '';
  var removed = '';
  var slashAdded = false;
  var stack = this.stack;

  // final function handler
  var done = out || finalhandler(req, res, {
    env: env,
    onerror: logerror
  });

  // store the original URL
  req.originalUrl = req.originalUrl || req.url;

  function next(err) {
    if (slashAdded) {
      req.url = req.url.substr(1);
      slashAdded = false;
    }

    if (removed.length !== 0) {
      req.url = protohost + removed + req.url.substr(protohost.length);
      removed = '';
    }

    // next callback
    var layer = stack[index++];

    // all done
    if (!layer) {
      defer(done, err);
      return;
    }

    // route data
    var path = parseUrl(req).pathname || '/';
    var route = layer.route;

    // skip this layer if the route doesn't match
    if (path.toLowerCase().substr(0, route.length) !== route.toLowerCase()) {
      return next(err);
    }

    // skip if route match does not border "/", ".", or end
    var c = path.length > route.length && path[route.length];
    if (c && c !== '/' && c !== '.') {
      return next(err);
    }

    // trim off the part of the url that matches the route
    if (route.length !== 0 && route !== '/') {
      removed = route;
      req.url = protohost + req.url.substr(protohost.length + removed.length);

      // ensure leading slash
      if (!protohost && req.url[0] !== '/') {
        req.url = '/' + req.url;
        slashAdded = true;
      }
    }

    // 通过call方法调用中间件的handle函数处理对应的路由
    call(layer.handle, route, err, req, res, next);
  }

  next();
};

function call(handle, route, err, req, res, next) {
  // handle函数的参数个数(3个参数为一般中间件，4个参数为错误处理中间件)
  // next参数接收的是上面定义的next函数，然后传入到中间件的handle函数中，handle函数同样通过next参数接收，所以在中间件中调用next后会继续执行下一个中间件
  var arity = handle.length;
  var error = err;
  var hasError = Boolean(err);

  debug('%s %s : %s', handle.name || '<anonymous>', route, req.originalUrl);

  try {
    if (hasError && arity === 4) {
      // 执行错误处理中间件
      handle(err, req, res, next);
      return;
    } else if (!hasError && arity < 4) {
      // 执行一般中间件
      handle(req, res, next);
      return;
    }
  } catch (e) {
    // replace the error
    error = e;
  }

  // continue
  next(error);
}

function logerror(err) {
  if (env !== 'test') console.error(err.stack || err.toString());
}

function getProtohost(url) {
  if (url.length === 0 || url[0] === '/') {
    return undefined;
  }

  var searchIndex = url.indexOf('?');
  var pathLength = searchIndex !== -1 ? searchIndex : url.length;
  var fqdnIndex = url.substr(0, pathLength).indexOf('://');

  return fqdnIndex !== -1 ? url.substr(0, url.indexOf('/', 3 + fqdnIndex)) : undefined;
}
```
