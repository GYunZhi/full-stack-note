// 插入文档

// db.col.insert({title: 'MongoDB 教程', 
//     description: 'MongoDB 是一个 Nosql 数据库',
//     by: '菜鸟教程',
//     url: 'http://www.runoob.com',
//     tags: ['mongodb', 'database', 'NoSQL', [1, 2]],
//     likes: 100
// })

// 不指定_id字段
// db.col.save({
//     title: 'MongoDB 新教程', 
//     description: 'MongoDB 是一个 Nosql 数据库',
//     by: '菜鸟教程',
//     url: 'http://www.runoob.com',
//     tags: ['mongodb', 'database', 'NoSQL'],
//     likes: 1000
// })

// 指定_id字段没有匹配任何文档
// db.col.save({
//     _id: 'sfsfsdfs',
//     title: 'MongoDB 新教程', 
//     description: 'MongoDB 是一个 Nosql 数据库',
//     by: '菜鸟教程',
//     url: 'http://www.runoob.com',
//     tags: ['mongodb', 'database', 'NoSQL'],
//     likes: 1000
// })



// 查询文档

// db.col.find()

// db.col.find().pretty()

// 匹配查询
// db.col.find({title: 'MongoDB 教程'})

// 模糊匹配查询
// 查询 title 包含"MongoDB"字的文档

// db.col.find({title:/MongoDB/})

// 查询 title 字段以"MongoDB"字开头的文档：

// db.col.find({title:/^MongoDB/})

// 查询 titl 字段以"教程"字结尾的文档

// db.col.findOne({title:/教程$/})

// 投影用法
// db.col.find({title:/^MongoDB/}, {_id:0, title: 1})

// db.col.find({title:/^MongoDB/}, {_id:0, title: 1, tags: {$slice: 1}})

// db.col.find({title:/^MongoDB/}, {_id:0, title: 1, tags: {$slice: -2}})

// $slice: [1, 1] 第一个参数相当于skip()，第二个参数相当于limit（）
// db.col.find({title:/^MongoDB/}, {_id:0, title: 1, tags: {$slice: [1, 2]}})

// $elemMatch返回数组字段中满足筛选条件的字符
// db.col.find({title:/^MongoDB/}, {_id:0, title: 1, tags: {$elemMatch: {$gt: 'database'}}})

// 比较运算符
// db.col.find({title: {$eq: 'MongoDB 教程'}}) 

// db.col.find({title: 'MongoDB 教程'})

// db.col.find({title: {$ne: 'MongoDB 教程'}})

// db.col.find({likes: {$gt: 80}})

// db.col.find({likes: {$gte: 70}})

// db.col.find({likes: {$lt: 70}})

// db.col.find({likes: {$lte: 10}})

// db.col.find({likes: {$lte: 10}})

// db.col.find({likes: {$in: [10, 100]}})

// db.col.find({likes: {$nin: [10, 100]}})

// 逻辑操作符
// db.col.find({'likes': {$not: {$lte: 70}}})

// db.col.find({$and:[{'likes': {$lte: 70}}, {'title': 'MongoDB 教程'}]})

// db.col.find({'title': 'MongoDB 教程', 'likes': {$lte: 70})

// db.col.find({'likes': {$lte: 70}, 'title': 'MongoDB 教程'}) // 简写

// db.col.find( {  'likes': { $lt: 70 , $gt: 10}} ) // 简写

// db.col.find({$or:[{'likes': {$lte: 70}}, {'title': 'MongoDB 教程'}]})

// db.col.find({$nor:[{'likes': {$gt: 70}}, {'title': 'MongoDB进阶'}]})

// 字段操作符
// db.col.find({'_id.type': {$exists: true}})

// db.col.find({"title" : {$type : 'string'}})

// db.col.find({"title" : {$type : 2}}) // String类型 数字为2

// 数组操作符
// db.col.find({ tags: { $all: [ 'NoSQL' , 'database'] } })

// db.col.find({ tags: { $all: [[1, 2]] } })

// db.col.find({ 'tags.3': { $elemMatch: {$gt: 1} } })

// db.col.find({ 'arr': { $size: 3 } })

// 运算操作符
// db.col.find({title: { $in: [/^M/, /阶$/]}})

// db.col.find({title: { $regex: /^m/, $options: 'i'}})


