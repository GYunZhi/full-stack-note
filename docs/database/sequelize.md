Sequelize 是一个基于 **promise** 的 Node.js ORM(Object Relation Mapping)  , 目前支持 Postgres, MySQL, SQLite 和 Microsoft SQL Server等数据库. 它具有强大的事务支持, 关联关系, 预读和延迟加载,读取复制等功能。

中文文档：https://github.com/demopark/sequelize-docs-Zh-CN

API文档： https://sequelize.org/master/class/lib/sequelize.js~Sequelize.html

## 基本使用

###  安装

```bash
# 安装sequelize和对应的数据库驱动程序
yarn add sequelize mysql2
```

### 建立连接

### 测试连接

```js
sequelize
  .authenticate()
  .then(() => {
  console.log('Connection successfully.')
})
  .catch(err => {
  console.error('Unable to connect to the database:', err)
})
```

### 关闭连接

Sequelize 将默认保持连接持续,并对所有查询使用相同的连接. 如果需要关闭连接,请调用`sequelize.close()`(该方法是异步的并返回Promise).

## 模型定义

```js
// fruit.js
(async () => {
  const Sequelize = require('sequelize')

  // 建立连接
  const sequelize = new Sequelize('sequelize', 'root', 'a1234567', {
    host: 'localhost',
    dialect: 'mysql' // sequelize支持多种数据库，通过 dialect 选项配置使用 mysql 数据库
  })

  // 定义模型(模型和表存在映射关系)
  const Fruit = sequelize.define('fruit', {
    name: { type: Sequelize.STRING(20), allowNull: false },
    price: {
      type: Sequelize.FLOAT,
      allowNull: false,
      validate: {
        isFloat: { msg: '价格字段请输入数字' },
        min: { args: [0], msg: '价格字段必须大于0' }
      }
    },
    stock: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      validate: {
        isNumeric: { msg: '库存字段请输入数字' }
      }
    }
  })

  // 模型与数据库同步 注意:如果表已经存在,使用`force:true`将删除该表
  await Fruit.sync({ force: false })
})()

```

### 更改模型的默认参数

```js
// 定义模型
const Fruit = sequelize.define('fruit',
  { 
  	// 属性
	},
  {
  	// 参数
  	// `timestamps` 字段指定是否将创建 `createdAt` 和 `updatedAt` 字段.
    timestamps: false，
    // 禁用修改表名; 默认情况下,sequelize将自动将所有传递的模型名称转换为复数后作为表名
    freezeTableName: true, // 默认 false
    tableName:'fruits', // 自定义表名
    underscored: true // 指定表中字段的命名为下划线命名（默认是驼峰命名）createAt -> create_at
  }
)
```

