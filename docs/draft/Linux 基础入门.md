---
title: Linux 基础
copyright: true
date: 2018-02-07 16:08:23
tags: Linux
categories: Linux
---

# Linux 基础

## 基本环境搭建

### 安装 git

```bash
sudo apt install git  

# centos
rpm -qa|grep git # 查看是否安装了git
rpm -e --nodeps git || rpm -e git # 若已经安装，需要先卸载
yum install git # 安装
```

### 安装node、npm

apt -get 安装会报错，推荐使用源码方式安装

```bash
# 卸载已安装的Node和npm，这一点很重要，要不你装好了 node -v 还是原来的版本
sudo apt remove npm  //卸载npm
sudo apt remove node //卸载node
 
# 进入该目录中，若有node或者npm文件，将其删除
cd /usr/bin   

# 下载 node 二进制包
wget https://nodejs.org/dist/v12.11.1/node-v12.11.1-linux-x64.tar.xz

# 解压到opt目录下
tar -xJf node-v12.11.1-linux-x64.tar.xz  -C /opt

# 建立链接到 /usr/bin/ 目录
sudo ln -s /opt/node-v12.11.1-linux-x64/bin/node /usr/bin/node   
sudo ln -s /opt/node-v12.11.1-linux-x64/bin/npm /usr/bin/npm

# centos
# 安装 nvm 
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.9/install.sh | bash
source ~/.bashrc
```

### 安装 cnpm、yarn、pm2

```bash
# 全局安装
sudo npm install cnpm yarn pm2 -g

# 建立链接到 /usr/bin/ 目录
sudo ln -s /opt/node-v12.11.1-linux-x64/bin/cnpm /usr/bin/cnpm
sudo ln -s /opt/node-v12.11.1-linux-x64/bin/yarn /usr/bin/yarn
sudo ln -s /opt/node-v12.11.1-linux-x64/bin/pm2 /usr/bin/pm2

# centos
npm install cnpm yarn pm2 -g
```

### 安装 nginx

环境 centos 7

```shell
# 安装yum源
rpm -ivh http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm
yum info nginx
yum install -y nginx

# 启动 nginx
systemctl start nginx.service

# nginx配置文件位置在/etc/nginx/
vim /etc/nginx/conf.d/default.conf

# 网站打包后项目放置目录
/usr/share/nginx/html
 
# 重新加载配置
nginx -s reload
 
# 停止服务
nginx –s stop
 
# 检查配置文件（启动或重启失败可以尝试）
nginx -t
```

安装docker

```bash
# 使用 yum 安装 Docker
sudo yum install docker

# 启动Docker
service docker start

# 设置开机启动docker
systemctl enable docker

# 查看docker是否安装成功
docker version

# 重启docker
sudo service docker restart

# mysql
# 将容器中的 mysql 配置文件复制到宿主机中指定路径下，路径你可以根据需要，自行修改
docker cp mysql:/etc/mysql/mysql.conf.d/mysqld.cnf /usr/local/docker/mysql/config/

docker run -d --name mysql -p 3306:3306  -v /usr/local/docker/mysql/config/mysqld.cnf:/etc/mysql/mysql.conf.d/mysqld.cnf -v mysql:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=mysql@dev123 mysql:5.7

# 
docker run -d --name redis -p 6379:6379 -v /usr/local/docker/redis/redis.conf:/etc/redis/redis.conf -v redis:/data redis redis-server /etc/redis/redis.conf --appendonly yes

docker run -d --name mongo -v /usr/local/docker/mongo/configdb:/data/configdb -v mongo:/data/db -p 27017:27017 mongo:4 --auth
```

## 常用操作

```bash
# 获取管理员权限
sudo su

#下载文件
curl | wget  

# linux 包管理工具
yum | apt-get（apt） install ***

# 查看文件位置
which ***

# 查看磁盘剩余空间
df -hl
```

## 常见问题

```bash
# 解决 vim 粘贴内容错乱问题
先按ESC输入:set paste再复制粘贴 就行了 
```

## 目录操作

### 创建目录

使用 mkdir 命令创建目录

```bash
mkdir $HOME/testFolder
```

### 切换目录

使用 cd 命令切换目录

```bash
cd $HOME/testFolder
```

使用 cd ../ 命令切换到上一级目录

```bash
cd ../
```

### 移动目录

使用 mv 命令移动目录

```bash
mv $HOME/testFolder /var/tmp
```

### 删除目录

使用 rm -rf 命令删除目录

```bash
rm -rf /var/tmp/testFolder
```

### 查看目录下的文件

使用 ls 命令查看 [[/etc](about:blank#stage-1-step-5-etc)] 目录下所有文件和文件夹

```bash
ls /etc
```

> /etc 目录默认是 *nix 系统的软件配置文件存放位置

## 文件操作

> 任务时间：5min ~ 10min

### 创建文件

使用 touch 命令创建文件

```bash
touch ~/testFile
```

执行 `ls` 命令, 可以看到刚才新建的 testFile 文件

```bash
ls ~
```

### 复制文件

使用 cp 命令复制文件

```bash
cp ~/testFile ~/testNewFile
```

### 删除文件

使用 rm 命令删除文件, 输入 `y` 后回车确认删除

```bash
rm ~/testFile
```

### 查看文件内容

使用 cat 命令查看 .bash_history 文件内容

```bash
cat ~/.bash_history
```

## 过滤, 管道与重定向

> 任务时间：5min ~ 10min

### 过滤

过滤出 /etc/passwd 文件中包含 `root` 的记录

```bash
grep 'root' /etc/passwd
```

递归地过滤出 /var/log/ 目录中包含 `linux` 的记录

```bash
grep -r 'linux' /var/log/
```

### 管道

简单来说, Linux 中管道的作用是将上一个命令的输出作为下一个命令的输入, 像 pipe 一样将各个命令串联起来执行, 管道的操作符是 |

比如, 我们可以将 cat 和 grep 两个命令用管道组合在一起

```bash
cat /etc/passwd | grep 'root'
```

过滤出 /etc 目录中名字包含 `ssh` 的目录(不包括子目录)

```bash
ls /etc | grep 'ssh'
```

### 重定向

可以使用 > 或 < 将命令的输出重定向到一个文件中

```bash
echo 'Hello World' > ~/test.txt
```

## 运维常用命令

> 任务时间：5min ~ 10min

### ping 命令

对 cloud.tencent.com 发送 4 个 ping 包, 检查与其是否联通

```bash
ping -c 4 cloud.tencent.com
```

### netstat 命令

netstat 命令用于显示各种网络相关信息，如网络连接, 路由表, 接口状态等等

列出所有处于监听状态的tcp端口

```bash
netstat -lt
```

查看所有的端口信息, 包括 PID 和进程名称

```bash
netstat -tulpn
```

### ps 命令

过滤得到当前系统中的 ssh 进程信息

```bash
ps -aux | grep 'ssh'
```