// 文档游标
var myCursor = db.col.find()
// var myCursor = db.col.find().noCursorTimeout()

// myCursor.close()

// 游标遍历
// while(myCursor.hasNext()){
//   printjson(myCursor.next())
// }

// myCursor.forEach(function(item){
//   printjson(item)
// })

// myCursor.limit(2)

// myCursor.skip(2)

// myCursor.count()

// db.col.find().limit(1)

// db.col.find().limit(0) // 参数为 0 相当于不使用limit

// db.col.find().limit(1).skip(1)

// db.col.find().limit(1).skip(1).count()

// db.col.find().limit(1).skip(1).count(true)

// db.col.find().sort({likes: 1})

// db.col.find().sort({likes: 1}).limit(4).skip(1)




// 更新文档

// 匹配更新
// db.col.update({title: 'MongoDB 进阶'},{name: 'gongyz'})

// db.col.update({name:'gongyz'},{adress: '江西'}, {upsert: true})

// 如果从筛选条件中可以确定字段值，那么新创建的文档将包含筛选条件涉及的字段
// db.col.update({name:'gongyz'},{$set: {adress: '江西'}}, {upsert: true})

// 不过，如果无法从筛选条件中推断出确定的字段值，那么新创建的文档就不会包含筛选条件涉及的字段
// db.col.update({num: {$gt: 20000}},{$set: {name: 'nick'}}, {upsert: true})

// 字段更新操作符
// db.col.update({title: 'MongoDB 教程'},{$set: {likes: 300}})

// db.col.update({'title':'MongoDB 教程'},{$set:{'title':'MongoDB'}}, false, true)

// db.col.updateMany({'title':'MongoDB'},{$set:{'title':'MongoDB 教程'}})

// db.col.updateMany({'title':'MongoDB 教程'},{$set:{'info': {date: Date(), adress: 'ZH'}}})

// db.col.updateMany({'title':'MongoDB 教程'},{$set:{'tags.0': 'mongo'}})

// db.col.updateMany({'title':'MongoDB 教程'},{$set:{'info.adress': 'AS'}})

// db.col.updateMany({'title':'MongoDB 教程'},{$unset:{'arr': ''}})

// db.col.updateMany({'title':'MongoDB 教程'},{$rename:{'title':'article'}})

// db.col.updateMany({'article':'MongoDB 教程'},{$rename:{'info.adress': 'adress', 'article': 'info.article'}})

// 数组更新操作符

// $addToSet会将数组插入被更新的数组字段中，成为内嵌数组，如果想将多个元素直接添加到数组字段中，则需要使用$each操作符

// db.col.updateMany({'title':'MongoDB 教程'},{$addToSet: {'arr': [3, 4]}})

// db.col.updateMany({'title':'MongoDB 教程'},{$addToSet: {'arr': {'name': 'gongyz', age: 23}}})

// db.col.updateMany({'title':'MongoDB 教程'}, {$addToSet: {arr: {$each: [1, 2]}}})

// db.col.updateMany({'title':'MongoDB 教程'}, {$pop: {arr: 1}}) // 删除最后一个元素

// db.col.updateMany({'title':'MongoDB 教程'}, {$pop: {arr: -1}}) // 删除第一个元素

// db.col.updateMany( {'title':'MongoDB 教程'}, { $pull: { tags: {$regex: /mo/} } } )

// db.col.updateMany( {'title':'MongoDB 教程'}, { $pull: { tags: {$regex: /mo/} } } )

// 如果要删除的元素是一个数组，数组元素的值和排列顺序都必须和被删除的元素完全一致
// db.col.updateMany( {'title':'MongoDB 教程'}, { $pullAll: { arr: [[3, 4]] } } )

// 如果要删除的元素是一个文档，$pullAll要求文档的值和排列顺序都必须和被删除的元素完全一致，$pull不需要完全一致

// db.col.updateMany( {'title':'MongoDB 教程'}, { $pullAll: { arr: [{'name': 'gongyz', 'age': 23}] } } )

// db.col.updateMany( {'title':'MongoDB 教程'}, { $pull: { arr: {'name': 'gongyz'} } } )

// $push和$addToSet命令相似，但是$push命令的功能更加强大，$push和$addToSet一样，如果$push命令中指定的字段不存在，这个字段会被添加到集合中

