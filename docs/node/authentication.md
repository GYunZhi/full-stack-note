## 什么是鉴权

鉴权是指验证用户是否有权利访问系统的行为，简单说就是需要鉴定用户的身份。

## 鉴权的作用

HTTP 协议本身是无状态的，但是在实际的web开发中经常有一些操作需要状态，比如想要访问一些私人访问权限的文章、获取个人信息等都需要明确用户的身份。最简单的方案就是每次都发送账户和密码,但是这样的操作并不安全。

## 常见的鉴权方式

### session-cookie

![mark](http://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/20191223/140214652.png)

**实现原理：**

- 服务器在接受客户端首次访问时在服务器端创建seesion，然后保存seesion(我们可以将seesion保存在
  内存中，也可以保存在redis中，推荐使用后者)，然后给这个session生成一个唯一的标识字符串,然后在
  响应头中种下这个唯一标识字符串。
- 签名。这一步通过秘钥对sid进行签名处理，避免客户端修改sid。（非必需步骤）
- 浏览器中收到请求响应的时候会解析响应头，然后将sid保存在本地cookie中，浏览器在下次http请求的
  请求头中会带上该域名下的cookie信息。
- 服务器在接受客户端请求时会去解析请求头cookie中的sid，然后根据这个sid去找服务器端保存的该客
  户端的session，然后判断该请求是否合法。  

```js
// redis-store.js
const Redis = require('ioredis')
const { Store } = require('koa-session2')

class RedisStore extends Store {
  constructor(redisConfig) {
    console.log(redisConfig)
    super()
    this.redis = new Redis(redisConfig)
  }

  async get(sid, ctx) {
    let data = await this.redis.get(`SESSION:${sid}`)
    return JSON.parse(data)
  }

  async set(session, { sid = this.getID(24), maxAge = 1000000 } = {}, ctx) {
    try {
      // Use redis set EX to automatically drop expired sessions
      await this.redis.set(`SESSION:${sid}`, JSON.stringify(session), 'EX', maxAge / 1000)
    } catch (e) {}
    return sid
  }

  async destroy(sid, ctx) {
    return await this.redis.del(`SESSION:${sid}`)
  }
}

module.exports = RedisStore

```

```js
// index.js
const Koa = require('koa')
const Router = require('koa-router')
const cors = require('koa2-cors')
const bodyParser = require('koa-bodyparser')
const static = require('koa-static')
const session = require('koa-session2')
const Store = require('./redis-store')

const DBConfig = {
  host: '127.0.0.1',
  port: 6379
}

const app = new Koa()

// cors
app.use(cors({ credentials: true }))

app.use(static(__dirname + '/'))
app.use(bodyParser())

// 配置 session
app.keys = ['WJiol#23123_'] // secret 用于加密字符串

const config = {
  key: 'userId', // (string) cookie key (default is koa:sess)
  maxAge: 12 * 60 * 60 * 1000,
  overwrite: true, // (boolean) can overwrite or not (default true) 覆盖之前设置同名的 cookie
  httpOnly: true, // (boolean) httpOnly or not (default true)
  signed: true, // (boolean) signed or not (default true)
  rolling: false, // (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false)
  renew: false, // (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)
  store: new Store(DBConfig) // 使用redis存储session
}

app.use(session(config, app))

app.use((ctx, next) => {
  // ignore favicon
  if (ctx.path === '/favicon.ico') return

  // test session
  // let n = ctx.session.views || 0
  // ctx.session.views = ++n
  // ctx.body = n + ' views'
  next()
})

// 登录鉴权
app.use((ctx, next) => {
  if (ctx.url.indexOf('login') > -1) {
    next()
  } else {
    console.log('session', ctx.session.userinfo)
    if (!ctx.session.userinfo) {
      ctx.body = {
        message: '用户未登录'
      }
    } else {
      next()
    }
  }
})

const router = new Router()

router.post('/login', async ctx => {
  const { body } = ctx.request
  console.log('body', body)
  //设置session
  ctx.session.userinfo = body.username
  ctx.body = {
    message: '登录成功'
  }
})
router.post('/logout', async ctx => {
  //设置session
  delete ctx.session.userinfo
  ctx.body = {
    message: '登出系统'
  }
})
router.get('/getUser', async ctx => {
  ctx.body = {
    message: '获取数据成功',
    userinfo: ctx.session.userinfo
  }
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000)

```

```js
// index.html
<html>
<head>
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  <script src="https://cdn.bootcss.com/axios/0.19.0/axios.js"></script>
</head>

<body>
  <div id="app">
    <div>
      <input v-model="username">
      <input v-model="password">
    </div>
    <div>
      <button v-on:click="login">Login</button>
      <button v-on:click="logout">Logout</button>
      <button v-on:click="getUser">GetUser</button>
    </div>
    <div>
      <button onclick="document.getElementById('log').innerHTML = ''">Clear Log</button>
    </div>
  </div>
  <h6 id="log"></h6>
  </div>
  <script>
    // axios.defaults.baseURL = 'http://localhost:3000'
    axios.defaults.withCredentials = true
    axios.interceptors.response.use(
      response => {
        document.getElementById('log').append(JSON.stringify(response.data))
        return response;
      }
    );
    var app = new Vue({
      el: '#app',
      data: {
        username: 'test',
        password: 'test'
      },
      methods: {
        async login() {
          await axios.post('/login', {
            username: this.username,
            password: this.password
          })
        },
        async logout() {
          await axios.post('/logout')
        },
        async getUser() {
          await axios.get('/getUser')
        }
      }
    });
  </script>
</body>

</html>
```

### Token验证

session-cookie的验证方式存在一些不足：

- 跨域情况下无法传递cookie，需要另外配置
- 客户端不只是浏览器，还有可能是APP、小程序，这样就没法使用 cookie
- cookie被劫持的话，容易遭受 CSRF 攻击

目前来说鉴权常用的是 Token 验证方案，通过签发、验证令牌来指判断用户是否有权利访问系统。

![mark](http://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/20191223/142248626.png)

**实现原理：**

-  客户端使用用户名跟密码请求登录；
- 服务端收到请求，去验证用户名与密码；
- 验证成功后，服务端会签发一个令牌(Token)，再把这个 Token 发送给客户端；
- 客户端收到 Token 以后可以把它存储起来，比如放在 Cookie 或者 LocalStorage 中 ；
- 客户端每次向服务端请求资源的时候需要带着服务端签发的 Token；
-  服务端收到请求，然后去验证客户端请求里面带着的 Token，如果验证成功，就向客户端返回请求的数据 。

```js
// index.html
<html>
  <head>
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <script src="https://cdn.bootcss.com/axios/0.19.0/axios.js"></script>
  </head>

  <body>
    <div id="app">
      <div>
        <input v-model="username" />
        <input v-model="password" />
      </div>
      <div>
        <button v-on:click="login">Login</button>
        <button v-on:click="logout">Logout</button>
        <button v-on:click="getUser">GetUser</button>
      </div>
      <div>
        <button @click="logs=[]">Clear Log</button>
      </div>
      <!-- 日志 -->
      <ul>
        <li v-for="(log,idx) in logs" :key="idx">
          {{ log }}
        </li>
      </ul>
    </div>
    <script>
      axios.interceptors.request.use(
        config => {
          const token = window.localStorage.getItem('token')
          if (token) {
            // 判断是否存在token，如果存在的话，则每个http header都加上token
            // Bearer是JWT的认证头部信息
            config.headers.common['Authorization'] = 'Bearer ' + token
          }
          return config
        },
        err => {
          return Promise.reject(err)
        }
      )

      axios.interceptors.response.use(
        response => {
          app.logs.push(JSON.stringify(response.data))
          return response
        },
        err => {
          app.logs.push(JSON.stringify(response.data))
          return Promise.reject(err)
        }
      )
      var app = new Vue({
        el: '#app',
        data: {
          username: 'test',
          password: 'test',
          logs: []
        },
        methods: {
          async login() {
            const res = await axios.post('/login', {
              username: this.username,
              password: this.password
            })
            localStorage.setItem('token', res.data.token)
          },
          async logout() {
            localStorage.removeItem('token')
          },
          async getUser() {
            await axios.get('/getUser')
          }
        }
      })
    </script>
  </body>
</html>

```

```js
// index.js
const Koa = require('koa')
const router = require('koa-router')()
const static = require('koa-static')
const bodyParser = require('koa-bodyparser')
const jwt = require('jsonwebtoken')
const jwtAuth = require('koa-jwt')

const app = new Koa()
const secret = 'WJiol#23123_'

app.use(bodyParser())
app.use(static(__dirname + '/'))

// Custom 401 handling if you don't want to expose jwtAuth errors to users
app.use(function(ctx, next) {
  return next().catch(err => {
    if (401 == err.status) {
      ctx.status = 401
      ctx.body = {
        message: 'Protected resource, use Authorization header to get access\n'
      }
    } else {
      throw err
    }
  })
})

app.use(jwtAuth({ secret }).unless({ path: [/^\/login/] }))

// ignore favicon
app.use((ctx, next) => {
  if (ctx.path === '/favicon.ico') return
  next()
})

router.post('/login', async ctx => {
  const { body } = ctx.request

  //登录逻辑，略

  const userinfo = body.username
  ctx.body = {
    message: '登录成功',
    user: userinfo,
    // 生成 token 返回给客户端
    token: jwt.sign(
      {
        data: userinfo,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 // 设置 token 过期时间，一小时后，秒为单位
      },
      secret
    )
  }
})

router.get('/getUser', async ctx => {
  console.log(ctx.state.user)

  ctx.body = {
    message: '获取数据成功',
    userinfo: ctx.state.user.data
  }
})

app.use(router.routes())
app.use(router.allowedMethods())
app.listen(3000)

```

### JWT原理解析  

Bearer Token包含三个组成部分：令牌头、payload、哈希

```js
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoidGVzdCIsImV4cCI6MTU3NzA4NjA2MCwiaWF0IjoxNTc3MDgyNDYwfQ.YgLghsMdLkrhPLAD3f2kNmDBaDVmBSOxve7E9xEIF3A
```

- 签名：默认使用base64对令牌头、payload进行编码，使用HS256算法对令牌头、payload和密钥进行签名生成哈希
- 验证：默认使用HS256算法对令牌中数据签名并将结果和令牌中哈希比对

```js
// jsonwebtoken.js
const jsonwebtoken = require('jsonwebtoken')

const secret = 'WJiol#23123_'

const user = {
  username: 'gongyz',
  password: '123456'
}

const token = jsonwebtoken.sign(
  {
    data: user.username,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 // 设置 token 过期时间
  },
  secret
)

console.log('生成token:' + token)

console.log('解码:', jsonwebtoken.verify(token, secret).data)

```

> HMAC SHA256 HMAC(Hash Message Authentication Code，散列消息鉴别码，基于密钥的Hash算法的认
> 证协议。消息鉴别码实现鉴别的原理是，用公开函数和密钥产生一个固定长度的值作为认证标识，用这个标
> 识鉴别消息的完整性。使用一个密钥生成一个固定大小的小数据块，即MAC，并将其加入到消息中，然后传
> 输。接收方利用与发送方共享的密钥进行鉴别认证等。
>
> **BASE64** 按照RFC2045的定义，Base64被定义为：Base64内容传送编码被设计用来把任意序列的8位字节描
> 述为一种不易被人直接识别的形式。（The Base64 Content-Transfer-Encoding is designed to represent
> arbitrary sequences of octets in a form that need not be humanly readable.） 常见于邮件、http加密，
> 截取http信息，你就会发现登录操作的用户名、密码字段通过BASE64编码的
>
> **Beare**
> Beare作为一种认证类型(基于OAuth 2.0)，使用"Bearer"关键词进行定义
>
> **参考文档：**
> [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)、[koa-jwt](https://www.npmjs.com/package/koa-jwt)
>
> 阮一峰 JWT解释
> http://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html  

### Oauth（开放授权）

第三方登入主要基于OAuth 2.0。OAuth协议为用户资源的授权提供了一个安全的、开放而又简易的标
准。与以往的授权方式不同之处是OAUTH的授权不会使第三方触及到用户的帐号信息（如用户名与密码），
即第三方无需使用用户的用户名与密码就可以申请获得该用户资源的授权。  

案例：github 登录

![mark](http://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/20191223/150329849.png)

```js
// index.html
<html>
  <head>
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <script src="https://cdn.bootcss.com/axios/0.19.0/axios.js"></script>
  </head>

  <body>
    <div id="app">
      <button @click="oauth">Login with Github</button>
      <button @click="getUser">Get UserInfo</button>
      <div v-if="userInfo">
        Hello {{ userInfo.name }}
        <img :src="userInfo.avatar_url" />
      </div>
    </div>
    <script></script>
    <script>
      axios.interceptors.request.use(
        config => {
          const token = window.localStorage.getItem('token')
          console.log(token)
          if (token) {
            // 判断是否存在token，如果存在的话，则每个http header都加上token
            // Bearer是JWT的认证头部信息
            config.headers.common['Authorization'] = 'Bearer ' + token
          }
          return config
        },
        err => {
          return Promise.reject(err)
        }
      )

      axios.interceptors.response.use(
        response => {
          app.logs.push(JSON.stringify(response.data))
          return response
        },
        err => {
          app.logs.push(JSON.stringify(response.data))
          return Promise.reject(err)
        }
      )
      var app = new Vue({
        el: '#app',
        data: {
          logs: [],
          userInfo: null
        },
        methods: {
          async oauth() {
            window.open('/auth/github/login', '_blank')
            const intervalId = setInterval(() => {
              console.log('等待认证中..')
              if (window.localStorage.getItem('authSuccess')) {
                clearInterval(intervalId)
                console.log('认证结束')
                // window.localStorage.removeItem('authSuccess')
                this.getUser()
              }
            }, 500)
          },
          async getUser() {
            const res = await axios.get('/auth/github/userinfo')
            console.log('res:', res.data)
            this.userInfo = res.data
          }
        }
      })
    </script>
  </body>
</html>

```

```js
// index.js
const Koa = require('koa')
const router = require('koa-router')()
const static = require('koa-static')
const axios = require('axios')
const querystring = require('querystring')
const jwt = require('jsonwebtoken')
const jwtAuth = require('koa-jwt')

const app = new Koa()

const accessTokens = {}
const secret = 'WJiol#23123_'
const config = {
  client_id: '1fe9675becdbcb12d1c5',
  client_secret: 'c4e99ba1e79b393d4da8a872dd2fda2bc10f3953'
}

app.use(static(__dirname + '/'))

router.get('/auth/github/login', async ctx => {
  //重定向到认证接口,并配置参数
  var path = `https://github.com/login/oauth/authorize?${querystring.stringify({ client_id: config.client_id })}`

  //转发到授权服务器
  ctx.redirect(path)
})

router.get('/auth/github/callback', async ctx => {
  const code = ctx.query.code
  const params = {
    client_id: config.client_id,
    client_secret: config.client_secret,
    code: code
  }
  let res = await axios.post('https://github.com/login/oauth/access_token', params)
  const access_token = querystring.parse(res.data).access_token
  const uid = Math.random() * 99999
  accessTokens[uid] = access_token

  console.log('accessTokens', accessTokens)

  const token = jwt.sign(
    {
      data: uid,
      // 设置 token 过期时间，一小时后，秒为单位
      exp: Math.floor(Date.now() / 1000) + 60 * 60
    },
    secret
  )
  ctx.response.type = 'html'
  ctx.response.body = ` <script>window.localStorage.setItem("authSuccess","true");window.localStorage.setItem("token","${token}");window.close();</script>`
})

router.get('/auth/github/userinfo', jwtAuth({ secret }), async ctx => {
  // 验证通过，state.user

  console.log('jwt playload:', ctx.state.user)

  const access_token = accessTokens[ctx.state.user.data]
  res = await axios.get('https://api.github.com/user?access_token=' + access_token)

  ctx.body = res.data
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000)

```

