## 安装 Docker

### windows 10 专业版

下载安装包：https://mirrors.aliyun.com/docker-toolbox/windows/docker-for-windows/

### centos 7

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

yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

```

## Docker架构和底层技术

### 架构

**Docker 作用**

- docker 提供了一个开发、打包和运行 application 的平台

- 把 application 和底层 infrastructure（底层的物理设备或者虚拟设备） 隔离开来

  ![mark](http://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/20191008/104240194.PNG)



**Docker Engine**

![mark](http://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/20191008/104811410.PNG)

**整体架构**

![mark](http://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/20191008/104714490.PNG)

### 底层技术

- Namespace：隔离pid、net、ipc、mnt、uts
- Control Groups：对进程做资源限制（对于宿主机来说，一个容器就是一个进程）
- Union File System：container 和 image 的分层

## Docker 基础

### Image 镜像

![mark](http://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/20191008/102706943.jpg)

- 文件和 Metadata 的集合（root filesystem）
- 镜像是分层的，并且每一层都可以添加、改变、删除文件，成为一个新的 Image
- 不同的 Image 可以共享相同的分层（如 #4 和 #2 共享了相同的 Base Image）
- Image 本身是只读的

**bootfs：内核空间，Linux 刚启动时会加载 bootfs 文件系统，之后 bootfs 会被卸载掉**

**rootfs：用户空间的文件系统，包含我们熟悉的 /dev, /usr, /bin 等目录**

**对于 base 镜像来说，底层直接用 Host 的 kernel，自己只需要提供 rootfs 就行了。**

**而对于一个精简的 OS，rootfs 可以很小，只需要包括最基本的命令、工具和程序库就可以了。相比其他 Linux 发行版，CentOS 的 rootfs 已经算臃肿的了(200MB左右)，alpine 还不到 10MB。**

##### 获取 Image 

- 通过 Dockerfile 构建

```bash
# Dockerfile
# -t ：指定要创建的目标镜像名
# . ：Dockerfile 文件所在目录，可以指定 Dockerfile 的绝对路径
FROM scratch
ADD hello /
CMD ["/hello"]

# 构建命令
docker build -t gongyz/hello-world . 
```

- 从镜像仓库中拉取，默认从 [Docker Hub](https://cloud.docker.com) 上拉取镜像

```bash
docker pull ubuntu || docker pull ubuntu:18.04 || docker pull gongyz/ubuntu:18.04
```

- 从已经创建的容器中更新镜像(不推荐)

```bash
# -m: 提交的描述信息
# -a: 指定镜像作者
# e218edb10161：容器ID
# gongyz/ubuntu:version: 指定要创建的目标镜像名和Tag（默认是latest）
docker commit -m="has update" -a="gongyz" e218edb10161 gongyz/ubuntu:version
```

##### 基本命令

```bash
# 查看本地镜像
docker image ls || docker images

# 查找镜像
docker search name

# 删除本地镜像
docker rmi name/id

# 删除未使用的镜像
docker rmi $(docker images --filter "dangling=true" -q --no-trunc)

# 查看镜像的 commit 记录
docker history name/id
```

### Container 容器

![mark](http://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/20191008/102758073.png)

- 通过 Image 创建
- 在 Image layer（只读层） 之上建立一个 container layer（可读写层）
- Image 负责 application 的存储和分发，Container 负责运行 application

##### 基本命令

```bash
# 运行容器
docker run id/name || docker run -it id/name || docker run --name="***" id/name

# 后台运行容器
docker run -d id/name

# 容器的端口映射到宿主机端口
docker run -d -p 5000:5000 id/name

# 运行容器时指定环境变量，容器中可以通过 env 命令查看环境变量
docker run -e NAME=gongyz id/name

# 查看正在运行容器
docker container ls || docker ps

# 查看所有容器（包括已退出容器）
docker container ls -a || docker ps -a

# 启动/关闭容器
docker start id/name || docker stop id/name

# 进入某个容器并执行指定的命令
docker exec -it id/name /bin/bash

# 删除容器
docker rm id/name

# 删除所有容器
docker rm $(docker ps -aq)

# 删除已退出容器
docker rm $(docker ps -f "status=exited" -q) 

# 查看容器详细信息
docker inspect id/name

# 查看容器运行日志
docker logs id/name
```

## Dockerfile 语法

FROM

```bash
# 指定基础镜像，尽量使用官方的 image 作为 base image
FROM scratch 	# 指定一个空的基础镜像
FROM centos
FROM ubuntu:14.04
```

LABEL 

```bash
# 定义 Image 的 Metadata，类似于代码注释
LABEL maintainer="gongyz 1018017334@qq.com"
LABEL version="1.0"
LABEL description="This is description"
```

RUN

```bash
# 执行指定的命令,每次执行 RUN 命令都会创建新的 Image Layer
# 为了避免无用分层，推荐合并多条命令成一行
# 为了可读性，复杂的 RUN 请用反斜杠换行
# RUN 经常用于安装软件包
RUN update && yum install -y vim \
	python-dev # 反斜杠换行