// db.col.updateMany({'title':'MongoDB 教程'},{$push: {'arr': [5, 6]}})

// db.col.updateMany({'title':'MongoDB 教程'}, {$push: {arr: {$each: [7, 8]}}})

// 使用$position将元素插入数组中指定的位置
// db.col.updateMany({'title':'MongoDB 教程'}, {$push: {arr: {$each: [0], $position: 0}}})

// 位置倒过来计算，插入到最后一个元素前面
// db.col.updateMany({'title':'MongoDB 教程'}, {$push: {arr: {$each: [9], $position: -1}}})

// 使用$sort对数组进行排序 1（从小到大） -1（从大到小），使用$sort时必须要使用$push和$each
// db.col.updateMany({'title':'MongoDB 教程'}, {$push: {arr: {$each: [10], $sort: -1}}})

// 如果插入的是内嵌文档，可以根据内嵌文档的字段排序
// db.col.updateMany({'title':'MongoDB 教程'}, {$push: {arr: {$each: [{value: 100}, {value: 200}], $sort: {value: -1}}}})

// 如果不想插入元素，只想对文档中的数组字段进行排序
// db.col.updateMany({'title':'MongoDB 教程'}, {$push: {arr: {$each: [], $sort: -1}}})

// 使用$slice截取部分数组
// db.col.updateMany({'title':'MongoDB 教程'}, {$push: {arr: {$each: [1], $slice: -2}}})

// 如果不想插入元素，只想截取部分数组
// db.col.updateMany({'title':'MongoDB 教程'}, {$push: {arr: {$each: [], $slice: 2}}})

// $position、$sort、$slice可以一起使用，但这三个操作符的执行顺序是：$position、$sort、$slice，写在命令中操作符的顺序并不重要，并不会影响命令的执行顺序

// db.col.updateMany({'title':'MongoDB 教程'}, {$push: {arr: {$each: [6, 8], $position: 0, $sort: -1, $slice: 2}}})

// 更新数组中所有元素
// db.col.updateMany({'title':'MongoDB 教程'}, {$set: {'arr.$[]': 'updated'}})

// $是数组中第一个符合筛选条件的数组元素的占位符（query中需要指明要更新的数组元素）
// db.col.updateMany({'title':'MongoDB 教程','arr': 'updated'}, {$set: {'arr.$': 1}})

// save()命令更新文档
// db.col.save({
//     _id: ObjectId("5e00a540edbd548b63736846"),
//     title: 'MongoDB 新教程', 
//     description: 'MongoDB 是一个 Nosql 数据库',
//     by: '菜鸟教程',
//     url: 'http://www.runoob.com',
//     tags: ['mongodb', 'database', 'NoSQL'],
//     likes: 1000
// })
// 


// 删除文档

// 默认情况下，remove命令会删除所有符合筛选条件的文档
// db.col.remove({'title':'MongoDB 教程'})

// 删除符合筛选条件的第一篇文档
// db.col.remove({'title':'MongoDB 教程'}, 1)

// db.col.remove({'title':'MongoDB 教程'}, {justOne: true})

// db.col.remove({'title':'MongoDB 教程'}, true)

// 删除所有文档（不会删除集合）
// db.col.remove({})

// 如果集合中文档的数量很多，使用remove命令删除所有文档的效率不高，在这种情况下，更加有效率的方法，
// 是使用drop命令删除集合，然后再创建空集合并创建索引



// 其他

// 复制文档操作
// db.col.find(
//     {'title':'MongoDB 教程'},
//     {_id: 0}
// ).forEach( function (doc) {
//     var newDoc = doc
//     newDoc.title = 'MongoDB进阶'
//     db.col.insert(newDoc) 
//   }
// )



// 聚合操作

// db.user.insertMany([
//     {
//         name: { firstName: 'alice', lastName: 'wong'},
//         balance: 50
//     },
//     {
//         name: { firstName: 'bob', lastName: 'yang'},
//         balance: 50
//     }
// ])


// db.user.update(
//     {
//         'name.firstName': 'alice'
//     },
//     {
//         $set: {currency: ['CNY', 'USD']}
//     }
// )

// db.user.update(
//     {
//         'name.firstName': 'bob'
//     },
//     {
//         $set: {currency: 'GBP'}
//     }
// )

