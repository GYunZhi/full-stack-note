## 基础知识

### TCP/IP协议

TCP/IP代表传输控制协议/网际协议，指的是一系列协议，TCP/IP 模型在 OSI 模型的基础上进行了简化，变成了四层，从上到下分别为：**应用层、传输层、网络层、数据链路层**，与 OSI 体系结构对比如下：

![mark](http://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/20191212/105605461.png)

TCP/IP协议栈每层都有相应的协议，如下图

![img](http://5b0988e595225.cdn.sohucs.com/images/20190622/9dbde0322cc1482fa17b38a4e3bfe664.jpeg)

**IP：**

网络层协议；（高速公路）

**TCP和UDP：**

传输层协议；（卡车）

**HTTP：**

应用层协议；（货物）。HTTP(超文本传输协议)是利用TCP在两台电脑(通常是Web服务器和客户端)之间传输信息的协议。客户端使用Web浏览器发起HTTP请求给Web服务器，Web服务器发送被请求的信息给客户端。

**SOCKET：**

套接字，TCP/IP网络的API。(港口码头/车站)Socket是应用层与TCP/IP协议族通信的中间软件抽象层，它是一组接口。socket是在应用层和传输层之间的一个抽象层，它把TCP/IP层复杂的操作抽象为几个简单的接口供应用层调用已实现进程在网络中通信。

**TCP/UDP区别：**

**TCP**

（传输控制协议，Transmission Control Protocol）：(类似打电话)

面向连接、传输可靠（保证数据正确性）、有序（保证数据顺序）、传输大量数据（流模式）、速度慢、对系统资源的要求多，程序结构较复杂，

每一条TCP连接只能是点到点的，

TCP首部开销20字节。

**UDP**

(用户数据报协议，User Data Protocol)：（类似发短信）

面向非连接 、传输不可靠（可能丢包）、无序、传输少量数据（数据报模式）、速度快，对系统资源的要求少，程序结构较简单 ，

UDP支持一对一，一对多，多对一和多对多的交互通信，

UDP的首部开销小，只有8个字节。

### tcp三次握手建立连接

第一次握手：客户端发送syn包(seq=x)到服务器，并进入SYN_SEND状态，等待服务器确认；

第二次握手：服务器收到syn包，必须确认客户的SYN（ack=x+1），同时自己也发送一个SYN包（seq=y），即SYN+ACK包，此时服务器进入SYN_RECV状态；

第三次握手：客户端收到服务器的SYN＋ACK包，向服务器发送确认包ACK(ack=y+1)，此包发送完毕，客户端和服务器进入ESTABLISHED状态，完成三次握手。

握手过程中传送的包里不包含数据，三次握手完毕后，客户端与服务器才正式开始传送数据。理想状态下，TCP连接一旦建立，在通信双方中的任何一方主动关闭连接之前，TCP 连接都将被一直保持下去。

主机A向主机B发出连接请求数据包：“我想给你发数据，可以吗？”，这是第一次对话；

主机B向主机A发送同意连接和要求同步（同步就是两台主机一个在发送，一个在接收，协调工作）的数据包：“可以，你什么时候发？”，这是第二次对话；

主机A再发出一个数据包确认主机B的要求同步：“我现在就发，你接着吧！”，这是第三次对话。

三次“对话”的目的是使数据包的发送和接收同步，经过三次“对话”之后，主机A才向主机B正式发送数据。

### tcp四次挥手断开连接

1）客户端进程发出连接释放报文，并且停止发送数据。释放数据报文首部，FIN=1，其序列号为seq=u（等于前面已经传送过来的数据的最后一个字节的序号加1），此时，客户端进入FIN-WAIT-1（终止等待1）状态。 TCP规定，FIN报文段即使不携带数据，也要消耗一个序号。

2）服务器收到连接释放报文，发出确认报文，ACK=1，ack=u+1，并且带上自己的序列号seq=v，此时，服务端就进入了CLOSE-WAIT（关闭等待）状态。TCP服务器通知高层的应用进程，客户端向服务器的方向就释放了，这时候处于半关闭状态，即客户端已经没有数据要发送了，但是服务器若发送数据，客户端依然要接受。这个状态还要持续一段时间，也就是整个CLOSE-WAIT状态持续的时间。

3）客户端收到服务器的确认请求后，此时，客户端就进入FIN-WAIT-2（终止等待2）状态，等待服务器发送连接释放报文（在这之前还需要接受服务器发送的最后的数据）。

4）服务器将最后的数据发送完毕后，就向客户端发送连接释放报文，FIN=1，ack=u+1，由于在半关闭状态，服务器很可能又发送了一些数据，假定此时的序列号为seq=w，此时，服务器就进入了LAST-ACK（最后确认）状态，等待客户端的确认。

5）客户端收到服务器的连接释放报文后，必须发出确认，ACK=1，ack=w+1，而自己的序列号是seq=u+1，此时，客户端就进入了TIME-WAIT（时间等待）状态。注意此时TCP连接还没有释放，必须经过2∗∗MSL（最长报文段寿命）的时间后，当客户端撤销相应的TCB后，才进入CLOSED状态。

6）服务器只要收到了客户端发出的确认，立即进入CLOSED状态。同样，撤销TCB后，就结束了这次的TCP连接。可以看到，服务器结束TCP连接的时间要比客户端早一些。

## HTTP协议

HTTP协议的详细知识可以参考另一篇文档 **HTTP详解** ，这里我们来看一下基于HTTP协议的网络编程中的一些常见问题。

- 跨域以及如何处理跨域问题
- 埋点应用
- 爬虫
- bodyparse
- 上传、下载

### 跨域以及如何处理跨域问题

**什么是跨域**

浏览器同源策略引起的接口调用问题 ，协议、端口、域名只有有一个不同，就会引起跨域。

```js
// index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <h1>跨域测试</h1>
  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  <script>
    (async () => {

      axios.defaults.baseURL = 'http://localhost:4000'
      
      // 简单请求
      const res = await axios.get("/api/users")
    })()
  </script>
</body>
</html>

// api.js
const http = require("http")
const fs = require("fs")

let app = http.createServer((req, res) => {
  const { method, url } = req
  if (method == "GET" && url == "/") {
    fs.readFile(__dirname + "/index.html", (err, data) => {
      res.setHeader("Content-Type", "text/html")
      res.end(data)
    })
  }if ((method == "GET" || method == "POST") && url == "/api/users") {
    res.setHeader("Content-Type", "application/json")
    res.end(JSON.stringify([{ name: "gongyz", age: 20 }]))
  }
})

app.listen(4000)

// proxy.js
var express = require('express');
const app = express()

app.use(express.static(__dirname + '/'))

app.listen(5000)
```

上面的代码，当我们访问 localhost:4000 时，不存在跨域问题，当我们访问  localhost:5000/index.html 时，就会产生跨域问题。

![mark](http://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/20191212/141207147.png)

**常用解决方案**

- **JSONP(JSON with Padding)，前端 + 后端方案，绕过跨域**
  前端构造script标签请求指定URL（由script标签发出的GET请求不受同源策略限制），服务器返回一个函数
  执行语句，该函数名称通常由查询参数callback的值决定，函数的参数为服务器返回的json数据。该函数在前
  端执行后即可获取数据。
- **代理服务器**
  请求同源服务器，通过该服务器转发请求至目标服务器，得到结果再转发给前端。前端开发中测试服务器的代理功能就是采用的该解决方案，但是最终发布上线时如果web应用和接口服务器不在一起仍会跨域。需要使用nginx 进行反向代理。

- **CORS(Cross Origin Resource Share) - 跨域资源共享，后端方案，解决跨域**  

**代理服务器**

```js
// index.html 去掉 axios.defaults.baseURL = 'http://localhost:4000'

// proxy.js
var express = require('express');
const proxy = require('http-proxy-middleware')

const app = express()

app.use(express.static(__dirname + '/'))

app.use('/api', proxy({ target: 'http://localhost:4000', changeOrigin: false }))

app.listen(5000)
```

浏览器中发起同域请求，服务端使用 http-proxy-middleware 模块将请求代理到 api 服务器，也可以使用本机的 nginx 进行代理。（webpack dev server 也是用 http-proxy-middleware模块实现代理）

```nginx
server {
	listen	80;
  # server_name  www.gongyz.cn;
  location / {
    root   /var/www/html;		# 静态文件地址
    index  index.html index.htm;
    try_files $uri $uri/ /index.html;
  }

  location /api {
  	proxy_pass  http://127.0.0.1:4000;
    proxy_redirect     off;
    proxy_set_header   Host             $host;
    proxy_set_header   X-Real-IP        $remote_addr;
    proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
  }
}
```

**CORS- 跨域资源共享 **

原理：CORS 是 W3C 规范，真正意义上解决跨域问题。它需要**服务器对请求进行检查并对响应头做相应处理**，从而允许跨域请求 。

**具体实现：**

- 简单请求：动词为get/post/head，没有自定义请求头，Content-Type是application/x-www-formurlencoded，multipart/form-data或text/plain之一，通过添加以下响应头解决：

```nginx
res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000' || '*')
```

- 复杂请求需要响应浏览器发出的options请求（预检请求），并根据情况设置响应头  

```js
// index.html
const res = await axios.post("/api/users",null,{ 
  headers: {
    'X-Token': '12345678'
  }
})


if (method == "OPTIONS" && url == "/api/users") {
  res.writeHead(200, {
    "Access-Control-Allow-Origin": "http://localhost:5000",
    "Access-Control-Allow-Headers": "X-Token,Content-Type",
    "Access-Control-Allow-Methods": "PUT"  // 允许 PUT 请求
  })
  res.end()
}
```

通过添加自定义的X-Token请求头使请求变为复杂请求，则服务器需要允许**X-Token**，若请求为post，**还传递了参数**，则服务器还需要允许**Content-Type**请求头。

```js
const res = await axios.post("/api/users",{name: 'gongyz'},{ 
  headers: {
  	'X-Token': '12345678'
  }
})
```

跨域处理 **cookie**

axios 跨域时默认不传递 cookie，如果需要传递 cookie，需要经过以下设置：

```js
// index.html
axios.defaults.withCredentials = true

// api.js
// 预检options中和/users接口中均需添加
res.setHeader('Access-Control-Allow-Credentials', 'true')

// 设置cookie
res.setHeader('Set-Cookie', 'name=gongyz;')

// 观察cookie是否存在
console.log('cookie',req.headers.cookie)
```

### 埋点应用

```js
// 利用 img.src 提交搜集的信息
const img = new Image()
img.src='/api/users?abc=123'
```

### 爬虫

```js
// 简单爬虫
const originRequest = require("request");
const cheerio = require("cheerio");
const iconv = require("iconv-lite");

function request(url, callback) {
    const options = {
        url: url,
        encoding: null
    };
    originRequest(url, options, callback);
}

for (let i = 100553; i < 100563; i++) {
    const url = `https://www.dy2018.com/i/${i}.html`;
    request(url, function (err, res, body) {
        const html = iconv.decode(body, "gb2312");
        const $ = cheerio.load(html);
        console.log($(".title_all h1").text());
    });
}
```

### body-parse

- application/x-www-form-urlencoded  

```js
<form action="/api/save" method="post">
  <input type="text" name="age" value="123">
  <input type="file" name="file">
  <input type="submit">
</form>
```

- application/json  

```js
await axios.post("/api/save",{name: 'gongyz', age: 12})

// 模拟 application/x-www-form-urlencoded
await axios.post("/api/save", 'name=gongyz&bage=23', {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
})

// index.js
if (method === 'POST' && url === '/api/save') {
  var str = ''
  req.on('data', function(chunk) {
    str += chunk // 用 + 进行字符串拼接时，会自动对chunk进行字符串转换，等同于 chunk.toString()
  })
  req.on('end', function() {
    res.end(str)
  })
}
```

### 上传/下载

**上传文件**

```js
// index.html
<form action="/api/upload" method="post" enctype="multipart/form-data">
  <input type="file" name="file" />
  <input type="submit" />
</form>

// index.js
const multer = require('@koa/multer')

var storage = multer.diskStorage({
  //文件保存路径
  destination: function(req, file, cb) {
    cb(null, './uploads/')
  },
  //修改文件名称
  filename: function(req, file, cb) {
    var fileFormat = file.originalname.split('.') // 以点分割成数组，数组的最后一项就是后缀名
    cb(null, Date.now() + '.' + fileFormat[fileFormat.length - 1])
  }
})

//加载配置
var upload = multer({ storage: storage }) // note you can pass `multer` options here

const router = new Router()

router.post('/api/upload', upload.single('file'), async (ctx, next) => {
  ctx.body = {
    filename: ctx.request.file.filename // 返回文件名
  }
})
```

**下载文件**

```js
// index.html
<a href="/api/download" target="_self">download</a>

// index.js
const http = require('http')
const fs = require('fs')

const app = http.createServer((req, res) => {
  const { method, url } = req
  if (method == 'GET' && url == '/') {
    fs.readFile(__dirname + '/index.html', (err, data) => {
      res.setHeader('Content-Type', 'text/html')
      res.end(data)
    })
  } else if (method === 'GET' && url === '/api/download') {
    fs.readFile(__dirname + '/file.pdf', (err, data) => {
      // 下载报头解决打开方式
      res.setHeader('Content-Type', 'application/pdf')
      const fileName = encodeURI('内容生产系统')
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}.pdf"`)
      res.end(data)
    })
  }
})

app.listen(4000)
```

## 实现一个即时通讯IM

### Socket实现

原理：Net模块提供一个异步API能够创建基于流的TCP服务器，客户端与服务器建立连接后，服务器可以获得一个全双工Socket对象，服务器可以保存Socket对象列表，在接收某客户端消息时，推送给其他客户端。  

```js
// socket.js
const net = require('net')
const chatServer = net.createServer()
const clientList = []
chatServer.on('connection', client => {
  client.write('Hi!\n')
  clientList.push(client)
  client.on('data', data => {
    console.log('receive:', data.toString())
    clientList.forEach(v => {
      v.write(data)
    })
  })
})
chatServer.listen(9000)

```

通过 telnet 连接服务器

```bash
# 连接服务器
open localhost 9000

# 进入命令模式并发送消息（ctrl + ]）
send 123
```

### http实现

原理：客户端通过ajax方式发送数据给http服务器，服务器缓存消息，其他客户端通过轮询方式查询最新数据并更新列表 。

```js
// index.html
<html>
  <head>
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  </head>

  <body>
    <div id="app">
      <input v-model="message" />
      <button v-on:click="send">发送</button>
      <button v-on:click="clear">清空</button>
      <div v-for="item in list">{{item}}</div>
    </div>

    <script>
      const host = 'http://localhost:3000'
      var app = new Vue({
        el: '#app',
        data: {
          list: [],
          message: 'Hello Vue!'
        },
        methods: {
          send: async function() {
            let res = await axios.post(host + '/send', {
              message: this.message
            })
            this.list = res.data
          },
          clear: async function() {
            let res = await axios.post(host + '/clear')
            this.list = res.data
          }
        },
        mounted: function() {
          setInterval(async () => {
            const res = await axios.get(host + '/list')
            this.list = res.data
          }, 1000)
        }
      })
    </script>
  </body>
</html>


// index.js
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')

app.use(bodyParser.json())

const list = ['ccc', 'ddd']

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/index.html'))
})