```

WORKDIR 

```bash
# 指定工作目录
# 推荐使用 WORKDIR， 不要使用 RUN cd
# 尽量使用绝对目录
WORKDIR /test # 如果没有会自动创建 test 目录
WORKDIR demo
RUN pwd 	  # 输出结果是 /test/demo
```

ADD && COPY 

```bash
# 将本地文件添加到镜像中指定目录
# 大部分情况下，COPY 优先于 ADD
# ADD还有解压的功能
# 添加远程文件/目录使用 curl 或者 wget
ADD hello /
ADD test.tar.gz /   # 添加到根目录并解压

WORKDIR /root
ADD hello test/     # /root/test/hello

WORKDIR /root
COPY hello test/
```

ENV 

```bash
# 设置常量
# 尽量使用 ENV 增加 Dockerfile 可维护性
ENV MYSQL_VERSION 5.6 # 设置常量
RUN apt install -y mysql-server="${MYSQL_VERSION}" # 引用常量
```

CMD 

```bash
# 设置容器启动后默认执行的命令
# 如果 docker run 指定了其他命令，CMD命令将会被忽略
# 如果定义了多个CMD，只有最后一个会执行

# Dockerfile
FROM centos
ENV name Docker
CMD echo "hello $name"

# 启动容器
docker run image # 输出 hello Docker

docker run -it image /bin/bash # 没有输出
```

ENTERPOINT

```bash
# 让容器以应用程序或者服务的形式运行
# 不会被忽略
# 最佳实践：写一个 shell 脚本作为 enterpoint

# Dockerfile
COPY docker-enterpoint.sh /usr/bin/
ENTERPOINT ["docker-enterpoint.sh"]
EXPOSE 27017
CMD ["mongod"]
```

VOLUME

```bash
# 指定数据持久化的路径
VOLUME /var/lib/mysql

# 建议运行容器时指定 volume 的名称
docker run -v mysql:/var/lib/mysql
```

EXPOSE

```bash
# 容器向外暴露的端口

# Dockerfile
FROM python:2.7
LABEL maintainer="gongyz 1018017334@qq.com"
RUN pip install flask
COPY app.py /app/
WORKDIR /app
EXPOSE 5000
CMD ["python", "app.py"]

# app.py
from flask import Flask
app = Flask(__name__)
@app.route('/')
def hello():
    return "hello docker"
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
```

Dockerfile 命令格式

```bash
# shell 格式 （ shell 格式底层会调用 /bin/sh -c <command> ）
RUN apt-get install -y vim 
CMD echo 'hello docker'
ENTERPOINT echo 'hello docker'

# Exec 格式
RUN ["apt-get", "install", "-y", "vim"]
CMD ["/bin/echo", "hello docker"]
ENTERPOINT ["/bin/echo", "hello docker"]
```

## Docker 网络（重点）

单机

- Bridge Network
- Host Network
- Node Network

多机（了解）

- Overlay Network（基于VXLAN网络实现数据包的传递）

#### Bridge Network

![mark](http://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/20191012/153641196.jpg)

借助于 linux 的 namespace 技术，docker 容器默认使用的是 Bridge 网络模式，该模式会为每一个容器分配、设置IP（每个容器都有自己独立的 network space），并将容器连接到一个 docker0 的虚拟网桥，通过 docker0 虚拟网桥实现容器以及容器和宿主机之间的通信。

容器虽然以及分配了IP地址，但是这个地址并不能直接访问 Internet，需要经过 NAT（网络地址转换）之后才能通过网卡连接到 Internet。

安装 Docker 时，它会自动创建三个网络，可以通过 `docker network ls` 命令列出这些网络：

```bash
docker network ls
NETWORK ID          NAME                DRIVER
7fca4eb8c647        bridge              bridge
9f904ee27bf5        none                null
cf03ee007fb4        host                host

# 查看指定网络模式
docker network inspect name/id
```

测试：通过 busybox 创建两个容器，测试容器之间是否能通信

```bash
# 查看本机网络情况，可以看到有一个 docker0 的虚拟网桥，且状态为DOWN
ip a

# 创建两个容器
docker run -d --name test1 busybox /bin/sh -c "while true; do sleep 3600; done"
docker run -d --name test2 busybox /bin/sh -c "while true; do sleep 3600; done"

# 再次查看本机网络情况，可以看到 docker0 的状态为 up，且多了两对 veth pair，这两对 veth pair 一个连接在宿主机的network space上，另一个连接在容器的 network space上
ip a

