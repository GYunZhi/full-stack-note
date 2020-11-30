# Vagran安装CentOS

## 简介

Vagrant是一个基于Ruby的工具，用于创建和部署虚拟化开发环境，Vagrant的运行，需要依赖某项具体的**虚拟化技术**，最常见的有VirtualBox以及VMWare两款，早期，Vagrant只支持VirtualBox，后来才加入了VMWare和Hyper-V的支持。

我们可以使用它来干如下这些事：

- 建立和删除虚拟机
- 配置虚拟机运行参数
- 管理虚拟机运行状态
- 自动配置和安装开发环境
- 打包和分发虚拟机运行环境

## 环境安装

virtualbox下载地址：https://www.virtualbox.org/wiki/Downloads

Hyper-V：window10 专业版自带的虚拟机，需要在Windows功能中开启（使用Hyper-V的话可以不安装virtualbox）

vagrant下载地址：https://www.vagrantup.com/downloads.html

**说明：如果安装了 docker for windows 的话，直接用Hyper-V就可以了，如果再安装virtualbox两个软件之间会有冲突**

## 基本命令

在Vagrant中，有个box(箱子)的概念，类似于docker体系中的image(镜像)。基于同一个box，不同的人可以运行得到相同的虚拟环境。

直接从官网仓库下载box很慢，这里建议提前从国内的镜像仓库下载好box，手动添加到本地vagrant环境中。

### vagrant box 命令

```bash
# 查看本地环境中所有的box
vagrant box list

# 添加box到vagrant环境
vagrant box add box-name 

# 添加本地的box到vagrant环境
vagrant box add -name 'centos/7' [box放置的位置]

# 删除本地环境中指定的box
vagrant box remove box-name

# 更新本地环境中指定的box
vagrant box update box-name
```

### vagrant 命令

```bash
# 在空文件夹初始化虚拟机
vagrant init [box-name]

# 在初始化完的文件夹内启动虚拟机
vagrant up

# ssh登录启动的虚拟机
vagrant ssh

# 挂起启动的虚拟机
vagrant suspend

# 重启虚拟机
vagrant reload

# 关闭虚拟机
vagrant halt

# 查看虚拟机的运行状态
vagrant status

# 销毁当前虚拟机
vagrant destroy
```

## 创建CentOS7虚拟机

因为我本机安装了 docker for windows ，所以以 Vagrant + Hyper-V 为例记录安装过程。使用 virtualbox安装过程也是差不多的。

### 下载 box

centos7的镜像仓库：https://mirrors.ustc.edu.cn/centos-cloud/centos/7/vagrant/x86_64/images/

因为我本机安装了 docker for windows ，开启了 Hyper-V，所以我下载的是 CentOS-7.HyperV.box  版本，如果是VirtualBox请下载相应版本box。

### box 添加到本地环境

```bash
 # windows系统注意路径用 /
vagrant box add -name 'centos/7' F:/vagrant/box/centos7-hyperv.box
```

### 初始化虚拟机

创建一个文件夹，用于保存初始化之后生成的Vagrantfile文件，这个文件表示Vagrant对虚拟机的一些配置文件

```bash
vagrant init centos/7 --provider hyperv
```

### 启动虚拟机

```bash
vagrant up
```

### 连接虚拟机

启动之后通过 `vagrant ssh` 命令连接虚拟机，如果用的是cmd可能会存在下面的报错：

```bash
F:\homestead>vagrant ssh
`ssh` executable not found in any directories in the %PATH% variable. Is an
SSH client installed? Try installing Cygwin, MinGW or Git, all of which
contain an SSH client. Or use your favorite SSH client with the following
authentication information shown below:
 
Host: 127.0.0.1
Port: 2222
Username: vagrant
Private key: H:/homestead/.vagrant/machines/homestead-7/virtualbox/private_key
```

解决办法：

1、cmd中执行以下命令（临时有效，新开cmd窗口需要再次执行）

```bash
set PATH=%PATH%;C:\Program Files\Git\usr\bin
```

2、添加 git 安装目录路径至系统环境变量中（按照自己的安装路径）

### 使用Xshell工具连接虚拟机

安装成功后，直接通过 Xshell 工具是无法连接虚拟机的，所以需要进入虚拟机去修改一些配置。

1、通过 vagrant 命令进入虚拟机（或者通过 Hyper-V 进入虚拟机，默认账号和密码都是：`vagrant`）

```bash
vagrant ssh
```

2、修改root密码，默认root是没有密码的，修改完了之后，切换到root用户

```bash
# 修改密码
sudo passwd root

# 切换到 root
su root
```

3、进入文件夹`/etc/ssh`，修改配置文件`sshd_config`

```bash
cd /etc/ssh
vi sshd_config

# 修改前
# To disable tunneled clear text passwords, change to no here!
# PasswordAuthentication yes
#PermitEmptyPasswords no
PasswordAuthentication no

# 修改后
# To disable tunneled clear text passwords, change to no here!
PasswordAuthentication yes
#PermitEmptyPasswords no
PasswordAuthentication no

```

4、重启sshd.service服务

```bash
systemctl restart sshd.service
```

5、本地使用Xshell连接虚拟机，运行命令如下：

```bash
# 虚拟机地址和端口在启动的时候可以看到
ssh 127.0.0.1 22001
```