app.get('/list', (req, res) => {
  res.end(JSON.stringify(list))
})

app.post('/send', (req, res) => {
  list.push(req.body.message)
  res.end(JSON.stringify(list))
})

app.post('/clear', (req, res) => {
  list.length = 0
  res.end(JSON.stringify(list))
})

app.listen(3000)

```

### Socket.IO实现

安装： npm install --save [socket.io](https://github.com/socketio/socket.io)
两部分：nodejs模块，[客户端js](https://github.com/socketio/socket.io-client)  

```js
// index.html
<ul id="messages"></ul>
<form action="">
  <input id="m" autocomplete="off" />
  <button>Send</button>
</form>

<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.js"></script>
<script src="http://libs.baidu.com/jquery/2.1.1/jquery.min.js"></script>
<script>
  $(function() {
    var socket = io()
    $('form').submit(function(e) {
      e.preventDefault() // 避免表单提交行为
      socket.emit('chat message', $('#m').val())
      $('#m').val('')
      return false
    })

    socket.on('chat message', function(msg) {
      $('#messages').append($('<li>').text(msg))
    })
  })
</script>

// index.js
var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', function(socket) {
  console.log('a user connected')

  //响应某用户发送消息
  socket.on('chat message', function(msg) {
    console.log('chat message:' + msg)

    // 广播给所有人
    io.emit('chat message', msg)
    // 广播给除了发送者外所有人
    // socket.broadcast.emit('chat message', msg)
  })

  socket.on('disconnect', function() {
    console.log('user disconnected')
  })
})

http.listen(3000, function() {
  console.log('listening on *:3000')
})

```

