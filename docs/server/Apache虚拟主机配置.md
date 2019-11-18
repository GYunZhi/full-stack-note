---
title: Apache虚拟主机配置
copyright: true
date: 2018-02-08 22:26:32
tags: 服务器
categories: 服务器
---

在一个Apache服务器上可以配置多个虚拟主机，实现一个服务器提供多站点服务，其实就是访问同一个服务器上的不同目录。Apache虚拟主机配置有3中方法：基于IP配置、基于域名配置和基于端口配置，这里只介绍基于域名配置和基于端口配置，基于IP配置方法类似。

### 基于域名配置虚拟主机

找到配置文件/conf/extra/httpd-vhosts.conf

- 首先配置localhost，以免之后访问localhost出现问题

```bash
<VirtualHost *:80>  
        DocumentRoot "D:/wamp/www"  
        ServerName localhost  
        <Directory "D:/wamp/www">  
            Options Indexes FollowSymLinks  
            AllowOverride None  
            Order allow,deny  
            Allow from all  
        </Directory>  
</VirtualHost>  
```

- 配置其他项,可配置多项

```bash
<VirtualHost *:80>  
        DocumentRoot "C:/wamp/www/test"  
        ServerName www.test.com  
        <Directory "C:/wamp/www/test">  
            Options Indexes FollowSymLinks  
            AllowOverride None  
            Order allow,deny  
            Allow from all  
        </Directory>  
</VirtualHost>  
```

这里配置了两个虚拟主机，这两个主机使用的都是80端口，第一个虚拟主机指定域名为“localhost”，服务器目录为“D:/wamp/www”，第二个虚拟主机指定域名为"www.test.com ”，服务器目录为“D:/wamp/www/test”。

- 然后在Apache主配置文件conf/httpd.conf中包含这个配置文件，去掉前面的#就可以了：

```bash
- #Include conf/extra/httpd-vhosts.conf 
+ Include conf/extra/httpd-vhosts.conf  
```

最后重启Apache服务器，就可以通过访问两个不同的域名访问同一个服务器上的两个目录了。

注意：如果只是在本地进行配置测试的话，需要在hosts文件中加入域名到本地IP地址的映射（hosts文件位置：C:\Windows\System32\drivers\etc）：

```bash
　127.0.0.1       localhost
　127.0.0.1       www.test.com 
```

### 基于端口配置虚拟主机

- 首先在Apache配置文件conf/httpd.conf中修改配置让Apache服务器监听多个端口：


```bash
　Listen 8080
　Listen 80
```

　　这里监听两个端口，配置两个虚拟主机。

- 　　然后在配置文件conf/extra/httpd-vhosts.conf，添加如下配置信息：


　　

```bash
<VirtualHost _default_:80>
　　DocumentRoot "D:/wamp/www"
</VirtualHost>
```

```bash
<VirtualHost *:8080>
   DocumentRoot "D:/wamp/www/test"
   <Directory "D:/wamp/www/test">
      Options Indexes FollowSymLinks MultiViews
      AllowOverride None
      Require all granted
  </Directory>
</VirtualHost>
```

- 在Apache主配置文件conf/httpd.conf中包含这个配置文件：


```bash
- #Include conf/extra/httpd-vhosts.conf
+ Include conf/extra/httpd-vhosts.conf
```

最后重启Apache服务器，就可以通过同一个IP地址的不同端口来访问同一个服务器上的两个不同目录了。

注意：Web服务器默认使用的是80端口，所以访问80端口的站点时可以不用加上“：80”，但是访问其他端口时必须带上端口号。

### host文件的说明

在Window系统中有个hosts文件（没有后缀名），在Window7下(C:\Windows\System32\drivers\etc)，该文件其实是一个纯文本的文件，用普通的文本编辑软件如记事本等都能打开。

这个文件是根据TCP/IPforWindows的标准来工作的，它的作用是包含IP地址和Host name(主机名)的映射关系，是一个映射IP地址和Hostname(主机名)的规定，规定要求每段只能包括一个映射关系，IP地址要放在每段的最前面，空格后再写上映射的Host name(主机名)。对于这段的映射说明用“#”分割后用文字说明。

现在让我们来看看hosts在Windows中是怎么工作的。
我们知道在网络上访问网站，要首先通过DNS服务器把网络域名（www.XXXX.com）解析成XXX.XXX.XXX.XXX的IP地址后，我们的计算机才能访问。
要是对于每个域名请求我们都要等待域名服务器解析后返回IP信息，这样访问网络的效率就会降低，而hosts文件就能提高解析效率。
根据Windows系统规定，在进行DNS请求以前，Windows系统会先检查自己的hosts文件中是否有这个地址映射关系，如果有则调用这个IP地址映射，如果没有再向已知的DNS服务器提出域名解析。也就是说hosts的请求级别比DNS高。
知道了hosts文件的工作方式，那在具体使用中它有哪些作用呢?

1、加快域名解析
​        对于要经常访问的网站，我们可以通过在hosts中配置域名和IP的映射关系，这样当我们输入域名计算机就能很快解析出IP，而不用请求网络上的DNS服务器。

2、方便局域网用户
​        在很多单位的局域网中，会有服务器提供给用户使用。但由于局域网中一般很少架设DNS服务器，访问这些服务要输入难记的IP地址，对不少人来说相当麻烦。现在可以分别给这些服务器取个容易记住的名字，然后在hosts中建立IP映射，这样以后访问的时候我们输入这个服务器的名字就行了。

3、屏蔽网站
​        现在有很多网站不经过用户同意就将各种各样的插件安装到你的计算机中，有些说不定就是木马或病毒。对于这些网站我们可以利用Hosts把该网站的域名映射到错误的IP或自己计算机的IP，这样就不用访问了。
我们在hosts写上以下内容：
127.0.0.1 #屏蔽的网站
0.0.0.0 #屏蔽的网站
这样计算机解析域名就解析到本机或错误的IP，达到了屏蔽的目的。

4、顺利连接系统
​        对于Lotus的服务器和一些数据库服务器，在访问时如果直接输入IP地址那是不能访问的，只能输入服务器名才能访问。那么我们配置好hosts文件，这样输入服务器名就能顺利连接了。
​        最后要指出的是，hosts文件配置的映射是静态的，如果网络上的计算机更改了请及时更新IP地址，否则将不能访问。

### 相关阅读链接

- ##### [Apache虚拟主机的配置](https://www.cnblogs.com/lucky-man/p/6207851.html)
- ##### [Host文件的作用和介绍](https://www.cnblogs.com/Sungeek/p/5845797.html)