// db.user.insertMany([
//     {
//         name: { firstName: 'charlie', lastName: 'gordon'},
//         balance: 100
//     },
//     {
//         name: { firstName: 'david', lastName: 'wu'},
//         balance: 200,
//         currency: []
//     },
//     {
//         name: { firstName: 'eddie', lastName: 'kim'},
//         balance: 20,
//         currency: null
//     }
// ])


// db.forex.insertMany([
//     {
//         ccy: 'USD',
//         rate: 6.91,
//         date: new Date('2018-12-21')
//     },
//     {
//         ccy: 'GBP',
//         rate: 68.72,
//         date: new Date('2018-8-21')
//     },
//     {
//         ccy: 'CNY',
//         rate: 1.0,
//         date: new Date('2018-12-21')
//     }
// ])

// db.transactions.insertMany([
//     {
//         symbol: '600519',
//         qty: 100,
//         price: 567.4,
//         currency: 'CNY'
//     },
//     {
//         symbol: '600518',
//         qty: 2,
//         price: 5677.4,
//         currency: 'USD'
//     },
//     {
//         symbol: '31312',
//         qty: 1010,
//         price: 5167.4,
//         currency: 'USD'
//     }
// ])


// db.user.remove({})


// $project 对输入文档进行再次投影
// db.user.aggregate([
//     {
//         $project: {
//             _id: 0,
//             balance: 1,
//             clientName: '$name.firstName'
//         }
//     }
// ])

// 字段路径表达式指向的是原文档中不存在的字段
// db.user.aggregate([
//     {
//         $project: {
//             _id: 0,
//             balance: 1,
//             newArr: ['$name.firstName', '$name.middleName', '$name.lastName',]
//         }
//     }
// ])

// $project是一个很常用的聚合操作符，可以用来灵活控制输出文档的格式，也可以用来剔除不相关的字段，以优化聚合管道操作的性能

// $match 对输入文档进行筛选
// db.user.aggregate([
//     {
//         $match: {
//             'name.firstName': 'alice'
//         }
//     }
// ])
    
// db.user.aggregate([
//     {
//         $match: {
//             $or: [
//                 {balance: {$gt: 40, $lt: 80}},
//                 {'name.firstName': 'yang'}
//             ]
//         }
//     }
// ])

// 将筛选和投影操作符结合在一起

// db.user.aggregate([
//     {
//         $match: {
//             $or: [
//                 {balance: {$gt: 40, $lt: 80}},
//                 {'name.firstName': 'yang'}
//             ]
//         }
//     },
//     {
//         $project: {
//             _id: 0
//         }
//     }
// ])

// $match也是一个很常用的聚合操作符，应该尽量在聚合管道的开始阶段应用$match，这样可以减少后续阶段中需要处理的文档数量，优化聚合操作的性能

// $limit  $skip
// db.user.aggregate([
//     {
//         $limit: 1
//     }
// ])
    
// db.user.aggregate([
//     {
//         $skip: 1
//     }
// ])

// $unwind 展开输入文档中的数组字段，会将指定字段数组元素拿出来创建新文档，新文档的主键_id都相同
// db.user.aggregate([
//     {
//         $unwind: {
//             path: '$currency'
//         }
//     }
// ])


// 展开时将数组元素在原数组中的下标位置写入一个指定的字段中
// db.user.aggregate([
//     {
//         $unwind: {
//             path: '$currency',
//             includeArrayIndex: 'ccyIndex'
//         }
//     }
// ])   

// 展开数组时保留空数组或不存在数组的文档
// db.user.aggregate([
//     {
//         $unwind: {
//             path: '$currency',
//             preserveNullAndEmptyArrays: true
//         }
//     }
// ])


// sort 对输入文档进行排序
// db.user.aggregate([
//     {
//         $sort: {balance: 1, 'name.lastName': -1}
//     }
// ]) 
// 

// $lookup：对输入文档进行查询操作，需要另一个查询集合参与，查询结果会多出一个新字段
// $lookup: {
//     from: <collection to join>,
//     localField: <field from the input document>,
//     foreignField: <field from the documents of the 'from' collection>,
//     as: <output array field>
// }

