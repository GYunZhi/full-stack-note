---
title: Apache、Nginx、Tomcat作用和使用场景
copyright: true
date: 2018-02-05 23:26:32
tags: 服务器
categories: 服务器
---

### Apache—HTTP服务器（Web服务器）

HTTP服务器本质上也是一种应用程序——它通常运行在服务器之上，绑定服务器的IP地址并监听某一个tcp端口来接收并处理HTTP请求，这样客户端（一般来说是IE, Firefox，Chrome这样的浏览器）就能够通过HTTP协议来获取服务器上的网页（HTML格式）、文档（PDF格式）、音频（MP4格式）、视频（MOV格式）等资源。下图描述的就是这一过程：

![mark](https://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/JcjcBmgLiK.jpg)

不仅仅是Apache HTTP Server和Nginx，绝大多数编程语言所包含的类库中也都实现了简单的HTTP服务器方便开发者使用：

- [HttpServer (Java HTTP Server )](https://link.zhihu.com/?target=https%3A//docs.oracle.com/javase/8/docs/jre/api/net/httpserver/spec/com/sun/net/httpserver/HttpServer.html)
- [Python SimpleHTTPServer](https://link.zhihu.com/?target=https%3A//docs.python.org/2/library/simplehttpserver.html)

使用这些类库能够非常容易的运行一个HTTP服务器，它们都能够通过绑定IP地址并监听tcp端口来提供HTTP服务。

### Nginx

Nginx is a free,open-source,high-performance http server and reverse proxy,as well as an IMAP/POP3 proxy.

通俗的说Nginx提供web服务，反向代理，以及IMAP/POP3代理，那么什么是web服务？反向代理？IMAP/POP3代理？

- web服务：服务端通过网络可以提供给客户端所请求的资源
- 反向代理：代表资源服务器来回应客户端的请求，至于资源服务器为什么不自己回应后面会解释
- IMAP/POP3：是一种stream传输协议，常常被用来做一些邮件传输
  - IMAP：Internet Mail Access Protocol 是一种交互式的邮件传输协议，交互式说的就是客户端可以和服务端针对邮件的各种操作同步，一份邮件，客户端有，服务端也有，客户端有什么操作会同步到服务端，反之亦然。
  - POP3：Post Office Protocol 3邮件传输协议相比IMAP协议只是服务器不保留邮件，一旦给了客户端，自行删除对应的邮件，客户端对邮件的各种操作与服务器无关

![mark](https://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/7e636B9cLk.jpg)

注意代理的概念只要把握准正向和反向都是以客户端为参考的，从客户端发出的是正向，客户端接受的是反向，类似于原告的代理律师—正向代理；被告的代理律师—反向代理

![mark](https://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/l7aA17kmhf.jpg)

### Tomcat

[Apache Tomcat](https://link.zhihu.com/?target=http%3A//tomcat.apache.org/)则是Apache基金会下的另外一个项目，与Apache HTTP Server相比，Tomcat能够**动态**的生成资源并返回到客户端。Apache HTTP Server和Nginx都能够将某一个文本文件的内容通过HTTP协议返回到客户端，但是这个文本文件的内容是固定的——也就是说无论何时、任何人访问它得到的内容都是完全相同的，这样的资源我们称之为**静态**资源。动态资源则与之相反，在不同的时间、不同的客户端访问得到的内容是不同的，例如：

- 包含显示当前时间的页面
- 显示当前IP地址的页面

Apache HTTP Server和Nginx本身不支持生成动态页面，但它们可以通过其他模块来支持（例如通过Shell、PHP、Python脚本程序来动态生成内容）。如果想要使用Java程序来动态生成资源内容，使用这一类HTTP服务器很难做到。[Java Servlet](https://link.zhihu.com/?target=http%3A//www.tianmaying.com/tutorial/servlet-intro)技术以及衍生的[Java Server Pages](https://link.zhihu.com/?target=http%3A//www.tianmaying.com/tutorial/jsp-intro)技术可以让Java程序也具有处理HTTP请求并且返回内容（由程序动态控制）的能力，Tomcat正是支持运行Servlet/JSP应用程序的容器（Container）:

![mark](https://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/md2FDEkdLa.jpg)

Tomcat运行在JVM之上，它和HTTP服务器一样，绑定IP地址并监听TCP端口，同时还包含以下职责：

- 管理Servlet程序的生命周期
- 将URL映射到指定的Servlet进行处理
- 与Servlet程序合作处理HTTP请求——根据HTTP请求生成HttpServletResponse对象并传递给Servlet进行处理，将Servlet中的HttpServletResponse对象生成的内容返回给浏览器


- 动静态资源分离——运用Nginx的反向代理功能分发请求：所有动态资源的请求交给Tomcat，而静态资源的请求（例如图片、视频、CSS、JavaScript文件等）则直接由Nginx返回到浏览器，这样能大大减轻Tomcat的压力。
- 负载均衡，当业务压力增大时，可能一个Tomcat的实例不足以处理，那么这时可以启动多个Tomcat实例进行水平扩展，而Nginx的负载均衡功能可以把请求通过算法分发到各个不同的实例进行处理