---
title: Blob API的使用
copyright: true
date: 2018-07-15 20:16:56
tags: JavaScript
categories: JavaScript
---

在一般的Web开发中，很少会用到Blob，但Blob可以满足一些场景下的特殊需求。Blob，Binary Large  Object的缩写，代表二进制类型的大对象。Blob的概念在一些数据库中有使用到，例如，MSQL中的BLOB类型就表示二进制数据的容器。在Web中，Blob类型的对象表示不可变的类似文件对象的原始数据，通俗点说，就是Blob对象是二进制数据，但它是类似文件对象的二进制数据，因此可以像操作File对象一样操作Blob对象，实际上，File继承自Blob。

## Blob基本用法

### 创建Blob对象

可以通过Blob的构造函数创建Blob对象：

```javascript
Blob(blobParts[, options])
```

参数说明：

blobParts：数组类型，数组中的每一项连接起来构成Blob对象的数据，数组中的每项元素可以是[`ArrayBuffer`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [`ArrayBufferView`](https://developer.mozilla.org/zh-CN/docs/Web/API/ArrayBufferView), [`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob), [`DOMString`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMString) 。

options：可选项，字典格式类型，可以指定如下两个属性：

- type，默认值为 `""`，它代表了将会被放入到blob中的数组内容的MIME类型。
- endings，默认值为"transparent"，用于指定包含行结束符`\n`的字符串如何被写入。 

   它是以下两个值中的一个： 

   ```javascript
   "native"，表示行结束符会被更改为适合宿主操作系统文件系统的换行符； 
   ```

   ```javascript
   "transparent"，表示会保持blob中保存的结束符不变。
   ```

例如：

```javascript
    var data1 = "a";
    var data2 = "b";
    var data3 = "<div style='color:red;'>This is a blob</div>";
    var data4 = { "name": "abc" };

    var blob1 = new Blob([data1]);
    var blob2 = new Blob([data1, data2]);
    var blob3 = new Blob([data3]);
    var blob4 = new Blob([JSON.stringify(data4)]);
    var blob5 = new Blob([data4]);
    var blob6 = new Blob([data3, data4]);

    console.log(blob1);  //输出：Blob {size: 1, type: ""}
    console.log(blob2);  //输出：Blob {size: 2, type: ""}
    console.log(blob3);  //输出：Blob {size: 44, type: ""}
    console.log(blob4);  //输出：Blob {size: 14, type: ""}
    console.log(blob5);  //输出：Blob {size: 15, type: ""}
    console.log(blob6);  //输出：Blob {size: 59, type: ""}
```

size代表`Blob` 对象中所包含数据的字节数。这里要注意，使用字符串和普通对象创建Blob时的不同，blob4使用通过`JSON.stringify`把data4对象转换成json字符串，blob5则直接使用data4创建，两个对象的size分别为14和15。blob4的size等于14很容易理解，因为JSON.stringify(data4)的结果为：`"{"name":"abc"}"`，正好14个字节(不包含最外层的引号)。blob5的size等于15是如何计算而来的呢？实际上，当使用普通对象创建Blob对象时，相当于调用了普通对象的toString()方法得到字符串数据，然后再创建Blob对象。所以，blob5保存的数据是`"[object Object]"`，是15个字节(不包含最外层的引号)。

### slice方法

Blob对象有一个slice方法，返回一个新的 `Blob`对象，包含了源 `Blob`对象中指定范围内的数据。

```javascript
slice([start[, end[, contentType]]])
```

参数说明：

start： 可选，代表 [`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) 里的下标，表示第一个会被会被拷贝进新的 [`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) 的字节的起始位置。如果传入的是一个负数，那么这个偏移量将会从数据的末尾从后到前开始计算。

end： 可选，代表的是 [`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) 的一个下标，这个下标-1的对应的字节将会是被拷贝进新的[`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) 的最后一个字节。如果你传入了一个负数，那么这个偏移量将会从数据的末尾从后到前开始计算。

contentType： 可选，给新的 [`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) 赋予一个新的文档类型。这将会把它的 type 属性设为被传入的值。它的默认值是一个空的字符串。

例如：

```javascript
    var data = "abcdef";
    var blob1 = new Blob([data]);
    var blob2 = blob1.slice(0,3);
    
    console.log(blob1);  //输出：Blob {size: 6, type: ""}
    console.log(blob2);  //输出：Blob {size: 3, type: ""}
```

通过slice方法，从blob1中创建出一个新的blob对象，size等于3。

## Blob使用场景

### 分片上传

前面已经说过，File继承自Blob，因此我们可以调用slice方法对大文件进行分片长传。代码如下：

```javascript
function uploadFile(file) {
  var chunkSize = 1024 * 1024;   // 每片1M大小
  var totalSize = file.size;
  var chunkQuantity = Math.ceil(totalSize/chunkSize);  //分片总数
  var offset = 0;  // 偏移量
  
  var reader = new FileReader();
  reader.onload = function(e) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST","http://xxxx/upload?fileName="+file.name);
    xhr.overrideMimeType("application/octet-stream");
    
    xhr.onreadystatechange = function() {
      if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        ++offset;
        if(offset === chunkQuantity) {
          alert("上传完成");
        } else if(offset === chunkQuantity-1){
          blob = file.slice(offset*chunkSize, totalSize);   // 上传最后一片
          reader.readAsBinaryString(blob);
        } else {
          blob = file.slice(offset*chunkSize, (offset+1)*chunkSize);   
          reader.readAsBinaryString(blob);
        }
      }else {
        alert("上传出错");
      }
    }
    
    if(xhr.sendAsBinary) {
      xhr.sendAsBinary(e.target.result);   // e.target.result是此次读取的分片二进制数据
    } else {
      xhr.send(e.target.result);
    }
  }
   var blob = file.slice(0, chunkSize);
   reader.readAsBinaryString(blob);
}
```

这段代码还可以进一步丰富，比如显示当前的上传进度，使用多个XMLHttpRequest对象并行上传对象（需要传递分片数据的位置参数给服务器端）等。

### Blob URL

Blob URL是blob协议的URL，它的格式如下：

```javascript
blob:http://XXX
```

Blob URL可以通过`URL.createObjectURL(blob)`创建。在绝大部分场景下，我们可以像使用Http协议的URL一样，使用Blob URL。常见的场景有：作为文件的下载地址和作为图片资源地址。

- 文件下载地址

```javascript
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Blob Test</title>
    <script>
        function createDownloadFile() {
            var content = "Blob Data";
            var blob = new Blob([content]);
            var link = document.getElementsByTagName("a")[0];
            link.download = "file";
            link.href = URL.createObjectURL(blob);
        }
        window.onload = createDownloadFile;
    </script>
</head>

<body>
    <a>下载</a>
</body>

</html>
```

点击下载按钮，浏览器将会下载一个名为file的文件，文件的内容是：Blob Data。通过Blob对象，我们在前端代码中就可以动态生成文件，提供给浏览器下载。打开Chrome浏览器调试窗口，在Elements标签下可以看到生成的Blob URL为：

![mark](https://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/5bE1bG760D.jpg)

- 图片资源地址

为图片文件创建一个Blob URL，赋值给<img>标签：

```javascript
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Blob Test</title>
    <script>
        function handleFile(e) {
            var file = e.files[0];
            var blob = URL.createObjectURL(file);
            var img = document.getElementsByTagName("img")[0];
            img.src = blob;
            img.onload = function(e) {
                URL.revokeObjectURL(this.src);  // 释放createObjectURL创建的对象##
            }
        }
    </script>
</head>

<body>
    <input type="file" accept="image/*" onchange="handleFile(this)" />
    <br/>
    <img style="width:200px;height:200px">
</body>

</html>
```

input中选择的图片会在<img>里显示出来，如图所示：

![mark](https://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/Cm2EDdd201.jpg)

同时，可以在Network标签栏，发现这个Blob URL的请求信息：

![mark](https://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/eE7LldFHA9.jpg)

这个请求信息和平时我们使用的Http URL获取图片几乎完全一样。我们还可以使用Data URL加载图片资源：

```javascript
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Blob Test</title>
    <script>
        function handleFile(e) {
            var file = e.files[0];
            var fileReader = new FileReader();
            var img = document.getElementsByTagName("img")[0];
            fileReader.onload = function(e) {
                img.src = e.target.result;
            }
            fileReader.readAsDataURL(file);
        }
    </script>
</head>

<body>
    <input type="file" accept="image/*" onchange="handleFile(this)" />
    <br/>
    <img style="width:200px;height:200px">
</body>

</html>
```

FileReader的`readAsDataURL`生成一个Data URL，如图所示：

![mark](https://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/B819BkEh5E.jpg)

Data URL对大家来说应该并不陌生，Web性能优化中有一项措施：把小图片用base64编码直接嵌入到HTML文件中，实际上就是利用了Data URL来获取嵌入的图片数据。

那么Blob URL和Data URL有什么区别呢？

1. Blob URL的长度一般比较短，但Data URL因为直接存储图片base64编码后的数据，往往很长，如上图所示，浏览器在显示Data URL时使用了省略号（…）。当显式大图片时，使用Blob URL能获取更好的可读性。
2. Blob URL可以方便的使用XMLHttpRequest获取源数据，例如：

```javascript
var blobUrl = URL.createObjectURL(new Blob(['Test'], {type: 'text/plain'}));
var x = new XMLHttpRequest();
// 如果设置x.responseType = 'blob'，将返回一个Blob对象，而不是文本:
// x.responseType = 'blob';
x.onload = function() {
    alert(x.responseText);   // 输出 Test
};
x.open('get', blobUrl);
x.send();
```

对于Data URL，并不是所有浏览器都支持通过XMLHttpRequest获取源数据的。

3.**Blob URL 只能在当前应用内部使用**，把Blob URL复制到浏览器的地址栏中，是无法获取数据的。Data URL相比之下，就有很好的移植性，你可以在任意浏览器中使用。

除了可以用作图片资源的网络地址，Blob URL也可以用作其他资源的网络地址，例如html文件、json文件等，为了保证浏览器能正确的解析Blob URL返回的文件类型，需要在创建Blob对象时指定相应的type：   

```javascript
// 创建HTML文件的Blob URL
var data = "<div style='color:red;'>This is a blob</div>";
var blob = new Blob([data], { type: 'text/html' });
var blobURL = URL.createObjectURL(blob);

// 创建JSON文件的Blob URL
var data = { "name": "abc" };
var blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
var blobURL = URL.createObjectURL(blob);
```