// from: 同一数据库中的另一个查询集合
// localFiled： 输入文档的字段
// foreignFiled：查询集合中字段
// as：给新插入的字段取一个名字

// 单一字段查询
// db.user.aggregate([
//     {
//         $lookup: {
//             from: 'forex',
//             localField: 'currency',
//             foreignField: 'ccy',
//             as: 'forexData'
//         }
//     }
// ]) 
// 

// 如果localField是一个数组字段，可以先对数组字段进行展开
// db.user.aggregate([
//     {
//         $unwind: {
//           path: '$currency',
//           preserveNullAndEmptyArrays: true
//         }
//     },
//     {
//         $lookup: {
//             from: 'forex',
//             localField: 'currency',
//             foreignField: 'ccy',
//             as: 'forexData'
//         }
//     }
// ]) 

// 使用复杂条件进行查询
// 对查询集合中的文档使用管道操作符处理时，如果需要参考输入文档中的字段，则必须使用let参数对字段进行声明
// $lookup: {
//     from: <collection to join>,
//     let: {<var_1>: <expression>, ..., <var_n>: <expression>},
//     pipeline: [<pipeline to execute on the collection to join>],
//     as: <output array field>
// }

// 不相关查询，查询条件和输入文档直接没有直接的联系，$lookup从3.6版本开始支持不相关查询
// db.user.aggregate([
//     {
//         $lookup: {
//             from: 'forex',
//             pipeline: [
//                 {
//                     $match: {
//                         date: new Date('2018-12-21')
//                     }
//                 }
//             ],
//             as: 'forexData'
//         }
//     }
// ]) 

// 相关查询（使用let声明定义了需要使用的输入文档中的字段时，pipeline中需要使用$expr操作符）
// db.user.aggregate([
//     {
//         $lookup: {
//             from: 'forex',
//             let: {bal: '$balance'},
//             pipeline: [
//                 {
//                     $match: {
//                         $expr: {
//                             $and: [
//                                 {$eq: ['$date', new Date('2018-12-20')]},
//                                 {$gt: ['$$bal', 100]}
//                             ]
//                             
//                         }
//                          
//                     }
//                 }
//             ],
//             as: 'forexData'
//         }
//     }
// ]) 

// $group：对输入文档进行分组
// $group: {
//     _id: <expression>,
//     <field1>: {<accumulator1> : <expression1>},
//     ...
// }

// _id: 定义分组规则
// db.transactions.aggregate([
//     {
//         $group : {
//             _id: '$currency'
//          }
//     }
// ])
// 不使用聚合操作符的情况下，$group可以返回输入文档中某一字段的所有（不重复的）值
    
// 使用聚合操作符计算分值聚合值
// db.transactions.aggregate([
//     {
//         $group : {
//             _id: '$currency',
//             totalQty: {$sum: '$qty'},
//             totalNotional: {$sum: {$multiply: ['$price', '$qty']}},
//             avgPrice: {$avg: '$price'},
//             count: {$sum: 1},
//             maxNotional: {$max: {$multiply: ['$price', '$qty']}},
//             minNotional: {$min: {$multiply: ['$price', '$qty']}}
//          }
//     }
// ])

// 使用聚合操作符计算所有文档聚合值
// db.transactions.aggregate([
//     {
//         $group : {
//             _id: null,
//             totalQty: {$sum: '$qty'},
//             totalNotional: {$sum: {$multiply: ['$price', '$qty']}},
//             avgPrice: {$avg: '$price'},
//             count: {$sum: 1},
//             maxNotional: {$max: {$multiply: ['$price', '$qty']}},
//             minNotional: {$min: {$multiply: ['$price', '$qty']}}
//          }
//     }
// ])

// 使用聚合操作符创建数组字段
// db.transactions.aggregate([
//     {
//         $group : {
//             _id: '$currency',
//                symbols: {$push: '$symbol'}
//          }
//     }
// ])

// $out 将管道中的文档输出写入一个新集合
// db.transactions.aggregate([
//     {
//         $group : {
//             _id: '$currency',
//             symbols: {$push: '$symbol'}
//          }
//     },
//     {
//         $out: 'output'
//     }
// ])

