## 简介

公司的后台管理App，是使用React Native框架来写的，RN框架屏蔽了IOS和Android之间开发方式的差异，使得前端可以通过JavaScript来开发跨平台的原生App，前段时间收到一个需求，需要在App中打开第三方的App并进入某个特定的界面。于是去看了一下RN的官方文档和网上的一些关于App之间通信的技术文章。了解到了深度链接这个东西，但是很多文章要么讲解的不是很清楚，要么就是很久之前的东西，而且没有针对于RN框架来展开的具体的介绍，所以打算自己写一篇博客给大家分享一下深度链接技术。

## 什么是深度链接

​	所谓深度链接，简单来讲，就是你在手机上点击一个链接之后，可以打开某个App或者是直接进入到这个App内部的某个页面，而不是App正常打开时显示的首页。

## 如何实现深度链接

​	就目前来讲，实现深度链接主要有以下三种方式，**这篇文章我们主要介绍URL  Scheme的方式来实现深度链接**：

- URL Scheme		iOS，Android平台都支持


- Universal Links           只支持iOS9及以上系统


- App Links                    只支持Android6.0及以上系统

### 什么是URL Scheme

1. 通过对比网页链接来理解 URL Scheme，应就容易多了。

   URL Scheme 有两个单词：

   - URL，我们都很清楚，`http://www.apple.com` 就是个 URL，我们也叫它链接或网址；
   - Scheme，表示的是一个 URL 中的一个位置—最初始的位置，即 `://`之前的那段字符。比如 `http://www.apple.com` 这个网址的 Scheme 是 **http**（可以理解为URL地址的协议）。

   根据我们上面对 URL Schemes 的了解，我们可以很轻易地理解，在手机中，我们可以像定位一个网页一样，用一种特殊的 URL 来定位一个应用甚至应用里某个具体的功能。而定位这个应用的，就是这个应用的URL 的 Scheme 部分，也就是开头儿那部分。比如短信，就是 `sms:`

   下面用苹果的网站和 iOS 上的微信来做个简单对比：

   <table class="tableview" tabindex="1" cellspacing="3" data-target="#table-cell-menu"><tbody><tr><td class="border_l border_r border_t border_b selected" style="text-align: left; vertical-align: top;"><div class="wrap"><div style="margin: 10px 5px;"></div></div></td><td class="border_l border_r border_t border_b" style="text-align: center; vertical-align: top;"><div class="wrap"><div style="margin: 10px 5px;">网页（苹果）iOS</div></div></td><td class="border_l border_r border_t border_b" style="text-align: center; vertical-align: top;"><div class="wrap"><div style="margin: 10px 5px;">iOS</div></div></td></tr><tr><td class="border_l border_r border_t border_b" style="text-align: left; vertical-align: top;"><div class="wrap"><div style="margin: 10px 5px;">网站首页/打开应用</div></div></td><td class="border_l border_r border_t border_b" style="text-align: center; vertical-align: top;"><div class="wrap"><div style="margin: 10px 5px;">http://www.apple.com</div></div></td><td class="border_l border_r border_t border_b" style="text-align: center; vertical-align: top;"><div class="wrap"><div style="margin: 10px 5px;">weixin://</div></div></td></tr><tr><td class="border_l border_r border_t border_b" style="text-align: center; vertical-align: top;"><div class="wrap"><div style="margin: 10px 5px;">子页面/具体功能</div></div></td><td class="border_l border_r border_t border_b" style="text-align: center; vertical-align: top;"><div class="wrap"><div style="margin: 10px 5px;">http://www.apple.com/mac/（Mac页面）</div></div></td><td class="border_l border_r border_t border_b" style="text-align: center; vertical-align: top;"><div class="wrap"><div style="margin: 10px 5px;">weixin://dl/moments（朋友圈）</div></div></td></tr></tbody></table>
在这里，`http://www.apple.com` 和 `weixin://` 都声明了这是谁的地盘。然后在 `http://www.apple.com` 后面加上 `/mac` 就跳转到从属于 `http://www.apple.com` 的一个网页上；同样，在 `weixin://` 后面加上 `dl/moments` 就进入了微信的一个具体的功能——朋友圈。
   
