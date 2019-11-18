---
title: 前端安全配置Content-Security-Policy
copyright: true
date: 2018-06-15 19:09:59
tags: Web安全
categories: Web安全
---

### 什么是CSP

​	CSP全称Content Security Policy (内容安全策略),是为了页面内容安全而制定的一系列防护策略.  通过CSP所约束的的规则可以指定可信的内容来源（这里的内容可以指脚本、图片、iframe、font、style等等可能的远程的资源）。

### CSP的作用

​	跨域脚本攻击 [XSS](http://baike.baidu.com/view/2161269.htm)（Cross Site Scripting ） 是最常见、危害最大的网页安全漏洞，为了防止它们，要采取很多编程措施，非常麻烦。通过制定CSP 策略，开发者可以明确告诉浏览器，哪些外部资源可以加载和执行，等同于提供白名单。它的实现和执行全部由浏览器完成，即让浏览器自动禁止外部注入恶意脚本。CSP 大大增强了网页的安全性。攻击者即使发现了漏洞，也没法注入脚本，除非还控制了一台列入了白名单的可信主机。 

### 常用指令说明 

​	指令是CSP 中用来定义策略的基本单位，CSP 提供了很多指令，涉及安全的各个方面，我们可以使用单个或者多个指令组合在一起来防护我们的网站。

**获取指令（以下指令可以限制各类资源的加载）**

- **script-src**：外部脚本
- **style-src**：样式表
- **img-src**：图像
- **media-src**：媒体文件（音频和视频）
- **font-src**：字体文件
- **object-src**：插件（比如 Flash）
- **child-src**：框架
- **frame-ancestors**：嵌入的外部资源（比如<frame>） 
- **connect-src**：HTTP 连接（通过 XHR、WebSockets、EventSource等）
- **worker-src**：`worker`脚本
- **manifest-src**：manifest 文件

注意：**default src** 用来设置上面各个选项的默认值：

```bash
Content-Security-Policy: default-src 'self'
```

上面代码限制**所有的**外部资源，都只能从当前域名加载。 

如果同时设置某个单项限制（比如`font-src`）和`default-src`，前者会覆盖后者，即字体文件会采用`font-src`的值，其他资源依然采用`default-src`的值 。

**报告指令**

​	有时，我们不仅希望防止 XSS，还希望记录此类行为。`report-uri`就用来告诉浏览器，应该把注入行为报告给哪个网址。

```bash
Content-Security-Policy: default-src 'self'; ...; report-uri /csp_report_url;
```

上面代码指定，将注入行为报告给`/csp_report_url`这个 URL。

浏览器会使用`POST`方法，发送一个JSON对象，下面是一个例子：

```json
{
  "csp-report": {
    "document-uri": "http://example.org/page.html",
    "referrer": "http://evil.example.com/",
    "blocked-uri": "http://evil.example.com/evil.js",
    "violated-directive": "script-src 'self' https://apis.google.com",
    "original-policy": "script-src 'self' https://apis.google.com; report-uri http://example.org/my_amazing_csp_report_parser"
  }
}
```

**指令值**

- 主机名：`example.org`，`https://example.com:443`
- 路径名：`example.org/resources/js/`
- 通配符：`*.example.org`，`*://*.example.com:*`（表示任意协议、任意子域名、任意端口）
- 协议名：`https:`、`data:` ：只允许通过https、data协议加载资源
- 关键字`'self'`：当前域名，需要加引号
- 关键字`'none'`：禁止加载任何外部资源，需要加引号

除了常规值，`script-src`还可以设置一些特殊值，注意，下面这些值都必须放在单引号里面。 

```
unsafe-inline：允许执行页面内嵌的`&lt;script>`标签和事件监听函数
unsafe-eval：允许将字符串当作代码执行，比如使用`eval`、`setTimeout`、`setInterval`和`Function`等函数
nonce值：每次HTTP回应给出一个授权token，页面内嵌脚本必须有这个token，才会执行
hash值：列出允许执行的脚本代码的Hash值，页面内嵌脚本的哈希值只有吻合的情况下，才能执行
```

### 如何启用CSP

两种方法可以启用 CSP，一种是通过网页的`<meta>`标签，另一种是通过 HTTP 头信息的`Content-Security-Policy`的字段。 

1、通过meta标签启用CSP：

```html
<meta http-equiv="Content-Security-Policy" content="script-src 'self'; object-src 'none'; style-src cdn.example.org third-party.org; child-src https:">
```

上面代码中，CSP 做了如下配置：

- 脚本：只信任当前域名
- `<object>`标签：不信任任何URL，即不加载任何资源
- 样式表：只信任`cdn.example.org`和`third-party.org`
- 框架（frame）：必须使用HTTPS协议加载
- 其他资源：没有限制

2、服务器端配置`Content-Security-Policy`启用

- Apache

  在VirtualHost的httpd.conf文件中添加如下代码

```bash
Header set Content-Security-Policy "default-src 'self';"
```

- Nginx

  在 server 对象块中添加如下代码

```nginx
add_header Content-Security-Policy "default-src 'self';"
```

### 相关阅读链接

- ##### [Content Security Policy 入门教程](http://www.ruanyifeng.com/blog/2016/09/csp.html)

- ##### [[前端安全配置之Content-Security-Policy](https://www.cnblogs.com/heyuqing/p/6215761.html)

