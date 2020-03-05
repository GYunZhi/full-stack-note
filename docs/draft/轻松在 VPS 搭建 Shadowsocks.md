# 轻松在 VPS 搭建 Shadowsocks

### VPS

[VPS](https://zh.wikipedia.org/wiki/%E8%99%9A%E6%8B%9F%E4%B8%93%E7%94%A8%E6%9C%8D%E5%8A%A1%E5%99%A8) 全称 **Virtual private server，虚拟专用服务器，**是将一台服务器分区成多个虚拟专享服务器的服务。每个VPS可配置独立IP、内存、CPU资源、操作系统。

#### **VPS与ECS区别**

云服务器（Elastic Compute Service，简称 ECS），例如 [阿里云ECS](https://cn.aliyun.com/product/ecs)，是一种简单高效、处理能力可弹性伸缩的计算服务。 简单来说就是能在一组服务器资源（CPU、内存等）调度。而VPS只能在一台服务器分配资源。

ECS灵活性、高可用性比VPS高，但价格也比VPS高。好像阿里云ECS，最低配CPU单核、内存1G、储存40G也要**80元/月**（还有带宽的账要算）；而国外很多VPS，标准配置CPU单核、内存1G、储存20G，**只要5美元/月（目前34.416人民币/月）**，而且按时收费。（本文介绍的最低配VPS只要**2.5美元/月**）

> 参考：[VPS 与虚拟主机有什么异同？](https://www.zhihu.com/question/19856629)

#### VPS能做什么

如果你是开发者，需要搭建个人网站，或者跑一些demo，VPS足够了。当然，你个人预算充足对服务器性能有要求，那就ECS吧。如果跑公司的业务，千万不要用VPS，VPS非高可用，万一挂了给公司带来很大的损失。

我们还能用**VPS搭建ShadowSocks做翻墙！一个人独占一条线路！稳定性高！**

------

#### VPS提供商——Vultr.com

国外的VPS提供商有好多，有名的**Vultr、Digital Ocean、Linode、搬瓦工（bandwagonhost）**。本文仅介绍Vultr，因为2.5美元/月性价比最高。

#### 注册账号

> <http://www.vultr.com/?ref=7038906> 
>
> 请务必**使用此链接**，有优惠。
> 请务必**使用此链接**，有优惠。
> 请务必**使用此链接**，有优惠。

点击上面链接，浏览Vultr官网。在首页填写**账号、密码**（至少10位、含英文大小写 & 数字），点击"Create Account"。

[![Create Account](http://upload-images.jianshu.io/upload_images/1359048-2e602d235daeda03.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)](http://upload-images.jianshu.io/upload_images/1359048-2e602d235daeda03.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

##### 支付

注册成功后，去Billing页面用支付宝充值：

[![Billing Alipay](https://diycode.b0.upaiyun.com/photo/2017/80abb72bffcdf83be22bef389644cf6c.jpg)](https://diycode.b0.upaiyun.com/photo/2017/80abb72bffcdf83be22bef389644cf6c.jpg)

##### 支付成功

当你支付成功后，在Vultr首页 **Billing -> History** 会显示你的充值记录。

##### 创建Server

在Vultr **Servers页面**，点击右上角**"+"按钮**

[![img](http://upload-images.jianshu.io/upload_images/1359048-3e9b8ac0875280a9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)](http://upload-images.jianshu.io/upload_images/1359048-3e9b8ac0875280a9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

选择配置，笔者建议**Los Angelos节点**，理论上Tokyo离我们最近，但非常不稳定。

[![创建Server](http://upload-images.jianshu.io/upload_images/1359048-79740ca62d3f0da4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)](http://upload-images.jianshu.io/upload_images/1359048-79740ca62d3f0da4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

操作系统看自己喜好，笔者习惯**CenterOS**；套餐最便宜2.5美金/月，按时收费，1CPU、512M Memory、500G Bandwitdh......（关于带宽、速度下问会说）

[![选择配置](http://upload-images.jianshu.io/upload_images/1359048-c71ba6c94d57201a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)](http://upload-images.jianshu.io/upload_images/1359048-c71ba6c94d57201a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

创建Server成功后，Servers界面会显示刚创建的Server，状态是**Installing**. 等几分钟，状态会变成**Running**。

[![成功创建Server](http://upload-images.jianshu.io/upload_images/1359048-fa30a406d3739526.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)](http://upload-images.jianshu.io/upload_images/1359048-fa30a406d3739526.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

------

##### 连接服务器

点击刚才创建的Server，进入详情页面：

[![img](http://upload-images.jianshu.io/upload_images/1359048-cedd59c46ef9cffd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)](http://upload-images.jianshu.io/upload_images/1359048-cedd59c46ef9cffd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

页面显示该VPS的IP、Username、Password；右上角有"View Console"按钮，点击后可以打开控制台登录VPS，笔者并不推荐这种方式。

### Putty客服端

> 如果你是Mac用户，直接使用terminal连接服务器即可，跳过此步骤。

Putty是一个免费SSH客户端，可以到 [Putty官网](https://www.diycode.cc/topics/www.putty.org) 下载putty客户端，下载页面：<http://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html>。SSH是一种安全协议，常用于连接服务器。

1.打开Putty，在**Session**页面填写VPS IP地址和Port（默认22）：

[![Putty - Session](http://upload-images.jianshu.io/upload_images/1359048-d8bf777b154ac568.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)](http://upload-images.jianshu.io/upload_images/1359048-d8bf777b154ac568.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

2.然后到**Connection -> Data**填写登录用户名（root）：

[![Putty - Connection - Data](http://upload-images.jianshu.io/upload_images/1359048-6653d75c0e2d680d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)](http://upload-images.jianshu.io/upload_images/1359048-6653d75c0e2d680d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

3.填写完后，顺手保存一下Session：

[![Putty保存Session](http://upload-images.jianshu.io/upload_images/1359048-899eb8f4fd966b11.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)](http://upload-images.jianshu.io/upload_images/1359048-899eb8f4fd966b11.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

4.点击Open连接VPS，连接成功后，会提示输入Password，输入密码后（大小写敏感），如果出现`[root@vultr ~]#`表示成功登录。

（注意，SSH连接有超时时间，默认大概1分钟。如果长期没操作，putty客户端没反应，只要重新用putty连接即可。）

### 修改登录密码

输入命令:

> passwd

要求输入新密码，按提示操作：

```
Changing password for user root.
New password:
Retype new password:
passwd: all authentication tokens updated successfully.
```

修改密码成功后，下次登录就用新密码咯。



### VPS安装ShadowSocks

运行以下命令:

```bash
wget --no-check-certificate -O shadowsocks-all.sh https://raw.githubusercontent.com/teddysun/shadowsocks_install/master/shadowsocks-all.sh
chmod +x shadowsocks-all.sh
./shadowsocks-all.sh 2>&1 | tee shadowsocks-all.log
```

选择脚本（Python、R、Go、libev），任选一个：

```bash
Which Shadowsocks server you'd select:
1.Shadowsocks-Python
2.ShadowsocksR
3.Shadowsocks-Go
4.Shadowsocks-libev
Please enter a number (default 1):
```

笔者选择`Shadowsocks-Go`，输入3......然后，输入密码和端口，笔者直接回车用默认：

```bash
You choose = Shadowsocks-Go

Please enter password for Shadowsocks-Go
(default password: teddysun.com):

password = teddysun.com

Please enter a port for Shadowsocks-Go [1-65535]
(default port: 8989):

port = 8989

Press any key to start...or Press Ctrl+C to cancel
```

安装成功后，命令行出现：

```bash
Congratulations, Shadowsocks-Go server install completed!
Your Server IP        :  45.32.73.59
Your Server Port      :  8989
Your Password         :  teddysun.com
Your Encryption Method:  aes-256-cfb

Welcome to visit: https://teddysun.com/486.html
Enjoy it!
```

（如果安装失败，请尝试其他脚本）

### 卸载方法

若已安装多个版本，则卸载时也需多次运行（每次卸载一种）

使用root用户登录，运行以下命令：

1. ./shadowsocks-all.sh uninstall

### 启动脚本

启动脚本后面的参数含义，从左至右依次为：启动，停止，重启，查看状态。

Shadowsocks-Python 版：

/etc/init.d/shadowsocks-python start | stop | restart | status

ShadowsocksR 版：

/etc/init.d/shadowsocks-r start | stop | restart | status

Shadowsocks-Go 版：

/etc/init.d/shadowsocks-go start | stop | restart | status

Shadowsocks-libev 版：

/etc/init.d/shadowsocks-libev start | stop | restart | status

### 各版本默认配置文件

Shadowsocks-Python 版：

/etc/shadowsocks-python/config.json

ShadowsocksR 版：

/etc/shadowsocks-r/config.json

Shadowsocks-Go 版：

/etc/shadowsocks-go/config.json

Shadowsocks-libev 版：

/etc/shadowsocks-libev/config.json

### Shadowsocks客户端

> [Shadowsocks官网](https://shadowsocks.com.hk/client.html)
>
>  
>
> windows客户端下载：<https://github.com/shadowsocks/shadowsocks-windows/releases>

笔者使用的3.4.3版本，下载好`Shadowsocks-3.4.3.zip`，解压，里面只有一个`Shadowsocks.exe`。打开，输入服务器ip、端口、密码：

[![Shadowsocks windows客户端](http://upload-images.jianshu.io/upload_images/1359048-953d8d293c71f2ea.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)](http://upload-images.jianshu.io/upload_images/1359048-953d8d293c71f2ea.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

把刚才安装Shadowsocks脚本成功后，输出的信息填上去：

> 服务器地址，vps的ip地址，Your Server IP
> 服务器端口，vps shadowsocks端口，Your Server Port ，默认**8989**
> 密码，Your Password，默认 **teddysun.com**
> 加密，Your Encryption Method，默认**aes-256-cfb**
> 代理端口，这是代理本机的端口，建议默认 **1080**



> mac用Shadowsocks-X NG客户端 <https://github.com/shadowsocks/ShadowsocksX-NG/releases>
>
> 

### Android客户端

> 下载ShowdockSocks Android : <https://github.com/shadowsocks/shadowsocks-android/releases>

1.点击“手动设置”

[![手动配置](http://upload-images.jianshu.io/upload_images/1359048-a58e7db6bf016b8f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)](http://upload-images.jianshu.io/upload_images/1359048-a58e7db6bf016b8f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

2.填写服务器信息

[![输入配置](http://upload-images.jianshu.io/upload_images/1359048-8a90dd396b4aec4f.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)](http://upload-images.jianshu.io/upload_images/1359048-8a90dd396b4aec4f.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

路由选择**“绕过局域网与中国大陆网址”**。

3.连接

[![连接代理服务器](http://upload-images.jianshu.io/upload_images/1359048-18dead3f49b3fbf1.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)](http://upload-images.jianshu.io/upload_images/1359048-18dead3f49b3fbf1.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

点击“检测网络连接”，等几秒出现“连接有效”证明连接成功：

[![检验网络](http://upload-images.jianshu.io/upload_images/1359048-d7451ee763718a43.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)](http://upload-images.jianshu.io/upload_images/1359048-d7451ee763718a43.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

------

### 进阶（干货）

#### TCP BBR 拥塞控制算法

TCP BBR 是 Google 开源的 拥塞控制算法，类似锐速的单边加速工具。由于受到各方面限制，国外的vps速度不理想，偶尔有延迟、不稳定的现象出现。而bbr的作用，就是要解决这一问题。

我们只需要在vps上安装即可，参考[《一键安装最新内核并开启 BBR 脚本》](https://teddysun.com/489.html)。

使用root用户登录，运行以下命令：

> wget --no-check-certificate <https://github.com/teddysun/across/raw/master/bbr.sh>
> chmod +x bbr.sh
> ./bbr.sh

安装完成后，脚本会提示需要重启 VPS，输入 y 并回车后重启。重启后，执行命令：

> lsmod | grep bbr

返回值有 tcp_bbr 模块即说明bbr已启动。

（TCP BBR要求Linux内核4.10以上，如果安装提示内核版本太低，去[《一键安装最新内核并开启 BBR 脚本》](https://teddysun.com/489.html)查看升级内核方法）

BBR成功安装后，shadowsocks速度有明显提升，尽管不是每个网络都能看youtube1080P视频（笔者公司无压力，在家就不行），但浏览普通外国网站很畅通。

#### FinalSpeed

FinalSpeed是TCPSpeed前身，TCPSpeed是双边加速工具，比上文提到单边加速更稳定，vps要安装，客户端也要安装（有点麻烦）。TCPSpeed要付费的，不过有国人的地方就有破解版。其实TCPSpeed 159RMB终身使用（1个付费TCPSpeed仅运行在1个VPS），还是可以接受的。

因为国内的线路复杂，笔者家里的电信看youtube就不怎么给力了（公司测试youtube速度扛扛的），FinalSpeed彻底解决了这个问题。

由于内容比较多，这里不详细介绍了。有兴趣的同学参考[《FinalSpeed:FinalSpeed安装 FinalSpeed破解版 FinalSpeed一键安装包 锐速替代品 FinalSpeed教程 双边加速FinalSpeed客户端下载及教程,Openvz福音【持续更新中，喜欢请收藏】》](http://www.vpsdx.com/912.html)

#### Snapshot

Snapshot是Vultr提供的VPS快照功能，简单地说就是保存VPS状态，有需要的时候恢复。这个功能相当实用，例如安装了shadowsocks、bbr等，snapshot；然后添加多一个vps，同样要shadowsocks+bbr，这时恢复snapshot，就不用再手动安装、配置了。

进去某个server，Snapshots界面，填写Label（一个备注而已），点"Take Snapshot"：

[![Take  Snapshot](http://upload-images.jianshu.io/upload_images/1359048-d345a1d2f62b8e2e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)](http://upload-images.jianshu.io/upload_images/1359048-d345a1d2f62b8e2e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

[![Take  Snapshot Successful](http://upload-images.jianshu.io/upload_images/1359048-1078bf84573a9873.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)](http://upload-images.jianshu.io/upload_images/1359048-1078bf84573a9873.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

刚添加Snapshots，Status时Pending，等5~10分钟，状态就变成Available，快照保存成功。（期间请不要修改VPS）

##### 恢复Snapshot

同样是某个Server里的Snapshot界面，点击最右边的"Restore Snapshot"按钮：

[![Restore Snapshot](http://upload-images.jianshu.io/upload_images/1359048-6b9d3f5a43560490.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)](http://upload-images.jianshu.io/upload_images/1359048-6b9d3f5a43560490.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

等上5~10分钟，Server就完全恢复Snapshot保存时的样子了。