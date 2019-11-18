## 安装

下载	

https://dev.mysql.com/downloads/windows/installer

编辑my.ini文件，配置数据库

```ini
#代码开始
[Client]
#设置3306端口
port = 3306
 
[mysqld]
#设置3306端口
port = 3306
# 设置mysql的安装目录
basedir=D:\Program Files\mysql-5.7.21
# 设置mysql数据库的数据的存放目录
datadir=D:\Program Files\mysql-5.7.21\data
# 允许最大连接数
max_connections=200
# 服务端使用的字符集默认为8比特编码的latin1字符集
character-set-server=utf8
# 创建新表时将使用的默认存储引擎
default-storage-engine=INNODB
sql_mode=NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES
 
[mysql]
# 设置mysql客户端默认字符集
default-character-set=utf8
#代码结束
```

## 安装为window服务

```Bash
mysqld install
# 启动 && 关闭
net start mysql
net stop  mysql

# 注意: 在 5.7 需要初始化 data 目录：
cd C:\web\mysql-8.0.11\bin 
mysqld --initialize-insecure 
#初始化后再运行 net start mysql 即可启动 mysql
```

## 登录MySQL

```bash
mysql -h 主机名 -u 用户名 -p

mysql -u root -p
```

## 忘记密码

```bash
# 跳过mysql的用户验证（输入此命令之前先在任务管理器中结束mysqld.exe进程）
mysqld --skip-grant-tables 
# 新开一个窗口直接登录数据库
show databases; 
use mysql;
# 会发现有个user表
show tables;
# 修改密码
update user set password=password('a1234567') where user='root' and host='localhost';
# 5.7版本，user表里就没有了password字段，需要用authentication_string字段
update user set authentication_string=password('a1234567') where user='root' and host='localhost';

```