# 查看 Bridge Network 模式下的容器，可以看到新创建的两个容器
docker network inspect bridge

# 测试能否 ping 通
# test1 ip 172.17.0.2
# test2 ip 172.17.0.3
# 宿主机 ip 192.168.240.119

docker exec -it test1 ping 127.0.0.3

docker exec -it test2 ping 127.0.0.2

docker exec -it test1 ping 192.168.240.119

docker exec -it test2 ping 192.168.240.119
```

##### 容器之间的 link（很少用）

```bash
# 创建一个容器并连接到指定的容器
docker network --link id/name（指定的容器）id/name（镜像） 

# 创建 test2 容器并 link 到 test1
docker run -d --name test2  --link test1 busybox /bin/sh -c "while true; do sleep 3600; done"

# ping test1
ping 172.17.0.2 # ip
ping test1		# name
```

**注意：test2 连接到 test1 后，可以直接通过名称访问 test1，test1 不能却直接通过名称访问  test2。**

##### 自定义 network

```bash
# 创建一个 network
docker network create -d bridge mybridge # -d 参数指定 driver（网络模式）

# 查看 network 列表
docker network ls

# 创建 test3 容器并指定 network
docker run -d --name test3  --network mybridge busybox /bin/sh -c "while true; do sleep 3600; done"

# 自定义网络连接到已经创建的容器
docker network connect mybridge test2
```

**注意：两个容器连接到同一个自定义 network，那么这两个容器默认是互相连接的，可以直接通过名称访问。**

##### 容器的端口映射

```bash
# 启动容器时通过 -p 参数将容器端口映射到宿主机端口
docker run -d --name web -p 80:80 nginx
```

#### Host/None Network

```bash
# none network 外部无法访问该容器中启动的服务，只能进入容器中访问
docker run -d --name test1 --network none busybox /bin/sh -c "while true; do sleep 3600; done"

# host network 与宿主机共享一个 network space，可能存在端口冲突的问题，比如两个容器使用相同端口
docker run -d --name test2 --network host busybox /bin/sh -c "while true; do sleep 3600; done"
```

#### 多容器复杂应用的部署

场景： 部署一个包含 reids 数据库的 Python Web应用，web应用和 redis 在不同容器中启动

```bash
# app.py
from flask import Flask
from redis import Redis
import os
import socket

# REDIS_HOST 环境变量
app = Flask(__name__)
redis = Redis(host=os.environ.get('REDIS_HOST', '127.0.0.1'), port=6379)


@app.route('/')
def hello():
    redis.incr('hits')
    return 'Hello Container World! I have been seen %s times and my hostname is %s.\n' % (redis.get('hits'),socket.gethostname())


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

# Dockerfile
FROM python:2.7
LABEL maintaner="gongyz 1018017334@qq.com"
COPY . /app
WORKDIR /app
RUN pip install flask redis
EXPOSE 5000
CMD [ "python", "app.py" ]

# 创建镜像
docker image build -t gongyz/python-web .

# 启动 redis 容器
docker run -d --name redis redis

# 启动 python web 容器
docker run -d -p 5000:5000 --name python-web --link redis -e REDIS_HOST=redis gongyz/python-web
```

#### 多机网络

前面涉及的内容都是单机网络，包括多容器应用也是部署在单机上，那不同主机之间的容器应该如何建立连接和通信呢？这就涉及到 docker 的另外一种网络模式：Overlay Network。

![mark](http://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/20191014/114853310.PNG)

## Docker 持久化

默认情况下，容器的数据是保存在容器的可读写层，当容器被删除时，可读层上的数据将会丢失。所以为了实现数据的持久性，需要选择一种持久化技术来保存数据。Docker 支持两种持久化方案：**Data Volume** 和 **Bing Mouting**。

#### Data Volume（数据卷）

- 基于本地文件系统的 Volume，可以在执行 docker create 或者 docker run 时，通过 -v 参数将主机的目录作为容器的数据卷。
- 基于 plugin 的 Volume ，支持第三方的存储方案，比如NAS、AWS。

```bash
# Docker中所有的 volume 都在宿主机上的指定目录下 /var/lib/docker/volumes
# Data Volume 需要在 Dockerfile 中通过 VOLUME 参数指定数据卷

# Dockerfile
VOLUME /var/lib/mysql

# 启动一个 mysql 容器（建议运行容器时指定 volume 的名称）
docker run -d -v mysql:/var/lib/mysql --name mysql -e MYSQL_ALLOW_EMPTY_PASSWORD=true mysql
```

#### Bind Mouting（绑定挂载）

```bash
# 将宿主机中已存在的目录或者文件 mount 到容器中
docker run -d -p 3000:3000 -v $(pwd)/html:/node-http/html gongyz/node-http
```

## Docker Compose 多容器部署

#### 手动部署 wordpress 

```bash
# 部署 mysql
docker run -d --name mysql -v mysql:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=wordpress mysql:5.7

