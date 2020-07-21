## 环境搭建（macOS）

### IOS 开发环境

#### 必须安装的依赖

Node、Watchman 和 React Native 命令⾏⼯具以及 Xcode

虽然你可以使⽤ 任何编辑器 来开发应⽤（编写 js 代码），但你仍然必须安装 Xcode 来提供编译 iOS 应 ⽤所需的⼯具和环境。

#### Node, Watchman

我们推荐使⽤ [Homebrew](https://brew.sh/) 来安装 Node 和 Watchman。在命令⾏中执⾏下列命令安装：

```bash
brew install node 

brew install watchman
```

如果你已经安装了 Node，请检查其版本是否在 v8.3 以上。安装完 Node 后建议设置 npm 镜像以加速 后⾯的过程（或使⽤科学上⽹⼯具）。

> 注意：不要使⽤ cnpm！cnpm 安装的模块路径⽐较奇怪，packager 不能正常识别！
>

```bash
npm config set registry https://registry.npm.taobao.org --global 

npm config set disturl https://npm.taobao.org/dist --global
```

Watchman则是由 Facebook 提供的监视⽂件系统变更的⼯具。安装此⼯具可以提⾼开发时的性能 （packager 可以快速捕捉⽂件的变化从⽽实现实时刷新）。

#### Yarn、React Native 的命令⾏⼯具

Yarn是 Facebook 提供的替代 npm 的⼯具，可以加速 node 模块的下载。React Native 的命令⾏⼯具 ⽤于执⾏创建、初始化、更新项⽬、运⾏打包服务（packager）等任务。

```bash
npm install -g yarn react-native-cli
```

安装完 yarn 后同理也要设置镜像源：

```bash
yarn config set registry https://registry.npm.taobao.org --global 

yarn config set disturl https://npm.taobao.org/dist --global
```

安装完 yarn 之后就可以⽤ yarn 代替 npm 了，例如⽤ `yarn` 代替 `npm install` 命令，⽤ `yarn add 某第三⽅库名`代替 `npm install 某第三⽅库名` 。

#### Xcode

React Native ⽬前需要 [Xcode](https://developer.apple.com/xcode/downloads/) 9.4 或更⾼版本。你可以通过 App Store 或是到 [Apple 开发者官⽹](https://developer.apple.com/xcode/downloads/) 上下 载。这⼀步骤会同时安装 Xcode IDE、Xcode 的命令⾏⼯具和 iOS 模拟器。

> 一般来说命令行工具都是默认安装了，但你最好还是启动 Xcode，并在`Xcode | Preferences | Locations`菜单中检查一下是否装有某个版本的`Command Line Tools`。Xcode 的命令行工具中也包含一些必须的工具，比如`git`等。

![](https://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/20200521103543.png)

**注意：0.60 及以上版本依赖CocoaPods安装。需要在Mac电脑中安装 cocopods 环境，[可以参考这⾥](https://www.jianshu.com/p/476f4f21816b)**

#### 测试安装

init 命令默认会创建最新的版本，而目前最新的 0.45 及以上版本需要下载 boost 等几个第三方库编译。这些库在国内即便翻墙也很难下载成功，导致很多人`无法运行iOS项目`。中文网在论坛中提供了这些库的 [国内下载链接](http://bbs.reactnative.cn/topic/4301/)。如果你嫌麻烦，又没有对新版本的需求，那么可以暂时创建`0.44.3`的版本。

> 提示：你可以使用`--version`参数（注意是`两`个杠）创建指定版本的项目。例如`react-native init MyApp --version 0.44.3`。注意版本号必须精确到两个小数点。

```bash
react-native init AwesomeProject
cd AwesomeProject
react-native run-ios
```

### Android 开发环境

#### 必须安装的依赖

Node、Watchman 和 React Native 命令⾏⼯具以及 JDK 和 Android Studio

虽然你可以使⽤ 任何编辑器 来开发应⽤（编写 js 代码），但你仍然必须安装 Android Studio 来提供编译 Android 应⽤所需的⼯具和环境。

#### Java Development Kit

React Native 需要 Java Development Kit [JDK] 1.8（暂不⽀持 1.9 及更⾼版本）

你可以在命令⾏中输⼊ javac -version 来查看你当前安装的 JDK 版本。如果版本不合要求，则可以到[官⽹](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)下载。

#### Android Studio

如果你之前没有接触过 Android 的开发环境，那么请做好⼼理准备，这⼀过程相当繁琐。请万分仔细地阅读下⾯的说明，严格对照⽂档进⾏配置操作。

##### 安装 Android Studio

[下载和安装 Android Studio](https://developer.android.google.cn/studio)，国内⽤户可能⽆法打开官⽅链接，请⾃⾏使⽤搜索引擎搜索可⽤的下 载链接。安装界⾯中选择"Custom"选项，确保选中了以下⼏项：

```
Android SDK

Android SDK Platform

Android Virtual Device（可选）
```

然后点击"Next"来安装选中的组件，如果选择框是灰的，你也可以先跳过，稍后再来安装这些组件。

##### 安装 Android SDK

**如果提示SDK缺失，可以先手动下载： [Android SDK](http://tools.android-studio.org/index.php/sdk)**，有问题可以参考 [Mac平台安装配置Android SDK](https://blog.csdn.net/qq_38741986/article/details/90669677)。

Android Studio 默认会安装最新版本的 Android SDK。⽬前编译 React Native 应⽤需要的是 Android 9 (Pie) 版本的 SDK（注意 SDK 版本不等于终端系统版本，RN ⽬前⽀持 android4.1 以上设备）。你可以在 Android Studio 的 SDK Manager 中选择安装各版本的 SDK。

你可以在 Android Studio 的欢迎界⾯中找到 SDK Manager。点击"Conﬁgure"，然后就能看到"SDK Manager"。

![](https://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/20200521105702.png)

> SDK Manager 还可以在 Android Studio 的"Preferences"菜单中找到。具体路径是Appearance & Behavior → System Settings → Android SDK。

在 SDK Manager 中选择"SDK Platforms"选项卡，然后在右下⻆角勾选"Show Package Details"。展 开 Android 9 (Pie) 选项，确保勾选了下⾯这些组件（重申你必须使⽤稳定的翻墙⼯具，否则可能都 看不到这个界⾯）：

- Android SDK Platform 28 
- Intel x86 Atom_64 System Image （官⽅模拟器镜像⽂件，使⽤⾮官⽅模拟器不需要安装此组件） 

然后点击"SDK Tools"选项卡，同样勾中右下⻆角的"Show Package Details"。展开"Android SDK BuildTools"选项，确保选中了 React Native 所必须的 `28.0.3`版本。你可以同时安装多个其他版本。

> Android SDK Build-Tools 是编译 Android 应用所需 Android SDK 的一个组件，安装在 `/build-tools/` 目录中。如果您使用的是 [Android Plugin for Gradle 3.0.0](https://developer.android.google.cn/studio/releases/gradle-plugin#3-0-0) 或更高版本，那么您的项目会自动使用该插件指定的默认版本的 Build Tools。
>

要使用其他版本的 Build Tools，请在模块的 `build.gradle` 中使用 [`buildToolsVersion`](http://google.github.io/android-gradle-dsl/current/com.android.build.gradle.AppExtension.html#com.android.build.gradle.AppExtension:buildToolsVersion) 进行指定，如下所示：

```java
android {    
  buildToolsVersion "29.0.2"    
    ...  
}  
```

最后点击"Apply"来下载和安装这些组件。

![](https://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/20200521110024.png)

**注意：**打开 Android SDK 后如果只能看到已经安装的 SDK或者无法显示 SDK，可以打开 SDK Update Sites 配置一下代理。

```bash
# 东软
name: mirrors.neusoft.edu.cn

url: http://mirrors.neusoft.edu.cn/android/repository/repository-12.xml
```

##### 配置 ANDROID_HOME 环境变量

React Native 需要通过环境变量来了解你的 Android SDK 装在什么路径，从⽽正常进⾏编译。

具体的做法是把下⾯的命令加⼊到 `~/.bash_profile` ⽂件中：

> 注：~表示⽤户⽬录，即 /Users/你的⽤户名/ ，⽽⼩数点开头的⽂件在 Finder 中是隐藏的，并 且这个⽂件有可能并不存在。可在终端下使⽤ vi ~/.bash_profile 命令创建或编辑。
>

如果你不是通过Android Studio安装的sdk，则其路径可能不同，请⾃⾏确定清楚。 

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk 

export PATH=$PATH:$ANDROID_HOME/tools 

# 如果没有 platform-tools 目录，点击tools里面的 android.bat 运行一下
export PATH=$PATH:$ANDROID_HOME/platform-tools 

# 验证是否配置成功
adb -version
```

> 如果你的命令⾏不是 bash，⽽是例如 zsh 等其他，请使⽤对应的配置⽂件。 

使⽤ `source $HOME/.bash_profile` 命令来使环境变量设置⽴即⽣效（否则重启后才⽣效）。可以使 ⽤ `echo $ANDROID_HOME` 检查此变量是否已正确设置。 

> 请确保你正常指定了 Android SDK 路径。你可以在 Android Studio 的"Preferences"菜单中查看 SDK 的真实路径，具体是Appearance & Behavior → System Settings → Android SDK。

##### 安装 Genymotion（可选）

比起 Android Studio 自带的原装模拟器，Genymotion 是一个性能更好的选择，但它只对个人用户免费。

1. 下载和安装 [Genymotion](https://www.genymotion.com/download)（genymotion 需要依赖 VirtualBox 虚拟机，下载选项中提供了包含 VirtualBox 和不包含的选项，请按需选择）。
2. 打开 Genymotion。如果你还没有安装 VirtualBox，则此时会提示你安装。
3. 创建一个新模拟器并启动。
4. 启动 React Native 应用后，可以按下 ⌘+M 来打开开发者菜单。

具体的可以参考下这篇文章：[Genymotion安装详解](https://www.cnblogs.com/whycxb/p/6850454.html)

> 如果 Android studio3 安装完 Genymotion 插件后没有显示插件图标，打开Android studio 的 Toolbar 就可以了（View->Appearance->Toolbar）