// $out 将管道中的文档输出写入一个已存在的集合，新集合会覆盖旧的集合
// db.transactions.aggregate([
//     {
//         $group : {
//             _id: '$currency',
//             totalNotional: {$sum: {$multiply: ['$price', '$qty']}}
//         }
//     },
//     {
//        $out: 'output'
//     }
// ])

// 如果聚合管道操作遇到错误，$out不会创建新集合或者是覆盖已存在的集合内容

// MongoDB对聚合操作的优化

// 聚合阶段顺序优化
// $project + $match
// $match阶段会在$project阶段之前运行
// db.transactions.aggregate([
//     {
//         $project: {
//             _id: 0,
//             symbol: 1,
//             currency: 1,
//             notional: {$multiply: ['$price', '$qty']}
//         }
//     },
//     {
//         $match: {
//             currency: 'USD',
//             notional: {$gt: 1000}
//         }
//     }
// ])

// 相当于

// db.transactions.aggregate([
//     {
//         $match: {
//             currency: 'USD'
//         }
//     },
//     {
//         $project: {
//             _id: 0,
//             symbol: 1,
//             currency: 1,
//             notional: {$multiply: ['$price', '$qty']}
//         }
//     },
//     {
//         $match: {
//             notional: {$gt: 1000}
//         }
//     }
// ])


// $project + $sort
// $match阶段会在$sort阶段之前运行
// db.transactions.aggregate([
//     {
//         $sort: {
//             price: 1
//             
//         }
//     },
//     {
//         $match: {
//             currency: 'USD'
//         }
//     }
// ])
    
// 相当于
    
// db.transactions.aggregate([
//     {
//         $match: {
//             currency: 'USD'
//         }
//     },
//     {
//         $sort: {
//             price: 1
//             
//         }
//     }
// ])


// $project + $skip
// $skip阶段会在$project阶段之前运行
// db.transactions.aggregate([
//     {
//         $project: {
//             _id: 0,
//             symbol: 1,
//             currency: 1,
//             notional: {$multiply: ['$price', '$qty']}
//             
//         }
//     },
//     {
//         $skip: 2
//     }
// ])
    
// 相当于
    
// db.transactions.aggregate([
//     {
//         $skip: 2
//     },
//     {
//         $project: {
//             _id: 0,
//             symbol: 1,
//             currency: 1,
//             notional: {$multiply: ['$price', '$qty']}
//             
//         }
//     },=
//     
// ])


// 聚合阶段合并优化

// $sort + $limit
// 如果两者之间没有夹杂着会改变文档数量的聚合阶段，$sort和$limit阶段可以合并

// db.transactions.aggregate([
//     {
//         $sort: {price: 1}
//     },
//     {
//         $project: {
//             _id: 0,
//             symbol: 1,
//             currency: 1,
//             notional: {$multiply: ['$price', '$qty']}
//             
//         }
//     },
//     {
//          $limit: 2
//      }
// ])


// $limit + $limit
// $skip + $skip
// $match + $match
// 连续的$limit,$skip,$match阶段排列在一起时，可以合并为一个阶段

// {$limit: 10},
// {$limit: 5}
// // 合并
// {$limit: 15}

// {$skip: 10},
// {$skip: 5}
// // 合并
// {$skip: 15}

// {$match: {currency: 'USD'}},
// {$match: {qty: 1}}
// // // 合并
// {
//     $match: {
//         $and: [
//             {currency: 'USD'},
//             {qty: 1}
//         ]
//     }
// }


// $lookup + $unwind
// 连续排列在一起的$lookup和$unwind阶段，如果$unwind应用在$lookup阶段创建的as字段上，则两者可以合并

// db.transactions.aggregate([
//     {
//         $lookup: {
//             from: 'forex',
//             localField: 'currency',
//             foreignField: 'ccy',
//             as: 'forexData'
//             
//         }
//     },
//     {
//          $unwind: '$forexData'
//      }
// ])



// 索引
// db.userWithIndex.insertMany([
//     {
//         name: 'alice',
//         balance: 500,
//         currency: ['GBP', 'USD']
//     },
//     {
//         name: 'bob',
//         balance: 20,
//         currency: ['AUD', 'USD']
//     },
//     {
//         name: 'bob',
//         balance: 300,
//         currency: ['CNY']
//     }
// ])

// 创建一个单键索引
// db.userWithIndex.createIndex({name: 1})