# 部署 wordpress
docker run -d -e WORDPRESS_DB_HOST=mysql --link mysql -p 8080:80 wordpress
```

**注意：如果平时最新版本的 Mysql，执行以上操作部署完成之后，访问 WordPress 站点会出现 ，Error establishing a database connection，显然，数据库连接失败。通过访问 mysql 容器的 log 来排查问题。**

```bash
docker logs mysql 

#提示：The server requested authentication method unknown to the client
#认证方法错误，mysql8.0 以后默认的认证方式改了，所以才会有这样的错误

# 解决办法
#进入mysql容器
docker exec -it mysql /bin/bash

#登陆数据库
mysql -u root -p
use mysql;

#开启root远程访问权限
grant all on *.* to 'root'@'%';

#修改加密规则
alter user 'root'@'localhost' identified by 'root' password expire never;

#更新密码
alter user 'root'@'%' identified with mysql_native_password by 'root';

#刷新权限
flush privileges;
```

通过手动部署 WordPress 可以发现，手动部署一个多容器应用非常不方便，至少需要经过以下几个步骤：

- 从 Dockerfile build image 或者 Docker Hub 拉取 image
- 创建多个 container
- 管理这些 container（启动、停止、删除）

所以我们需要使用 Docker Compose 去部署和管理多容器应用。

#### Docker Compose

##### 基本概念

Docker Compose 是 docker 官方编排工具 ，可以通过一个模板（YAML格式）定义多容器的 docker 应用，通过一条命令就可以根据模板创建和管理多个容器。

Docker Compose 目前有三个版本，推荐使用 Version 3，因为Version 3 可以用于多机部署。

**注意：Mac、Window10 环境下安装 docker 时同时安装了 docker compose，linux 环境下需要手动安装。**

模板文件的组成：

**service**

- 一个 service 代表一个 container ，这个 container 可以从 dockerhub 的 image 来创建，或者从本地 Dockerfile 文件 build 出来的 image 创建。
- service 的启动类似 docker run，我们可以给它指定 network 和 volume

```yaml
# 从 dockerhub 的 image 来创建
services：
	db：
	 	image：mysql
	 	volumes：
	 		- mysql:/var/lib/mysql
	 		
# 从本地 Dockerfile 文件创建	 		
services：
	node-http： 
		build:
			context: . # 指定 Dockerfile 文件所在的目录
      		dockerfile: Dockerfile
	 	links：   #  连接到同一个自定义 network 的容器默认是互相连接的，可以不配置 links
	 		- mysql
```

**volume**

```yaml
# 指定数据卷
volumes:
  db-data:

# 等同于
docker volume create db-data
```

**network**

```yaml
# 指定自定义网络
networks:
  my-bridge:
    driver: bridge
    
# 等同于
docker network create -d bridge my-bridge
```

**部署 wordpress 的 模板文件** 

```yml
# 使用默认的自定义网络
# 默认情况下会自动创建一个自定义网络，并且容器默认都连接到这个自定义网络
version: '3'

services:
  wordpress:
    image: wordpress
    ports:
      - 8080:80
    environment:
      WORDPRESS_DB_HOST: mysql
      WORDPRESS_DB_PASSWORD: root
  mysql:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: wordpress
    volumes:
      - mysql:/var/lib/mysql

volumes:
  mysql:
  
  
# 使用 networks 关键字指定自定义网络
version: '3'

services:
  wordpress:
    image: wordpress
    ports:
      - 8080:80
    environment:
      WORDPRESS_DB_HOST: mysql
      WORDPRESS_DB_PASSWORD: root
    networks:
      - my-bridge
  mysql:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: wordpress
    volumes:
      - mysql:/var/lib/mysql
    networks:
      - my-bridge

volumes:
  mysql:

networks:
  my-bridge:
    driver: bridge
```

##### 基本命令

```bash
# 创建容器
docker-compose build

# 创建并启动容器
docker-compose up -d # -d 参数指定在后台启动容器

# 启动容器
docker-compose start

# 停止容器
docker-compose stop

# 停止并删除容器和对应的自定义网络
docker-compose down

# 查看对应的镜像和容器
docker-compose images

# 查看对应容器
docker-compose ps

# 进入指定的容器
docker-compose exec xxx # naem为 service 中定义的名称 docker-compose exec mysql bash

