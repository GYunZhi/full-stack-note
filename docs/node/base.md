## 学习 Node 的目标

- 优秀的前端—可以和后端有效沟通
- 敏捷的全栈—快速开发全栈应用
- 架构师—践行工程化思想

## 模块 - module

### 概述

Node应用由模块组成，采用CommonJS模块化规范，在node中一个文件就是一个模块，每个模块都有自己的作用域。

### 特点

- 所有代码都运行在模块作用域，不会污染全局作用域。
- 模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。要想让模块再次运行，必须清除缓存。
- 模块加载的顺序，按照其在代码中出现的顺序。

### 主要内容

####       module 对象

CommonJS规范规定，每个模块内部，都有一个module对象，代表当前模块,它的exports属性是对外的接口。加载某个模块，其实是加载该模块的module.exports属性。

module对象的属性：

```js
module.id        # 模块的识别符，通常是带有绝对路径的模块文件名。
module.filename  # 模块的文件名，带有绝对路径。  	
module.loaded    # 返回一个布尔值，表示模块是否已经完成加载。
module.parent    # 返回一个对象，表示调用该模块的模块。
module.children  # 返回一个数组，表示该模块要用到的其他模块。
module.exports   # 表示模块对外输出的值。
```

####       require 方法

Node使用CommonJS模块规范，内置的require()用于加载模块文件,require命令的基本功能是，读入并执行一个JavaScript文件，然后返回该模块的module.exports属性。

####       exports 变量

在模块中，还有一个变量exports，它是module.exports对象的引用，在使用exports变量时，注意不要破坏它和module.exports对象之间的引用关系。我们经常看到这样的写法：

```js
exports = module.exports = somethings
```

上面的代码等价于:

```js
module.exports = somethings

exports = module.exports
```

原理很简单，即 module.exports 指向新的对象时，exports 断开了与 module.exports 的引用，那么通过exports = module.exports 让 exports 重新指向 module.exports 即可。

```js
function add (x, y) {
  return x + y
}

function minus (x, y) {
  return x -y
}

// ES Module 导出的模块，在使用 require 函数导入时默认放在了 default 属性下面
export default {
  add,
  minus
}

// 改变 module.exports 的引用之后，后面再使用 exports 是无效的
// module.exports = {
//   add
// }

// exports.minus = minus 

// 保证 exports 和 module.exports 引用关系不被破坏
// exports = module.exports = {
//   add
// }

// exports.minus = minus 
```

###  模块加载中的两个问题

1. 路径问题：根据参数的不同格式，require命令去不同路径寻找模块文件。

​    （1） 如果参数字符串以“/”开头，则表示加载的是一个位于绝对路径的模块文件。

​      比如，`require('E:/NodeJs/module/2.js')`

​    （2）如果参数字符串以“./”开头，则表示加载的是一个位于相对路径（当前目录）的模块文件。

​      比如，`require('./2.js')`

​    （3）如果参数字符串不以“./“或”/“开头，则表示加载node的核心模块，或者是node_modules下面的模块

​      比如，`require('fs')`

2. 文件查找问题

​    (1)首先按照加载的模块的文件名称进行查找

​    (2)如果没有找到，则会在模块文件名称后面加上.js后缀，进行查找

​    (3)如果还没有找到，则会在模块文件名称后面加上.json后缀，进行查找

​    (4)如果还没有找到，则会在模块文件名称后面加上.node后缀，进行查找

​    (5)以上都没有找到就会报错

## 全局变量 - global

全局变量在所有模块中均可使用。 