**但是，两者还有几个重要的区别：**

- 所有网页都一定有网址，不管是首页还是子页。但未必所有的应用都有自己的 URL Scheme，更不是每个应用的每个功能都有相应的 URL Scheme。实际上，现状是，大多数的应用只有用于打开应用的 URL Scheme，而有一些应用甚至没有用于打开应用的 URL Scheme。几乎没有所有功能都有对应 URL 的应用。**一个 App 是否支持 URL Schemes 要看那个 App 的作者是否在自己的项目中添加了支持 URL Schemes 相关的代码。**

- 一个网址只对应一个网页，但并非每个 URL Scheme 都只对应一款应用。因为URL Schemes是可以重复的，所以曾经出现过[有 App 使用支付宝的 URL Schemes 拦截支付帐号和密码的事件](http://jbguide.me/2015/03/26/url-scheme-is-vulnerable/)。

### 如何通过URL Scheme实现深度链接

通过下面这张图来说明APP1与APP2之间，在技术上，如何完成横向调用：

![mark](https://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/dC0c39g941.jpg)

假如要从APP-F调用APP-T

1）APP-T要进行自定义scheme的配置（iOS是info文件，Android是activity），并且可以对传入的参数进行处理。

2）APP-F进行调用，首先判断设备是否安装APP-T。

3）如果未安装，则跳转到APP-T的web版应用（假设他提供web版）或者是跳转到AppStore等应用市场进行下载。

4）如果已安装，则调用APP-T配置好的URL SCHEME，直接打开APP-T的相关界面。

## 自定义URL Scheme配置

​	要想你的应用支持URL Scheme，你需要在应用里面进行配置，IOS和Android配置的方法是不一样的，下面会详细讲一下两者配置的步骤：

- #### IOS

  第一步是创建 URL Scheme — 在 Xcode Project Navigator 中找到并点击工程 info.plist 文件。当该文件显示在右边窗口，在列表上点击鼠标右键，选择 *Add Row*:

  向下滚动弹出的列表并选择 *URL types*

  ![mark](https://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/7BjDA5i3Kk.gif)

  点击左边剪头打开列表，可以看到 *Item 0*，一个字典实体。展开 *Item 0*，可以看到 *URL Identifier*，一个字符串对象。该字符串是你自定义的 URL scheme 的名字。建议采用反转域名的方法保证该名字的唯一性，比如 *com.yourCompany.yourApp*。

  ![mark](https://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/lcH6J7eLd2.gif)

  点击 *Item 0* 新增一行，从下拉列表中选择 *URL Schemes*，敲击键盘回车键完成插入。

  ![mark](https://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/Kdf3Lh0fke.gif)

  注意 URL Schemes 是一个数组，允许应用定义多个 URL schemes。

  ![mark](https://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/1k6KG8G3gB.gif)

  展开该数据并点击 *Item 0*。你将在这里定义自定义 URL scheme 的名字。只需要名字，不要在后面追加 :// — 比如，如果你输入 iOSDevApp，你的自定义 url 就是 iOSDevApp://

  ![mark](https://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/Fk1EJB5Fmh.gif)

  此时，整个定义如下图:

  ![mark](https://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/dEbEgieE5H.gif)

  虽然我赞同 Xcode 使用描述性的名字的目的，不过看到创建的实际的 key 也是非常有用的。这里有一个方便的技巧，右键点击 plist 并选择 *Show Raw Keys/Values*，就能看到以下效果:

  ![mark](https://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/fGf3hfi5hl.png)

  还有另一种有用的输出格式，XML，因为可以非常容易的看到字典和原始数组及其包括的实体的结构。点击 plist 并选择 *Open As – Source Code*:

  ![mark](https://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/5EABLE6f4i.gif)


- #### Android

  Android应用/组件间通信有一种方式是`intent`，应用可以注册`intent filter`声明自己对什么样的`intent`感兴趣，其它应用发送`intent`时通过系统级广播传递过来，如果与预先注册的`intent filter`匹配，应用将收到该`intent`（无论应用是否正在运行，都会被“唤醒”，也就是隐式启动`Activity`），并取出`intent`携带的数据，做进一步处理，所以我们需要在`AndroidManifest.xml`里静态注册`intent filter`来声明自定义的URL Scheme：

  ```java
   <activity
    android:name=".MainActivity"
    android:launchMode="singleTask"
    android:label="@string/app_name"
    android:configChanges="keyboard|keyboardHidden|orientation|screenSize"
    android:windowSoftInputMode="adjustResize">
    <intent-filter> <!-- 正常启动 -->
    	<action android:name="android.intent.action.MAIN" />
    	<category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>

    <intent-filter> <!-- URL Scheme启动 -->
  	<action android:name="android.intent.action.VIEW"></action>
  	<category android:name="android.intent.category.DEFAULT"></category>  
  	<data android:scheme="myapp"></data> 
    </intent-filter>
  </activity>
  ```

  

## Liking API 处理深度链接

在RN的官方文档中提供了 [Liking](http://facebook.github.io/react-native/docs/linking.html#addeventlistener) 这个API让我们处理深度链接来实现App之间的跳转。

### 处理传入的链接    

如果你的应用被其注册过的外部url调起，则可以在任何组件内这样获取和处理它：

```javascript
componentDidMount() {
  Linking.getInitialURL().then((url) => {
    if (url) {
      console.log('Initial url is: ' + url);
    }
  }).catch(err => console.error('An error occurred', err));
}
```

注意：getInitialURL方法只有在App第一次启动的时候会执行，如果App已经启动但是进程挂到后台，通过深度链接打开该App的时候不会执行getInitialURL方法，所以需要用到addEventListener方法，确保每次打开App时都能知道我们的App是被哪个链接调起的。

如果要在MainActivity实例存在（即App进程没有关闭的时候）的时候监听传入的[intent](http://www.cnblogs.com/smyhvae/p/3959204.html)，那么需要在`AndroidManifest.xml`中将MainActivity的`launchMode`设置为`singleTask`。

```java
<activity
 android:name=".MainActivity"
 android:launchMode="singleTask">
```

对于iOS来说，如果要在App启动后也监听传入的App链接，需要在`AppDelegate.m`中增加以下代码：

```objective-c
// iOS 9.x or newer
#import <React/RCTLinkingManager.h>

- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}
```

```objective-c
// iOS 8.x or older
#import <React/RCTLinkingManager.h>

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
  return [RCTLinkingManager application:application openURL:url
                      sourceApplication:sourceApplication annotation:annotation];
}
```

然后你的React组件就可以监听`Linking`的相关事件：

```javascript
componentDidMount() {
  Linking.addEventListener('url', this._handleOpenURL);
},
componentWillUnmount() {
  Linking.removeEventListener('url', this._handleOpenURL);
},
_handleOpenURL(event) {
  console.log(event.url);
}
```

### 打开外部链接    

要启动一个链接相对应的应用（打开浏览器、邮箱或者其它的应用），只需调用：

```javascript
Linking.openURL(url).catch(err => console.error('An error occurred', err));
```

如果想在打开链接前先检查是否安装了对应的应用，则调用以下方法：

```javascript
Linking.canOpenURL(url).then(supported => {
  if (!supported) {
    console.log('Can\'t handle url: ' + url);
  } else {
    return Linking.openURL(url);
  }
}).catch(err => console.error('An error occurred', err));
```
注意：在IOS平台，打开外部链接需要配置Scheme白名单

- 在项目的info.plist中添加一LSApplicationQueriesSchemes，类型为Array；
- 添加需要支持的项目，类型为字符串类型；

![mark](https://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/la88aHAiFb.png)

## 相关阅读链接

- ##### [移动端Deeplink的前世今生](https://zhuanlan.zhihu.com/p/20694818)

- ##### [自定义URL Scheme完全指南](http://objcio.com/blog/2014/05/21/the-complete-tutorial-on-ios-slash-iphone-custom-url-schemes/)

- ##### [如何自定义 URL Scheme 进行跳转](https://www.jianshu.com/p/1295194b11e4)

- ##### [唤醒App的那些事](https://www.jianshu.com/p/862885bd8ea2)

- ##### [H5页面唤醒App](https://github.com/AlanZhang001/H5CallUpNative)