# 查看容器运行日志
docker-compose logs
```

##### 水平扩展和负载均衡

通过 Docker Compose 的 --scale 命令可以同时部署多个web应用供用户访问，**并结合负载均衡器实现负载均衡，提高服务的稳定性**。

![mark](http://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/20191016/162315568.PNG)

测试：通过 `docker-compose --scale` 命令部署多个 Web 服务，通过 HAproxy 转发到不同的服务

```python
# app.py
from flask import Flask
from redis import Redis
import os
import socket

app = Flask(__name__)
redis = Redis(host=os.environ.get('REDIS_HOST', '127.0.0.1'), port=6379)


@app.route('/')
def hello():
    redis.incr('hits')
    return 'Hello Container World! I have been seen %s times and my hostname is %s.\n' % (redis.get('hits'),socket.gethostname())


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80, debug=True)
    
  
# Dockerfile
FROM python:2.7
LABEL maintaner="gongyz 1018017334"
COPY . /app
WORKDIR /app
RUN pip install flask redis
EXPOSE 80
CMD [ "python", "app.py" ]


# docker-compose.yml
version: "3"

services:

  redis:
    image: redis

  web:
    build:
      context: .
      dockerfile: Dockerfile
    # 使用 --scale 不要再指定宿主机端口，因为宿主机只有一个 8080 端口
    #ports:
    #  - 8080:80
    environment:
      REDIS_HOST: redis

  lb:
    image: dockercloud/haproxy
    links:
      - web
    ports:
      - 8080:80
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
```

```bash
 # 构建镜像     
 docker-compose build    
 
 # 部署镜像
 docker-compose up --scale web=4 -d
```

## Docker Swarm 容器编排

Dockers Compose 可以非常方便的实现单机多容器应用的部署和管理，甚至可以通过  --scale 参数实现水平扩展。但是对应多机之间容器的部署和管理就需要用到 Swarm。

 Swarm 是Docker 官方提供的集群管理工具，其主要作用是把若干台 Docker 主机抽象为一个整体，并且通过一个入口统一管理这些 Docker 主机上的各种 Docker 资源。 

#### 基础架构

##### 节点

Swarm 是一种集群架构， 集群中包含 Manager 和 Worker 两类节点（Node）。

-  **Manager**：是管理节点，管理 cluster 的状态。通过 Manager 节点去部署service；
-  **Worker**：是工作节点，manager在水平扩展 service 数量时，会将 service 平均分配至每个 Worker 节点上面。Worker节点不具备管理功能。

![mark](http://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/20191021/100538356.jpg)

- Manager 节点的数据存储在一个内置分布式存储数据库中（ Internal distributed state store ），不同的 Manager 之间通过 Raft 协议同步数据，Raft 协议能保证 Manager 节点的数据是对称的。
- Worker 节点之间通过 Gossip 网络同步数据。

##### 服务和任务

任务（Task） 是 Swarm 中的最小调度单位，目前来说就是一个单一的容器，服务（Service）是指一组任务的集合，服务定义了任务的属性。

**服务有两种模式：**

- replicated：按照一定规则在各个节点运行指定个数的任务，Service 可以水平扩展
- global：每个节点上运行一个任务 ，Service 不可以水平扩展

两种可以模式通过 docker service create 的 --mode 参数指定。

**容器、任务、服务的关系**

![mark](http://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/20191022/091739826.PNG)

**服务的创建和调度流程**

![mark](http://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/20191022/092117779.PNG)

#### 基本操作

##### 搭建实验环境

实验环境：创建一个三个节点的 swarm 集群

```bash
# 初始化一个 Manager 节点
docker swarm init --advertise-addr=192.168.240.119

# 查看加入集群命令
docker swarm join-token worker/manager

# worker 节点
docker swarm join --token SWMTKN-1-4mrd0oqwl9ch3ygdwwhglsto9wbrpvvvus7rs8t57c6ktaa34m-6m4xy67hortwmqd420yu8xt9d 192.168.240.119:2377

# manager 节点
docker swarm join --token SWMTKN-1-4mrd0oqwl9ch3ygdwwhglsto9wbrpvvvus7rs8t57c6ktaa34m-53x7qw7leybbfbhqxusaskq97 192.168.240.119:2377

# 离开集群
docker swarm leave

# 查看集群中节点
docker node ls
```

##### service 的创建和水平扩展

```bash
# 创建一个 service
docker service create -d --name test busybox /bin/sh -c "while true; do sleep 3600; done"

# 进入 service 中的某个容器
docker exec -it test sh

# 查看 service 中的容器
docker service ps test

# 水平扩展，servie 中的某个容器 down 掉了之后，会自动启动一个新的容器
docker service scale test=5

# 删除某个 service
docker service rm test
```

##### service 部署 wordpress 

```bash
# 部署 mysql
docker service create -d --name mysql --mount type=volume,source=mysql,destination=/var/lib/mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=wordpress --network demo mysql:5.7