以下变量虽然看起来像全局变量，但实际上不是。 它们的作用域只在模块内，详见 [module文档](http://nodejs.cn/s/TQHXpm)：

- [`__dirname`](http://nodejs.cn/s/etUQhi)
- [`__filename`](http://nodejs.cn/s/RH6qCV)
- [`exports`](http://nodejs.cn/s/JzVhDV)
- [`module`](http://nodejs.cn/s/2UCVu5)
- [`require()`](http://nodejs.cn/s/Hig9sg)

### process - 进程

process对象是一个全局变量，可以在任何地方都能访问到它，通过这个对象提供的属性和方法，使我们可以对当前运行的程序的进程进行访问和控制。

```javascript
process.argv      # 返回一个包含命令行参数的数组
process.env       # 返回用户环境信息
process.version   # 返回node版本信息
process.versions  # 返回node及node依赖包版本信息
process.pid       # 返回进程的pid
process.title     # 返回当前进程显示的名称
process.arch      # 返回CPU处理器架构
```

 

```javascript
stdin、stdout：标准输入输出流（I/O操作）

process.stdin.resume()  // 开启输入流, 监听输入流数据，默认开启
process.stdin.pause()   // 关闭输入流

例1: 监听用户的输入数据

process.stdin.on('data', function (chunnk){
	console.log('用户输入了:' + chunnk )
	process.stdin.pause();
});

例2: 要求用户输入两个数值，然后把和输出到终端

var num1, num2;
process.stdout.write('请输入num1的值：');
process.stdin.on('data', function (chunk) {
  if (!num1) {
    num1 = Number(chunk);
    process.stdout.write('请输入num2的值: ');
  } else {
      num2 = Number(chunk)
      process.stdout.write('结果是：' + (num1 + num2))
      process.stdin.pause()
   }
})
```

**提示：vscode的内置调试控制台默认不从stdout的输出流中抓取内容，需要在vscode的启动配置(launch.json)中添加如下配置：** 

```javascript
{
  // 使用 IntelliSense 了解相关属性。 
  // 悬停以查看现有属性的描述。
  // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
  
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "outputCapture": "std",        // 抓取stdout输出流的内容
            "console": "externalTerminal", // 另外打开控制台
            "name": "启动程序",
            "program": "${file}"
        }
    ]
}
```

### Buffer

`Buffer` 类用于操作二进制数据流 。

```javascript
(1) Buffer.alloc(5) 		创建一个Buffer对象，并为这个对象分配空间大小

  var bf = Buffer.alloc(5)
  console.log(bf)

  // 当我们为一个Buffer对象分配空间大小之后，其长度是固定的，不能更改
  bf[5]=1;
  console.log(bf);

(2) Buffer.alloc(4, 'abcd')  创建一个Buffer对象，并初始化

  var bf=Buffer.alloc(4, 'abcd');
  console.log(bf);

(3) Buffer.from(sring,[encoding]) 创建一个Buffer对象，并使用字符串初始化,第二个参数用于指定字符串编码

  var bf=new Buffer('miaov','utf-8');
  console.log(bf);

 (4) buf.length // 输出的是字节长度
 
   var str1='miaov';
   console.log(str1.length);
   var bf=new Buffer(str1);
   console.log(bf.length);
   var str2='妙味';
   console.log(str2.length);
   var bf2=new Buffer(str2);
   console.log(bf2.length); // 输出的是字节长度
```

常用方法

```javascript
(1) buf.write(string[, offset[, length]][, encoding]) 将字符串写入到Buffer中
    string 要写入 buf 的字符串。
    offset 从Buffer对象中的第几位开始写入。默认: 0。
    length 写入的字符串的长度。默认: buf.length - offset。
    encoding 字符编码。默认: 'utf8'。

    var str='miaov';
    var bf=new Buffer(5);
    bf.write(str);

    bf.write(str,1);
    console.log(bf);

    bf.write(str,1,2);
    console.log(bf);


(2) buf.toString([encoding[, start[, end]]]) 根据encoding参数，将Buffer对象输出为字符串

    var bf=new Buffer('miaov');
    console.log(bf.toString());
    console.log(bf.toString('utf-8',1,3)); //不包含结束位

    var bf2=new Buffer('妙味');
    console.log(bf2);
    console.log(bf2.toString('utf-8',1));
    

 (3) buf.toJSON()	将Buffer对象转换为JSON格式

    var bf=new Buffer('miaov');
    console.log(bf.toJSON()); 	// {type: 'Buffer', data:[109,105,97,111,118]}
    

 (4) buf.slice([start[, end]])	返回一个新的buffer，这个buffer将和老的buffer引用相同的内存地址

    注意：修改这个新的buffer对象，会改变原来老的buffer对象

    var bf=new Buffer('miaov');
    console.log(bf);
    var bf2=bf.slice(2);
    console.log(bf2);

    bf2[0]=2;
    console.log(bf2);
    console.log(bf); // 老的buffer也被改变了


 (5) bf.copy(targetBuffer,[targetStart],[sourceStart],[sourceEnd])	进行buffer的拷贝

    修改新的buffer对象，不会会改变原来老的buffer对象

    var bf=new Buffer('miaov');
    console.log(bf);

    var bf2=new Buffer(6);
    bf.copy(bf2); //将bf中的内容拷贝到bf2中
    console.log(bf2);

    bf2[0]=2;
    console.log(bf2);
    console.log(bf);
```



静态方法

```javascript
Buffer.isEncoding('utf-8')        # 检测Buffer对象是否支持某种编码

Buffer.isBuffer(bf)               # 判断某个对象是否是Buffer对象

Buffer.byteLength(str)            # 返回该字符串的字节长度，encoding编码默认是utf-8

Buffer.concat(arr,[totallLength]) # 返回一个将传入的buffer数组中所有的buffer对象拼接在一起新的buffer对象

var str1='miaov';
var str2='妙味';
var arr=[new Buffer(str1),new Buffer(str2)];
var bf=Buffer.concat(arr,11);		// 当第二个参数不给的时候，程序会默认计算buffer数组的总字节长度
```

```javascript
// 标准输入输出流中的内容也是二进制数据
process.stdout.write('请输入内容:');
process.stdin.resume();
process.stdin.on('data',function (chunk){
  console.log(chunk); // <Buffer 61 0a>   0a：回车
  console.log(chunk.toString());
  console.log('输入的内容是：' + chunk); // 用+进行字符串拼接时，会自动对chunk进行字符串转换
  process.stdin.pause();
})
```
## 文件系统 - fs

`fs` 模块提供了一些 API，用于与文件系统进行交互，所有的文件系统操作都有异步和同步两种形式。 

### 读写操作

```javascript
（1）打开一个文件
	fs.open(path,flags,[mode],callback)  异步
	fs.openSync(path, flags, [mode])     同步
	
  path:  文件路径
  flags: 打开文件的模式 读/写
  mode:  设置文件的模式 读/写/执行  4/2/1
  callback:
    err: 文件打开失败时错误信息保存在err对象里面，如果成功err为null
    fd： 打开的文件的标识

  var fs = require('fs');
  var fileName = __dirname + '/' + '1.txt'

  //异步方式
  fs.open(fileName, 'r', function (err, fd) {
    console.log(fd);
  })

  //同步方式
  var fd = fs.openSync(fileName, 'r');
  console.log(fd);
```

```javascript
（2）读取文件内容，从指定的文档标识符fd读取文件数据

	fs.read(fd, buffer, offset, length, position, callback)  异步
	fs.readSync(fd, buffer, offset, length, position)				同步,返回bytesRead的个数

  fd: 通过open方法成功打开一个文件返回的编号,用来标识打开的文件
  buffer：数据将被写入到的 buffer 对象
  offset: 读取的内容添加到buffer中的起始位置
  length: 是一个整数，指定要读取的字节数
  position: 读取文件的起始位置
  callback: 
    error: 文件读取失败时错误信息保存在err对象里面，如果成功err为null
    bytesRead: 读取的字节数
    buffer: 读取完成之后的buffer对象

  var fs = require('fs');
  var fileName = __dirname + '/' + '1.txt'
	
	// 异步方式
  fs.open(fileName, 'r', function (err, fd) {
    if (err) {
      console.log('文件打开失败');
    } else {
      var bf1 = new Buffer(10);
      fs.read(fd, bf1, 0, 4, null, function (error, bytesRead, buf) {
        console.log(bytesRead);
        console.log(buf);
        console.log(buf.toString());
      })
    }
  })
  
  // 同步方式
  fs.open(fileName, 'r', function (err, fd) {
    if (err) {
      console.log('文件打开失败');
    } else {
      var bf1 = new Buffer(10);
      var bytesRead = fs.readSync(fd, bf1, 0, 2, null)
      console.log(bytesRead)
    }
  })
```

```javascript
(3) 写入数据到指定文件中/关闭打开的文件

  异步
  写入 buffer 到 fd 指定的文件
  fs.write(fd, buffer, offset, length[, position], callback) 
  
    fd: 打开文件的标识
    buffer：要写入的数据
    offset：buffer对象中要写入的数据的起始位置
    length: 是一个整数，指定要写入的字节数
    position：指向从文件开始写入数据的的起始位置
    callback：
         error: 文件写入失败时错误信息保存在error对象里面，如果成功error为null
         bytesWritten: 写入的字节数
         buffer: 读取完成之后的buffer对象
 
	写入 string 到 fd 指定的文件，如果 string 不是一个字符串，则该值将被强制转换为一个字符串。
  fs.write(fd, string[, position[, encoding]], callback) 
   	fd: 打开文件的标识
    string：写入string 到 fd 指定的文件
    position：指向从文件开始写入数据的的起始位置
    callback：
         error:  文件写入失败时错误信息保存在error对象里面，如果成功error为null
         written: 写入的字节数
         string: 读取完成之后的buffer对象
         
 	关闭一个打开的文件
  fs.close(fd, callback)
 
  同步
  fs.writeSync(fd, buffer, offset, length[, position])
  fs.writeSync(fd, data[, position[, encoding]])
  fs.closeSync(fd)

	// 当我们要对打开的文件进行写操作的时候，打开文件的模式应该是读写方式 r+
  fs.open(fileName, 'r+', function (err, fd) {
  if (err) {
    console.log('打开文件失败');
  } else {
    var bf = new Buffer('abcd');
    fs.write(fd, bf, 0, 4, 0, function (err, bytesWritten, buf) {
      console.log(bytesWritten)
      console.log(buf.toString())
    })
    fs.write(fd, '123', 3, 'utf-8', function (err, written, string) {
      console.log(written)
      console.log(string)
    });
    fs.close(fd, function () {});
    fs.write(fd, '9', 7, 'utf-8', function () {}); //文件已经关闭，这段代码不会执行
  }
})


```

<u>`fs.open`</u>、`fs.read`、 `fs.write`等是更底层的操作，node提供了一些封装好的方法供开发者调用，可以更方便的对文件进行读写操作

```javascript
（1）写入数据
	fs.writeFlie(filename, data, [options], callback)  异步的将数据写入一个文件，如果该文件不存在，则新建，如果存在则覆盖原来的内容。data 可以是一个string，也可以是一个原生buffer。
	fs.writeFileSync(filename, data, [options])
	
	fs.appendFile(filename, data, [options], callback) 异步的将数据写入一个文件，如果该文件不存在，则新建，如果存在则添加到原内容后面。data 可以是一个string，也可以是一个原生buffer。
	fs.appendFileSync(filename, data, [options])
	
	fs.access(path[, mode], callback)    检查文件是否存在于当前目录
	
  var fs = require('fs');
  var filename = __dirname + '/' + '2.txt';
  
  fs.writeFile(filename, 'hello', function (err) {
    console.log(err);
  })

  fs.appendFile(filename, '-leo', function (err) {
    console.log(err);
  })

  fs.access(filename, fs.constants.F_OK, (err) => {
     console.log(`${filename} ${err ? '不存在' : '存在'}`);
  })

	// 结合fs.access对文件进行读取操作
  fs.access(filename, fs.constants.F_OK, (err) => {
     if(err) {
       fs.writeFile(filename,'hello',function (err){
         if(err){
           console.log('出错了');
         }else{
           console.log('创建新文件成功');
         }
     });
     } else {
       fs.appendFile(filename,'-leo',function (err){
         if(err){
           console.log('新的内容添加失败');
         }else{
           console.log('新的内容添加成功');
         }
       })
     }
  })

  // 同步模式
  fs.access(filename, fs.constants.F_OK, (err) => {
     if(err) {
       fs.writeFileSync(filename,'miaov');
       console.log('新文件创建成功');
     } else {
       fs.appendFile(filename,'-leo');
       console.log('新内容添加成功');
     }
  })
```

```javascript
（2）读取数据
	fs.readFile(filename, [options], callback) 异步读取一个文件的全部内容
	fs.readFileSync(filename, [options])
	
  var fs = require('fs');
  var filename = __dirname + '/' + '2.txt';

   fs.readFile(filename, function (err, data) {
     if (err) {
       console.log(' 文件读取失败');
     } else {
       console.log(data.toString());
     }
   })
```

### 常用的文件操作

```javascript
   fs.unlink(path, callback)  删除一个文件
   fs.rename(oldPath, newPath, callback)  重命名
   fs.stat(path, callback) 读取文件信息
   fs.watch(filename, [options], [listener]) 监控文件的修改

   var fs = require('fs');
   var filename = __dirname + '/' + '2.txt';

   fs.unlink(filename,function (err){
     if(err){
       console.log('删除成功');
     }else{
       console.log('删除失败');
     }
   })

  fs.rename(filename,__dirname + '/' + '3.txt',function (err){
     if(err){
       console.log('重命名失败');
     }else{
       console.log('重命名成功');
     }
   })

  fs.stat(filename, function (err, stats) {
    console.log(stats);
  })

  fs.watch(filename, function (eventType, fileName) {
    if (fileName) {
      console.log(eventType);
      console.log(fileName + '发生了改变');
    } 
  })
```

### 常用的文件夹操作

```javascript
  fs.mkdir(path, [mode], callback) 创建一个文件夹
  fs.rmdir(path, callback) 删除一个文件夹
  fs.readdir(path, callback) 读取文件夹

  var fs = require('fs');
   
  fs.mkdir(__dirname + '/1', function (err) {
     console.log(err);
  })

  fs.rmdir(__dirname + '/1',function (err){
    console.log(arguments);
  })


  fs.readdir(__dirname, function (err, fileList) {
    // console.log(fileList); // 返回值是一个数组，包含了该文件夹下所有文件
    fileList.forEach(function (item) {
      fs.stat(__dirname + '/' + item, function (err, stats) {
        switch (stats.mode) {
          case 16822:
            console.log('[文件夹]: ' + item);
            break;
          case 33206:
            console.log('[文件]: ' + item);
            break;
          default:
            console.log('其他类型: ' + item);
           break;
        }
      })
    })
  })
```

## 网络编程 - http

  通过http模块，可以非常方便的搭建一个 http 服务器

### 搭建http服务器

```javascript
  // 加载一个http模块
  var http = require('http');

  （1） 通过http模块下的 createServer 创建并返回一个http服务器对象 
      	http.createServer([requestListener])
      	requestListener : 监听到客户端连接的回调函数(request事件的回调函数，也可以采用下面的写法)
      	
   var server = http.createServer();

  （2） 监听客户端连接请求，只有当调用了listen方法以后，服务器才开始工作
        server.listen(port, [hostname], [backlog], [callback])
        port : 监听的端口
        hostname : 主机名（IP/域名)
        backlog : 连接等待队列的最大长度
        callback : 调用listen方法并成功开启监听以后，会触发一个listening事件，callback将作为该事件的					          执行函数

  server.listen(8080, 'localhost');

  (3) error 事件 当服务开启失败的时候触发的事件 参数err : 具体的错误对象

  server.on('error', function () {
    console.log('err');
  })

  (4) 当server调用listen方法并成功开始监听以后触发的事件，该事件的回调也可以在listen方法中使用

  server.on('listening', function () {
    console.log('listenning');
  })
 
 (5) request事件: 当有客户端发送请求的时候触发
     参数：
      req对象 ：通过它我们可以获取到这次请求的一些信息，比如头信息，数据等    
      res对象 ：通过他我们可以向该次请求的客户端输出返回响应
       
      req对象:    
      httpVersion : 使用的http协议的版本
      headers : 请求头信息中的数据
      url : 请求的地址
      method : 请求方式

      res对象 
      write(chunk, [encoding]) : 发送一个数据块到响应正文中
      end([chunk], [encoding]) : 当所有的正文和头信息发送完成以后调用该方法告诉服务器数据已经全部发送完成了，这个方法在每次完成信息发送以后必须调用，并且是最后调用
      statusCode : 该属性用来设置返回的状态码
      setHeader(name, value) : 设置返回头信息
      writeHead(statusCode, [reasonPhrase], [headers]) : 这个方法只能在当前请求中使用一次，并且必须在response.end()之前调用

  server.on('request',function (req,res){
    console.log('有用户连接进来了');
    res.writeHead(200,'OK',{
      //'content-type':'text/plain',//纯文本
      'content-type':'text/html;charset=utf-8'
    });
    res.write('<h1>你好，欢迎学习node</h1>');
    res.end(); // 当所有的正文和头信息发送完成以后调用该方法告诉服务器数据已经全部发送完成了
  })
```

### url处理

```javascript

上一个例子中，监听到request事件时(当有客户端发送请求时)，返回的数据都是一样的
实际开发过程中，对于不同请求，我们需要返回不同的数据,所以需要用到url模块对req对象中的url进行处理

var http = require('http');
var url = require('url');
 
(1)url.parse(request.url): 对url格式的字符串进行解析，返回一个对象,不同的url处理之后返回的数据是不同的 
var urlObj = url.parse('http://www.baidu.com:8080/a/b?age=23&name=jack#p=1')
console.log(urlObj);

(2)利用url模块处理request.url，对于不同的pathname(路径),返回不同的数据,即做出不同的响应

var server = http.createServer();
server.listen(8080, 'localhost');

server.on('request', function (req, res) {
  //req.url: 访问路径
  //console.log(req.url);
  var urlObj = url.parse(req.url);
  switch (urlObj.pathname) {
    case '/':
      //首页
      res.writeHead(200, {
        'content-type': 'text/html;charset=utf-8'
      })
      res.end('<h1>这是首页</h1>');
      break;
    case '/user':
      //个人中心
      res.writeHead(200, {
        'content-type': 'text/html;charset=utf-8'
      })
      res.end('<h1>这是个人中心</h1>');
      break;
     default:
     //处理其他情况
     res.writeHead(404, {
        'content-type': 'text/html;charset=utf-8'
     })
     res.end('<h1>页面不见了</h1>');
     break;
  }
})
```

### 请求数据处理 

```javascript
  使用fs模块实现nodejs代码和html的分离
 	queryString模块  对get和和post方法提交的数据进行处理
  	queryString.parse() : 将一个 querystring 反序列化为一个对象

    var http = require('http');
    var url = require('url');
    var fs = require('fs');

   通过req.method 拿到请求的方法
   (1) get请求的数据处理 ：get请求的数据在querystring中，通过url.parse解析之后可以存放在query属性中。 qs.parse(urlObj.query)
   (2) post请求的数据处理 : post发送的数据会被写入缓冲区中(buffer)，需要通过resquest的data和end事件来获取数据，并且用 + 进行字符串拼接或者 chunk.toString()，对chunk进行字符串转换。


var qs = require('querystring');
var server = http.createServer();

//保存html目录路径

var HtmlDir = __dirname + '/html';
server.listen(8080, 'localhost');
server.on('request', function (req, res) {
  var urlObj = url.parse(req.url);
  switch (urlObj.pathname) {
    case '/':
      // 首页
      sendData(HtmlDir + '/index.html', req, res);
      break;
    case '/user':
      // 个人中心
      sendData(HtmlDir + '/user.html', req, res);
      break;
    case '/login':
      // 登录页面
      sendData(HtmlDir + '/login.html', req, res);
      break;
    case '/login/check':
      // 登录验证
      // get请求
      // qs.parse(urlObj.query)   

      // post请求 nodejs用req.on(data)接收客户端的post请求数据
      if (req.method.toUpperCase() == 'POST') {
        var str = '';
        req.on('data', function (chunk) {
          str += chunk; // 用 + 进行字符串拼接时，会自动对chunk进行字符串转换，等同于 chunk.toString()
        })
        req.on('end', function () {
          console.log(qs.parse(str));
        })
      }
      break;
    default:
      //处理其他情况
      break;
  }
})

function sendData(file, req, res) {
  fs.readFile(file, function (err, data) {
    if (err) {
      res.writeHead(404, {
        'content-type': 'text/html;charset=utf-8'
      })
      res.end('<h1>页面不见了......</h1>');
    } else {
      res.writeHead(200, {
        'content-type': 'text/html;charset=utf-8'
      })
      res.end(data);
    }
  })
}

总结： http模块配合url模块、fs模块、queryString搭建了一个对于不同的http请求进行响应的web服务器
```

## 异步处理

### 流程控制

Node.js 通过回调函数来实现异步操作，这样很容易导致回调地狱，影响代码的可读性和可维护性。

```js
const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);

// 要求: 按顺序输出 1.txt、2.txt、3.txt 三个文件中的内容

// callback
fs.readFile(__dirname + "/1.txt", function(err, data) {
  if (err) {
    console.log(" 文件读取失败");
  } else {
    console.log(data.toString());
    fs.readFile(__dirname + "/2.txt", function(err, data) {
      if (err) {
        console.log(" 文件读取失败");
      } else {
        console.log(data.toString());
        fs.readFile(__dirname + "/3.txt", function(err, data) {
          if (err) {
            console.log(" 文件读取失败");
          } else {
            console.log(data.toString());
          }
        });
      }
    });
  }
});

// promise
// readFile(__dirname + "/1.txt").then(data => {
//   console.log(data.toString())
//   return readFile(__dirname + "/2.txt")
// }).then((data) => {
//   console.log(data.toString())
//   return readFile(__dirname + "/3.txt")
// }).then(data => {
//   console.log(data.toString())
// })

// generate
// const co = require("co")

// 自己实现一个 co 函数
// function co (gen) {
//   var it = gen()
//   function next(){
//     var result = it.next()
//     if (result.done) return result.value
//     result.value.then(function() {
//       next();
//     });
//   }
//   next();
// }

// const generator = function* () {
//   yield readFile(__dirname + "/1.txt").then(data => {
//     console.log(data.toString());
//   });
//   yield readFile(__dirname + "/2.txt").then(data => {
//     console.log(data.toString());
//   });
//   yield readFile(__dirname + "/3.txt").then(data => {
//     console.log(data.toString());
//   });
// };

// const gen = generator('Generator')
// gen.next()
// gen.next()
// gen.next()

// co(generator)

// async/await
// (async() => {
//   await readFile(__dirname + "/1.txt").then((data) => { console.log(data.toString()) })
//   await readFile(__dirname + "/2.txt").then((data) => { console.log(data.toString()) })
//   await readFile(__dirname + "/3.txt").then((data) => { console.log(data.toString()) })
// })()


```

### 异常处理

```js
// Node.js 回调风格
// 最后一个参数是回调函数
// 回调函数的参数为 (err, result)，前面是可能的错误，后面是正常的结果

const fs = require("fs");
const { promisify } = require("util");

function readFile(filename, callback) {
  try {
    let result = fs.readFileSync(filename);
    callback(null, result);
  } catch (error) {
    callback(error);
  }
}

// 回调方式
// readFile(__dirname + "/test.txt", (err, data) => {
//   if (err) {
//     console.log(" 文件读取失败");
//   } else {
//     console.log(data.toString());
//   }
// });

// promise
// const readFile2 = promisify(readFile)

// readFile2(__dirname + "/test.txt").then(data => {
//   console.log(data.toString());
// }).catch(err => {
//   console.log(" 文件读取失败");
// })

// async/await
const readFile3 = promisify(readFile)

setTimeout(async () => {
  try {
    let data = await readFile3(__dirname + "/test.txt")
    console.log(data.toString())
  } catch (err) {
    console.log("文件读取失败")
  }
})
```

