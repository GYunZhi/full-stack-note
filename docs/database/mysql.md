## 安装

下载	https://dev.mysql.com/downloads/windows/installer

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

## Mysql 基本操作（数据库、数据表）

### 创建数据库

```bash
CREATE DATABASE 数据库名;
```

### 删除数据库

```bash
drop database <数据库名>;
```

### 选择数据库

```bash
use <数据库名>;
```

### 创建数据表

```bash
CREATE TABLE table_name (column_name column_type)

# 实例
CREATE TABLE
IF NOT EXISTS `runoob` (
	`runoob_id` INT UNSIGNED AUTO_INCREMENT,
	`runoob_title` VARCHAR (100) NOT NULL,
	`runoob_author` VARCHAR (40) NOT NULL,
	`submission_date` DATE,
	PRIMARY KEY (`runoob_id`)
) ENGINE = INNODB DEFAULT CHARSET = utf8;
```

- 如果你不想字段为 NULL 可以设置字段的属性为 NOT NULL， 在操作数据库时如果输入该字段的数据为NULL ，就会报错。
- AUTO_INCREMENT定义列为自增的属性，一般用于主键，数值会自动加1。
- PRIMARY KEY关键字用于定义列为主键。 您可以使用多列来定义主键，列间以逗号分隔。
- ENGINE 设置存储引擎，CHARSET 设置编码。

### 删除数据表

```bash
DROP TABLE table_name;
```

## Mysql 基本操作之CRUD

### 查询数据

```bash
SELECT column_name,column_name
FROM table_name
[WHERE Clause]
[LIMIT N][ OFFSET M]

# 查询所有数据
SELECT * FROM table_name
```

- 查询语句中你可以使用一个或者多个表，表之间使用逗号(,)分割，并使用WHERE语句来设定查询条件。
- SELECT 命令可以读取一条或者多条记录。
- 你可以使用星号（*）来代替其他字段，SELECT语句会返回表的所有字段数据
- 你可以使用 WHERE 子句来包含任何条件。
- 你可以使用 LIMIT 属性来**设定返回的记录数**。
- 你可以通过OFFSET指定SELECT语句开始查询的**数据偏移量**。默认情况下偏移量为0。

### 插入数据

```bash
INSERT INTO table_name (field1, field2 ,...fieldN) VALUES (value1, value2 ,...valueN);

# 实例
INSERT INTO websites(id,name,url,alexa,country) VALUES(0,'菜鸟工具','https://c.runoob.com',123,'CN')
```

### 更新数据

```bash
UPDATE table_name SET field1=new-value1, field2=new-value2 [WHERE Clause]

# 实例
UPDATE websites SET name = '菜鸟移动站',url = 'https://m.runoob.com' WHERE id = 23
```

- 你可以同时更新一个或多个字段。
- 你可以在 WHERE 子句中指定任何条件。
- 你可以在一个单独表中同时更新数据。

### 删除数据

```bash
DELETE FROM table_name [WHERE Clause]

# 实例
DELETE FROM websites where id=22
```

## Nodejs中使用Mysql

**nodejs原生驱动**

- 安装 mysql 模块：yarn add mysql
- 使用 mysql 连接数据库（普通连接、连接池）

```js
// mysql.js

const mysql = require('mysql')

// 配置
const config = {
  host: 'localhost',
  user: 'root',
  password: 'a1234567',
  database: 'test'
}

// 创建连接对象
const connection = mysql.createConnection(config)

// 连接数据库
connection.connect(err => {
  if (err) throw err
  console.log('连接成功')
})

// CURD 操作

// 查
var sql = 'SELECT * FROM websites'
connection.query(sql, function(err, result) {
  console.log(result)
  if (err) throw err
  console.log(JSON.stringify(result, '', '\t'))
  connection.end()
})

// 增
var addSql = 'INSERT INTO websites(id,name,url,alexa,country) VALUES(0,?,?,?,?)'
var addSqlParams = ['菜鸟工具', 'https://c.runoob.com', '23453', 'CN']

connection.query(addSql, addSqlParams, function(err, result) {
  if (err) throw err
  console.log(JSON.stringify(result, '', '\t'))
  connection.end()
})

// 改
var modSql = 'UPDATE websites SET name = ?,url = ? WHERE Id = ?'
var modSqlParams = ['菜鸟移动站', 'https://m.runoob.com', 6]

connection.query(modSql, modSqlParams, function(err, result) {
  if (err) throw err
  console.log(JSON.stringify(result, '', '\t'))
  connection.end()
})

// 删
var delSql = 'DELETE FROM websites where id=6'

connection.query(delSql, function(err, result) {
  if (err) throw err
  console.log(JSON.stringify(result, '', '\t'))
  connection.end()
})

```

**ES2017写法：安装 `mysql2`**

```js
(async () => {

  const mysql = require('mysql2/promise')

  // 配置
  const config = {
    host: 'localhost',
    user: 'root',
    password: 'a1234567',
    database: 'test'
  }

  // 创建连接对象
  const connection = await mysql.createConnection(config)

  // 连接数据库
  connection.connect(err => {
    if (err) throw err
    console.log('连接成功')
  })

  // CURD 操作
  // 查
  var sql = 'SELECT * FROM websites'
  await connection.query(sql).then(result => {
    console.log(JSON.stringify(result[0], '', '\t'))
  })


  // 增
  var addSql = 'INSERT INTO websites(Id,name,url,alexa,country) VALUES(0,?,?,?,?)'
  var addSqlParams = ['菜鸟工具', 'https://c.runoob.com', '23453', 'CN']

  await connection.query(addSql, addSqlParams).then(result => {
    console.log(JSON.stringify(result[0], '', '\t'))
  })

  // 改
  var modSql = 'UPDATE websites SET name = ?,url = ? WHERE Id = ?'
  var modSqlParams = ['菜鸟移动站', 'https://m.runoob.com', 8]

  await connection.query(modSql, modSqlParams).then(result => {
    console.log(JSON.stringify(result[0], '', '\t'))
  })

  // 删
  var delSql = 'DELETE FROM websites where id=6'
  await connection.query(delSql).then(result => {
    console.log(JSON.stringify(result[0], '', '\t'))
  })

  connection.end()

})()
```

**创建数据库连接池**

```js
const mysql = require('mysql')

// 配置
const config = {
  host: 'localhost',
  user: 'root',
  password: 'a1234567',
  database: 'test'
}

// 创建数据库连接池
const pool = mysql.createPool(config)

// 通过连接池执行数据CRUD操作
const query = function(sqlString, params) {
  console.log('sqlString：', sqlString)
  console.log('params：', params)
  return new Promise((resolve, reject) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        reject(err)
      } else {
        connection.query(sqlString, params, (err, rows) => {
          if (err) {
            reject(err)
          } else {
            resolve(rows)
          }
          connection.release()
        })
      }
    })
  })
}

// 测试
var sql = 'SELECT * FROM websites'
query(sql).then(result => {
  console.log(JSON.stringify(result, '', '\t'))
})

module.exports = {
  query,
  escape: mysql.escape
}
```