# 部署 wordpress
docker service create -d --name wordpress -e WORDPRESS_DB_HOST=mysql -e WORDPRESS_DB_PASSWORD=root --network demo -p 8080:80 wordpress
```

#### 集群服务间通信

实验：创建两个服务，测试服务间通信情况

```bash
# 创建 service test1
docker service create -d --name test1 --network demo busybox:1.28.3 /bin/sh -c "while true; do sleep 3600; done"

# 创建 service test2
docker service create -d --name test2 --network demo busybox:1.28.3 /bin/sh -c "while true; do sleep 3600; done"

# 扩展 service test2
docker service scale test2=3

# 查看 test1 部署在哪个节点
docker service ps test1

# 进入 test1 中的容器
docker exec -it sh

# 测试 ping 和 nslookup
ping test2

nslookup test2

nslookup tasks.test2

# 结论
Swarm 模式下 Service 之间的通信是通过 VIP (虚拟IP) 实现的
```

**注意：上面两个服务能够通信，是因为他们在同一个网络下，不同网络下的服务是无法直接通信的。**

每个服务都有一个 虚拟的 IP 地址，并且该 IP 地址映射到与该服务关联的多个容器的 IP 地址。在这种情况下，与服务关联的服务 IP 不会改变，即使与该服务关联的容器挂掉并重新启动。

![](http://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/20191022/114503031.PNG)

在上面的例子中，总共有两个服务 myservice 和 client，其中 myservice 有两个容器，这两个服务在同一个网络中。在 client 里针对 docker.com 和 myservice 各执行了一个 curl 操作，下面是执行的流程： 

- 首先会对DNS 查询进行初始化 
- 容器内置的域名解析器在 127.0.0.11:53 拦截到这个 DNS 查询请求，并把请求转发到宿主机上 Docker 引擎的 DNS 服务中
- myservice 被解析成服务对应的 VIP，在接下来的  **内部负载均衡阶段再被解析成一个具体容器的IP地址**。如果是 myservice 是一个容器名称这一步会直接解析成容器对应的 IP 地址。
- docker.com 在 mynet 网络上不能被解析成服务，所以这个请求被转发到配置好的默认DNS服务器上 

##### **ingress network** 

 初始化或加入 Swarm 集群时会自动创建 `ingress` 网络， `ingress` 网络是一个特殊的 `overlay` 网络，用于服务节点间的**负载均衡**。当任何 Swarm 节点在发布的端口上接收到请求时，它将该请求交给一个名为 `IPVS` 的模块。`IPVS` 跟踪参与该服务的所有容器的IP地址，并将请求转发到其中某一个容器上。

![mark](http://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/20191022/143958458.PNG)



#### Docker Stack 多服务集群部署

部署 Wordpress

```yaml
# docker-compose.yml
version: '3'

services:

  web:
    image: wordpress
    ports:
      - 8080:80
    environment:
      WORDPRESS_DB_HOST: mysql
      WORDPRESS_DB_PASSWORD: root
    networks:
      - demo
    depends_on:
      - mysql
    deploy:
      mode: replicated
      replicas: 3
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
      update_config:
        parallelism: 1
        delay: 10s

  mysql:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: wordpress
    volumes:
      - mysql-data:/var/lib/mysql
    networks:
      - demo
    deploy:
      mode: global
      placement:
        constraints:
          - node.role == manager

volumes:
  mysql-data:

networks:
  demo:
    driver: overlay


# 部署
docker stack deploy wordpress -c=docker-compose.yml # -c 等价于 --compose-file  

# 删除
docker stack rm wordpress

# 查看 stack 下的服务
docker stack services wordpress
```

#### Docker Secret 

Docker 中的 Secret 包含：

- 用户名、密码
- SSH Key
- TLS 认证
- 任何不想让别人看到的数据

##### Secret 管理和使用

- Secret 存储在 Swram Manager 节点的 Raft database 中（数据默认是加密的）
- Secret 可以 assign 给一个 **service**，这个 service 就能使用这个 secret
- **在 container 内部 Secret 看起来像文件，但实际是存在内存中的**

```bash
# password.txt
a1234567

# 从文件创建 secret
docker secret create pwd password.txt

# 从标准输入创建 secret
echo "admin" | docker secret create pwd2 -

# 查看当前 secret
docker secret ls

# 创建一个 service 并传入 secret
docker service create -d --name test --secret pwd busybox /bin/sh -c "while true; do sleep 3600; done"

# 进入容器中
docker exec -it 8224bbd0d8cc sh

# 进入容器中 secret 存在的目录
cd /run/secrets 

# 查看 secret
cat pwd # a1234567