你可以在 [sequelize.define API 参考](http://docs.sequelizejs.com/class/lib/sequelize.js~Sequelize.html#instance-method-define) 中阅读有关创建模型的更多信息.

### 模型与数据库同步

```js
// 注意:如果表已经存在,使用`force:true`将删除该表
Fruit.sync({force: true})
```

**一次同步所有模型**

你可以调用`sequelize.sync()`来自动同步所有模型,而不是为每个模型调用`sync()`.

### UUID-主键 

```js
// 定义模型
const Fruit = sequelize.define(
  'fruit',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    // 使用 UUID 的主键
    id: {
      type: Sequelize.DataTypes.UUID,
      defaultValue: Sequelize.DataTypes.UUIDV1,
      primaryKey: true
    }
  }
)
```

### Getters & Setters

可以在模型上定义'对象属性'的 getter 和 setter 函数,这些可以用于映射到数据库字段的“保护”属性,也可以用于定义“伪”属性.

Getters和Setters可以通过两种方式定义(你可以混合使用这两种方式):

- 定义为属性定义的一部分
- 定义为模型参数的一部分

**注意:** 如果在两个地方定义了getter或setter,那么在相关属性定义中找到的函数始终是优先的.

```js
// 定义为属性的一部分
name: {
	type: Sequelize.STRING,
	allowNull: false,
	get() {
		const fname = this.getDataValue("name");
		const price = this.getDataValue("price");
		const stock = this.getDataValue("stock");
		return `${fname}(价格：￥${price} 库存：${stock}kg)`;
	}
} 

// 定义为模型参数的一部分， 在options中
{
	getterMethods:{
		amount(){
		return this.getDataValue("stock") + "kg";
	}
},
setterMethods: {
  amount(val) {
    const arr = val.indexOf('kg')
    const num = val.slice(0, arr)
    this.setDataValue('stock', num)
  }
} 
  
// 通过模型实例触发getter 和 setter 函数
await Fruit.findAll().then(fruits => {
  console.log(fruits[0].amount)

  // 修改amount，触发setterMethods
  fruits[0].amount = '150kg'
  fruits[0].save()

  console.log('All fruits:', JSON.stringify(fruits, '', '\t'))
})
```

### 验证

通过校验功能验证模型字段的格式、内容，校验会在 create 、 update 和 save 时自动运行  

```js
price: {
	validate: {
		isFloat: { msg: "价格字段请输入数字" },
		min: { args: [0], msg: "价格字段必须大于0" }
	}
},
stock: {
	validate: {
		isNumeric: { msg: "库存字段请输入数字" }
	}
}
```

### 模型扩展

添加模型实例方法或类方法扩展模型

```js
// 添加类级别方法
Fruit.classify = function(name) {
  const tropicFruits = ['香蕉', '芒果', '椰子'] // 热带水果
  return tropicFruits.includes(name) ? '热带水果' : '其他水果'
}

// 使用类方法
let arr = ['香蕉', '草莓']
arr.forEach(f => console.log(f + '是' + Fruit.classify(f)))

// 添加实例级别方法
Fruit.prototype.totalPrice = function(count) {
  return (this.price * count).toFixed(2)
}

// 使用实例方法
Fruit.findAll().then(fruits => {
  const [f1] = fruits
  console.log(`买5kg${f1.name}需要￥${f1.totalPrice(5)}`)
})
```

## CRUD操作

### 新增

```js
Fruit.create({ name: '香蕉', price: 12 })
```

### 查询 

```js
// 通过属性查询
Fruit.findOne({ where: { name: '香蕉' } }).then(fruit => {
  // fruit是首个匹配项，若没有则为null
  console.log(fruit.get())
})

// 指定查询字段
Fruit.findOne({ attributes: ['name'] }).then(fruit => {
  // fruit是首个匹配项，若没有则为null
  console.log(fruit.get())
})

// 获取数据和总条数
Fruit.findAndCountAll().then(result => {
  console.log(result.count)
  console.log(result.rows.length)
})

// 查询操作符
const Op = Sequelize.Op
Fruit.findAll({
  // where: { price: { [Op.lt]:4 }, stock: { [Op.gte]: 100 } }
  where: { price: { [Op.lt]: 4, [Op.gt]: 2 } }
}).then(fruits => {
  console.log(fruits.length)
})

// 或语句
Fruit.findAll({
  // where: { [Op.or]:[{price: { [Op.lt]:4 }}, {stock: { [Op.gte]: 100 }}] }
  where: { price: { [Op.or]: [{ [Op.gt]: 3 }, { [Op.lt]: 2 }] } }
}).then(fruits => {
  console.log(fruits[0].get())
})

// 分页
Fruit.findAll({
  offset: 0,
  limit: 2
})

// 排序
Fruit.findAll({
  order: [['price', 'DESC']]
})

// 聚合
Fruit.max('price').then(max => {
  console.log('max', max)
})

Fruit.sum('price').then(sum => {
  console.log('sum', sum)
})
```

### 更新

```js
Fruit.update({ price: 4 }, { where: { name: '香蕉' } })
```

### 删除

```js
// 方式1
Fruit.findOne({ where: { id: 1 } }).then(r => r.destroy())

// 方式2
Fruit.destroy({ where: { id: 1 } }).then(r => console.log(r))
```

## 关联