// 创建一个复合索引
// db.userWithIndex.createIndex({name: 1, balance: -1})

// 创建一个多键索引(用于数组的索引，数组字段中的每一个元素，都会在多键索引中创建一个键)
// db.userWithIndex.createIndex({currency: 1})

// 查看集合中已经存在的索引
// db.userWithIndex.getIndexes()

// 查询分析，使用explain()分析索引的效果

// 使用没有创建索引的字段进行搜索
// COLLSCAN (Collection Scan 扫描整个集合，低效的查询)
// db.userWithIndex.find({balance: 100}).explain()

// 使用已经创建索引的字段进行搜索
// IXSCAN —> FETCH
// 通过索引完成初步筛选，再根据索引中指示的文档储存地址，把对应的文档提取出来
// db.userWithIndex.find({name: 'alice'}).explain()

// 仅返回创建了索引的字段（查询效率更高）
// PROJECTION —> IXSCAN
// db.userWithIndex.find({name: 'alice'}, {_id: 0, name: 1}).explain()

// 使用已经创建索引的字段进行排序
// IXSCAN —> FETCH
db.userWithIndex.find().sort({name: 1, balance: -1}).explain()

// 使用未创建索引的字段进行排序
// COLLSCAN —> SORT_KEY_GENERATOR —> SORT
// db.userWithIndex.find().sort({name: 1, balance: 1}).explain()


// 删除索引
// db.userWithIndex.dropIndex()
// 如果需要更改某些字段上已经创建的索引，必须首先删除原有索引，再重新创建新索引，否则，新索引不会包含原有文档

// 使用索引名称删除索引
// db.userWithIndex.dropIndex('name_1')

// 使用索引定义删除索引
// db.userWithIndex.dropIndex({name: 1, balance: -1})



// 索引选项 options
// options 定义了创建索引时可以使用的一些参数,也可以设定索引的特性

// 创建具有唯一性的索引
// db.userWithIndex.createIndex({balance: 1}, {unique: true})

// 如果已有文档中的某个字段出现了重复值，就不可以在这个字段上创建唯一性索引
// db.userWithIndex.createIndex({name: 1}, {unique: true})

// 如果新增的文档不包含唯一性索引，只有第一个缺少改字段的文档可以被写入数据库，索引中该文档的键值被默认为null
// db.userWithIndex.insert({name: 'cherlie', lastAccess: new Date()})
// db.userWithIndex.insert({name: 'david', lastAccess: new Date()}) 

// 复合键索引也可以具有唯一性，在这种情况下，不同的文档之间，其所包含的复合键字段值的组合，不可以重复

// 创建具有稀疏性的索引
// db.userWithIndex.createIndex({balance: 1}, {sparse: true})

// 只将包含索引字段的文档加入到索引中（即便索引字段值为 null）
// db.userWithIndex.insert({name: 'cherlie', lastAccess: new Date()})

// 如果同一个索引既具有唯一性，又具有稀疏性，就可以保存多篇缺失索引键值得文档了
// db.userWithIndex.createIndex({balance: 1}, {unique: true, sparse: true})
// db.userWithIndex.insert({name: 'cherlie', lastAccess: new Date()})

// 复合键索引也可以具有稀疏性，在这种情况下，只有在缺失复合键所包含的所有字段的情况下，文档才不会被加入到索引中



// 索引的生存时间
// 针对日期字段，或者包含日期字段的数组字段，可以使用设定了生存时间的索引，来自动删除字段值超过生存时间的文档


// 在 lastAccess 字段上创建一个生存时间是20s的索引
// db.userWithIndex.createIndex({lastAccess: 1}, {expireAfterSeconds: 20})
// db.userWithIndex.insert({name: 'eddie', lastAccess: new Date()})


// 复合键索引不具备生存时间特效
// 当索引建是包含日期元素的数组字段时，数组中最小的日期将被用来计算文档是否过期
// 数据库使用一个后台线程来监测和删除过期的文档，删除操作可能会有一定的延迟


// db.userWithIndex.remove({name: 'cherlie'})
// db.userWithIndex.dropIndex('balance_1')
// db.col.find().pretty()
// db.user.find().pretty()
// db.transactions.find().pretty()
// db.output.find().pretty()
// db.userWithIndex.find().pretty()
// db.userWithIndex.getIndexes()