# 创建一个 mysql，通过 secret 指定 root 用户的密码
docker service create -d  --name db --secret pwd2 -e MYSQL_ROOT_PASSWORD_FILE=/run/secrets/pwd2 mysql:5.7
```

##### Secret 在 Stack 中的使用

```yaml
# docker-compose.yml
version: '3.6'

services:
  web:
    image: wordpress
    ports:
      - 8080:80
    secrets:
    	- db-pw
    environment:
      WORDPRESS_DB_HOST: mysql
      WORDPRESS_DB_PASSWORD: /run/secrets/db-pw
    networks:
      - demo
    depends_on:
      - mysql
    deploy:
      mode: replicated
      replicas: 3
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
      update_config:
        parallelism: 1
        delay: 10s

  mysql:
    image: mysql:5.7
    secrets:
    	- db-pw
    environment:
      MYSQL_ROOT_PASSWORD: /run/secrets/db-pw
      MYSQL_DATABASE: wordpress
    volumes:
      - mysql-data:/var/lib/mysql
    networks:
      - demo
    deploy:
      mode: global
      placement:
        constraints:
          - node.role == manager

volumes:
  mysql-data:

networks:
  demo:
    driver: overlay
    
# 不建议在这里指定 secrets 参数，建议创建好了 secret 之后在创建服务
secrets:
	db-pw:
		file: ./password.txt

# 部署
docker stack deploy wordpress -c=docker-compose.yml # -c 等价于 --compose-file  

# 删除
docker stack rm wordpress

# 查看 stack 下的服务
docker stack services wordpress
```

**注意：版本号小于 3.1 会报错：secrets Additional property secrets is not allowed**

## DevOps 实践

环境：centos7

部署工具： Gitlab + Gitlab-CI + Rancher

#### GitLab 的搭建

参考 https://about.gitlab.com/installation

1. **准备工作**

以Centos7为例，准备一台至少内存为4G的机器。

2. **安装依赖软件**


```bash
sudo yum install -y git vim gcc glibc-static telnet
sudo yum install -y curl policycoreutils-python openssh-server
sudo systemctl enable sshd
sudo systemctl start sshd

sudo yum install postfix
sudo systemctl enable postfix
sudo systemctl start postfix
```

**3. 设置gitlab安装源**

如果在国内的话，可以尝试使用清华大学的源。

新建 /etc/yum.repos.d/gitlab-ce.repo，内容为

```bash
[gitlab-ce]
name=Gitlab CE Repository
baseurl=https://mirrors.tuna.tsinghua.edu.cn/gitlab-ce/yum/el$releasever/
gpgcheck=0
enabled=1
```

如果在国外的话，可以使用

```bash
curl https://packages.gitlab.com/install/repositories/gitlab/gitlab-ee/script.rpm.sh | sudo bash
```

**4. 安装GitLab**

关于域名，如果要是设置域名，则如下，这个域名可以是真实购买的域名，如果您要把gitlab安装到公网比如阿里云上的话。

如果只是想本地测试，则可以像下面一样，设置一个example的域名，然后记得在本地你的笔记本设置host，如果是MAC就在 /etc/hosts里添加 一行 `192.168.242.243 gitlab.example.com`  

```bash
sudo EXTERNAL_URL="http://gitlab.example.com" yum install -y gitlab-ce
```

如果不想设置域名，或者想将来再考虑，可以设置为 ip 地址

```bash
sudo EXTERNAL_URL="http://106.12.48.161:80" yum install -y gitlab-ce
```

安装完成以后，运行下面的命令进行配置

```bash
# 配置 gitlab
sudo gitlab-ctl reconfigure

# 查看安装状态
sudo gitlab-ctl status

# 修改配置（如修改域名等）
sudo vim /etc/gitlab/gitlab.rb

# 修改配置之后重新配置 gitlab
sudo gitlab-ctl reconfigure

# 使用 docker 安装 gitlab，修改 EXTERNAL_URL="http://106.12.48.161:18080" 后需重新启动容器
docker run -d  -p 1443:443 -p 18080:18080 -p 222:22 --name gitlab --restart always -v /usr/local/docker/gitlab/config:/etc/gitlab -v /usr/local/docker/gitlab/logs:/var/log/gitlab -v /usr/local/docker/gitlab/data:/var/opt/gitlab gitlab/gitlab-ce
```

**5. 登陆和修改密码**


打开 http://gitlab.example.com/ 修改root用户密码，然后使用root和新密码登陆。

#### GitLab CI 的搭建

**1. 安装 gitlab ci runner **

```bash
curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-ci-multi-runner/script.rpm.sh | sudo bash
sudo yum install gitlab-ci-multi-runner -y
```

查看是否运行正常

```bash
sudo gitlab-ci-multi-runner status
```

**2.设置 Docker 权限**

为了能让 gitlab-runner 能正确的执行 docker 命令，需要把 gitlab-runner 用户添加到 docker group 里, 然后重启 docker 和 gitlab ci runner

```bash
sudo usermod -aG docker gitlab-runner
sudo service docker restart
sudo gitlab-ci-multi-runner restart
```

**重点概念**

gitlab-ci 全称是 gitlab continuous integration 的意思，也就是持续集成。中心思想是当每一次 push 到 gitlab 的时候，都会触发一次脚本执行，然后脚本的内容包括了 lint、test、build、deploy 等过程。

自动部署涉及了若干个角色，主要介绍如下

```bash
# gitlab-ci
gitlab-ci 是一套配合 GitLab 使用的持续集成系统，是 GitLab 自带的，也就是你装 GitLab 的那台服务器上就带有的。无需多考虑。.gitlab-ci.yml的脚本解析就由它来负责。

