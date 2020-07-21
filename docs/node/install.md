## 官网下载安装

官方地址：<https://nodejs.org/en/> 或 <https://nodejs.org/zh-cn/> 

下载完成之后直接双击安装即可，安装完成之后会自动添加node、npm环境变量，安装完成之后打开控制台，执行以下命令，测试是否安装成功

```bash
node -v  查看   node 版本
npm -v   查看   npm 版本
```

## 使用nvm安装  

   操作系统环境： windows 7 x64 

   安装nvm之前如果已经安装了node，没有关系，直接安装nvm，安装完成之后nvm会自动管理已经安装好的 node。

（1）安装nvm

- 安装[nvm-windows](https://github.com/coreybutler/nvm-windows#node-version-manager-nvm-for-windows) ，注意安装路径不要有中文或者空格，安装完成之后会自动添加环境变量
- 安装过程有一个Set Node.js Symlink的步骤，作用是设置一个快捷方式，这个路径可以nvm一样，也可以不一样，看个人习惯。
- 安装成功之后我们可以看一下nvm/settings.txt这个文件

```bash
root: D:\nvm // nvm安装目录
path: C:\Program Files\nodejs //快捷方式目录
```

- 执行以下代码，测试是否安装成功

```bash
nvm version
1.1.7  // 安装成功
```

（2）安装node

安装成功之后，接下来使用nvm命令来安装和使用指定的node版本

```bash
nvm install <version> <arch>  // 安装指定版本的node

nvm install 8.11.3
nvm install latest // 安装最新版本
nvm install 8.11.3 32 // 32位操作系统需指定arch值，声明系统架构为32位
```

```bash
nvm list  // 查看已经安装的node
	8.11.3
    10.12.0
  
nvm use 8.11.3 // 使用指定版本的node
	Now using node v8.11.3 (64-bit)
```

（3）快捷方式的作用，直接在安装nvm的时候设置了一个快捷方式目录，这里做一个说明，在C:\Program Files下会有一个nodejs，它是一个快捷方式，和我们当前nvm使用的那个node版本对应的文件夹是管理在一起的，如现在node的版本是8.11.3，那么当前这个快捷方式的文件夹和`D:\nvm\v8.11.3`文件夹是关联的。当使用`nvm use <version>`切换其他的node版本后，它就会和切换之后的node对应的文件夹进行关联。

## NPM全局模块和局部模块

在安装node的同时，会一起安装好npm模块，安装完成后，要设置镜像源，以加快下载速度：

```bash
# 设置镜像库
npm config set registry https://registry.npm.taobao.org

# 设置node源码地址
npm config set disturl https://npm.taobao.org/dist
```

设置完成之后可以在`C:\Users\Administrator\.npmrc`目录下查看到刚才的配置

我们知道npm安装的依赖可以是全局的，也可以是局部的，局部的模块是安装在项目中的的`node_modules`中。全局安装的模块有一些不同，可以通过`npm config get prefix` 查看全局模块安装的位置：

```bash
（1）通过官网下载安装的node 
  npm config get prefix
  C:\Users\Administrator\AppData\Roaming\npm // 默认位置

（2）通过nvm安装的node
  npm config get prefix
  C:\Program Files\nodejs
```

npm中还有一个缓存目录，可以通过`npm config get cache`查看

```bash
npm config get cache
C:\Users\Administrator\AppData\Roaming\npm-cache
```

修改全局模块目录和缓存目录

```bash
npm config set prefix 'C:\Program Files\nodejs\node_global'
npm config set cache 'C:\Program Files\nodejs\node_cache'

// 安装完成之后需配置环境变量
Path "，输入'C:\Program Files\nodejs\node_global'
```

安装yarn，我个人习惯使用yarn，所以在配置好npm后会先下载yarn，并且配置镜像源

```bash
yarn config set registry https://registry.npm.taobao.org --global 
yarn config set disturl https://npm.taobao.org/dist --global
```

同样的yarn的依赖也分为全局和局部依赖，我们可以通过`yarn global dir` 查看yarn全局安装的模块：

```bash
yarn global dir
C:\Users\Administrator\AppData\Local\Yarn\Data\global
```

注意事项：个人建议先安装node，在安装nvm，然后然nvm自动管理已经安装好的node，因为卸载node，通过nvm去安装时，全局模块安装的默认位置在`C:\Program Files\nodejs`，这个时候需要我们去修改手动修改全局模块和缓存目录，其次不能使用yarn去安装全局模块，原因目前暂时不知道。
