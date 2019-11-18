## 简介

上一篇笔记介绍了Scheme的方式来实现App之间的跳转，但是这种方式有一个问题，就是当我们的移动设备上没有安装该App时，它不能做其他的处理，比如跳转到我们公司的网站里面。在2015年，Google和Apple分别提出了和App Links（只支持Android M及以上系统）和Universal Links（只支持IOS9及以上系统）这两个新特性。这两种方式，可以通过访问HTTP/HTTPS链接直接唤起APP进入具体页面，不需要其他额外判断；如果未安装App，访问此链接时，可以展示你网站的内容。这两种方式有一个要求，你需要有一个域名和自己的服务器，下面分别介绍这两种方式：

## App Links

### 1. 在AndroidManifest.xml激活App links

```bash
<intent-filter android:autoVerify="true"> <!--App Links启动-->
	<action android:name="android.intent.action.VIEW"></action>
   <category android:name="android.intent.category.DEFAULT"></category>  
   <category android:name="android.intent.category.BROWSABLE" />
   <data android:scheme="http" android:host="www.yourdomain.com.com" />
   <data android:scheme="https" android:host="www.yourdomain.com.com" />
</intent-filter>
```

这个配置告诉安卓去验证一个文件，这个文件地址是[https://yourdomain.com/.well-known/statements.json,](https://yourdomain.com/.well-known/statements.json,)如果存在这个文件，同时验证成功，那么用户点击该域名之下的链接时，就可以直接到app，下一步，我们将学会如何构建这个文件。

### 2. 上传web-app关联文件（statements.json）

基于安全的原因，这个文件必须通过SSL的GET请求获得，所以你需要下载一个SSL证书，并且配置在你的服务器中，然后你可以打开一个文本编辑器，写入如下形式的JSON：

```bash
[{  
  "relation": ["delegate_permission/common.handle_all_urls"], 
  "target": { 
    "namespace": "android_app",    
    "package_name": "com.mycompany.myapp",    						
    "sha256_cert_fingerprints": ["6C:EC:C5:0E:34:AE....EB:0C:9B"] 
  }
}]
```

你可以在AndroidManifest.xml 文件中找到app的package name。你还需要通过在终端中执行以下命令查看keystore参数信息来找到sha256指纹(关于生成签名密钥，你可以看下我之前的文章)：

```bash
keytool -list -v -keystore my-release-key.keystore
```

注：

- 你可以通过[Statement List Generator and Tester](https://developers.google.com/digital-asset-links/tools/generator)这个网站来自动生成和测试statements.json文件，


- 目前可以通过http获得这个文件，但是在M最终版里则只能通过HTTPS验证。确保你的web站点支持HTTPS请求。

### 3.上传这个文件到服务器的.well-known文件夹

如果你的服务器是windows系统，.well-know文件夹可以通过命令行的形式创建。

## Universal Links

### 1. 注册App并打开Associated Domains服务

如果你还没有注册App，则需要登陆developer.apple.com注册。然后在Identifiers下AppIDs找到自己的App ID，并打开Associated Domains服务。

![mark](https://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/e0KFhCKCLa.png)

### 2. 在Xcode中开启Associated Domains服务

- 打开Associated Domains服务

  ![mark](https://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/d3CjiLlLCG.png)

- 添加域名，点击Associated Domains的“+”添加前缀为applinks:的域名，如下图所示

  ![mark](https://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/6dk58fEi6E.png)

### 3.配置apple-app-site-association文件

文件格式如下图所示：

![mark](https://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/3mhaLhDHKA.png)

- paths对应域名中的path，用于过滤可以跳转到App的链接，支持通配符‘*’，‘？’以及‘NOT’进行匹配，匹配的优先级是从左至右依次降低。


- appID对应项由前缀和ID两部分组成，可以在developer.apple.com中的Identifiers→AppIDs中点击对应的App ID查看。

  ![mark](https://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/HDeh50BC4j.png)

### 4.上传这个文件到服务器的.well-known文件夹

IOS下仅支持不支持HTTPS获取apple-app-site-association文件，所以我们必须要在服务器中配置SSL证书

## 相关阅读链接

- ##### [Android M App Links实现](http://www.jcodecraeer.com/a/anzhuokaifa/androidkaifa/2015/0718/3200.html)
- ##### [IOS9 Universal Links的使用](http://www.cocoachina.com/ios/20160719/17108.html)