# .gitlab-ci.yml
这个是在git项目的根目录下的一个文件，记录了一系列的阶段和执行规则。GitLab-CI在 代码 push 后会解析它，根据里面的内容调用runner来运行。

# GitLab-Runner
这个是脚本执行的承载者，.gitlab-ci.yml的script部分的运行就是由runner来负责的。GitLab-CI浏览过项目里的.gitlab-ci.yml文件之后，根据里面的规则，分配到各个Runner来运行相应的脚本script。这些脚本有的是测试项目用的，有的是部署用的。

# Pipeline
一次 Pipeline 其实相当于一次构建任务，里面可以包含多个流程，如安装依赖、运行测试、编译、部署测试服务器、部署生产服务器等流程。

# Stages
Stages 表示构建阶段，说白了就是上面提到的流程。我们可以在一次 Pipeline 中定义多个 Stages，这些 Stages 会有以下特点：

    所有 Stages 会按照顺序运行，即当一个 Stage 完成后，下一个 Stage 才会开始

    只有当所有 Stages 完成后，该构建任务 (Pipeline) 才会成功

    如果任何一个 Stage 失败，那么后面的 Stages 不会执行，该构建任务 (Pipeline) 失败
    
# Jobs
Jobs 表示构建工作，表示某个 Stage 里面执行的工作。我们可以在 Stages 里面定义多个 Jobs，这些 Jobs 会有以下特点：
    相同 Stage 中的 Jobs 会并行执行
    相同 Stage 中的 Jobs 都执行成功时，该 Stage 才会成功
    如果任何一个 Job 失败，那么该 Stage 失败，即该构建任务 (Pipeline) 失败
```
## 其他

### Registry 私有库搭建

```bash
# registry
docker run -d -p 5000:5000 -v path:/var/lib/registry --restart=always --name regis registry:2

# registry 可视化界面
docker run -d -p 8080:8080 --name registry-web --link registry -e REGISTRY_URL=http://registry:5000/v2 -e REGISTRY_NAME=localhost:5000 hyper/docker-registry-web
```

### Harbor 私有库搭建

```bash
# 安装docker-compose
yum install docker-compose

# 下载在线安装版
wget --continue https://github.com/goharbor/harbor/releases/download/v1.9.3/harbor-online-installer-v1.9.3.tgz

# 解压 
tar -zxvf harbor-online-installer-v1.9.3.tgz

# 修改配置文件harbor.yml
hostname = 106.12.48.161 # 不能使用localhost和127.0.0.1，因为harbor需要被外部客户端访问
max_job_workers: 30 # 作业服务中的最大复制worker数，考虑到服务器的性能，修改成了30

# 运行prepare 更新参数
./prepare

# 执行 install.sh 安装harbor
bash install.sh

# 配置Insecure Registry

vim /etc/docker/daemon.json
{
  "registry-mirrors": ["https://p1plp029.mirror.aliyuncs.com"],
  "insecure-registries": ["192.168.37.170"] # 手动添加
}

或者

sudo tee /etc/docker/daemon.json <<-'EOF'
{
	"registry-mirrors": ["https://p1plp029.mirror.aliyuncs.com"],
  "insecure-registries": ["192.168.37.170"]
}
EOF

# 重启 docker 服务
sudo systemctl daemon-reload
sudo systemctl restart docker
```

### Jenkins 安装

```bash
# 其他自动化部署方案
#环境：centos7
#部署工具： Gitlab + Jenkins + Ansible

# 拉取 Jenkins 镜像
docker pull jenkins

# 创建文件夹
mkdir /home/jenkins          

# 给 uid 为 1000 的权限
chown -R 1000:1000 jenkins/

# 启动 Jenkins
docker run -d -p 8080:8080 -p 50000:50000 --name jenkins --privileged=true  -v /home/jenkins:/var/jenkins_home jenkins

# 通过查看 Jenkins 容器日志，获取初始化的管理员密码
docker logs jenkins
```
