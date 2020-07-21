## ajax原理和封装

Ajax全称为 Asynchronous JavaScript and XML （异步JavaScript和XML） ，使用Ajax可以无需刷新页面即可从服务器获取到数据，带来更好的用户体验。Ajax技术的核心是XMLHttpRequest对象，虽然名字中含有XML，但Ajax通信与数据格式无关，从服务器获取的数据可以是XML格式，也可以是JSON格式。目前来说，我们一般使用JSON格式的数据。

### 表单的基本知识

在介绍XMLHttpRequest对象之前，我们先来了解一下表单基本知识，在Ajax出现之前，网页通常使用表单提交数据，但是这种方式在提交数据时会刷新页面，用户体验不太好。

```
表单的数据提交有两种方式：get、post，这两种方式在提交数据时有一点区别

action : 	  数据提交的地址，默认是当前页面

method :  数据提交的方式，默认是get方式
      	get： 数据以查询字符串的方式传递到服务器（username=gongyz&age=a123）
        post：数据放在请求体中传递到服务器

enctype : 提交的数据的编码格式，默认是application/x-www-form-urlencoded

	application/x-www-form-urlencoded

	multipart/form-data 

	text/plain 
```

**get方式**

```html
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>无标题文档</title>
</head>
<body>
  <form action="get.php" enctype="application/x-www-form-urlencoded">
    <input type="text" name="username" />
    <input type="text" name="age" />
    <input type="submit" value="提交" />
  </form>
</body>
</html>
```

```php
<?php
header('content-type:text/html;charset="utf-8"');
error_reporting(0);

$username = $_GET['username'];
$age = $_GET['age'];

echo "你的名字：{$username}，年龄：{$age}";
```

**post方式**

```html
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>无标题文档</title>
</head>

<body>
  <form action="post.php" method="post">
    <input type="text" name="username" />
    <input type="text" name="age" />
    <input type="submit" value="提交" />
  </form>
</body>
</html>
```

```php
<?php
header('content-type:text/html;charset="utf-8"');
error_reporting(0);

$username = $_POST['username'];
$age = $_POST['age'];

echo "你的名字：{$username}，年龄：{$age}";
```

### XMLHttpRequest对象

下面的代码是简单的的XMLHttpRequest对象的使用方法，try/catch是用来兼容IE6和以前的版本。在XMLHttpRequest 2级中，该对象有了一些新的特性，而且现在开发人员也不会去兼容IE6和它之前的版本了，取而代之的是一些Ajax库，比较常用的像Jquery的ajax方法、axios等。

```javascript
var xhr = null;

try {
	xhr = new XMLHttpRequest();
} catch (e) {
	xhr = new ActiveXObject('Microsoft.XMLHTTP');
}

xhr.onreadystatechange = function() {
	if ( xhr.readyState == 4 ) {
		if ( xhr.status == 200 ) {
			console.log(xhr.responseText)
		} else {
			console.log('Error：', xhr.status, xhr.statusText);
		}
	}
}

xhr.open('get','getList.php',true);
xhr.send(null);
```

```php
<?php
header('content-type:text/html;charset="utf-8"');
error_reporting(0);
$arr1 = array(1, 2, 3);
echo json_encode($arr1);
```

下面会对XMLHttpRequest属性和一些新特性做一些说明，虽然不用原生的XMLHttpRequest进行开发，但了解这些东西对我们还是有帮助的。

#### XHR用法

*open方法*

在使用XHR对象时，要调用的第一个方法是open方法，该方法接受三个参数

​	请求类型： get/post

​	请求URL

​	是否异步发送请求（一般默认为true，不会去阻塞下面代码的执行）

**注意：调用open方法并不会发送请求，而是启动一个请求以备发送**

send*方法*

send方法接收一个参数，即要作为请求主体发送的数据，调用send方法后，请求就会发送到服务器，在收到响应后，相应的数据会自动填充XHR对象的属性



*responseText：作为响应主体被返回的文本*

*responseXML：如果响应的内容是XML数据，这个属性中将会保存包含响应数据的XML DOM文档，否则为null*

*status：http状态码*

*statusText：http状态说明*



*readyState：*

该属性标识请求/响应响应过程当前所处的状态，该属性有5个取值，该值改变时会触发onreadystatechange事件

​	0： 未初始化化。尚未调用open方法。

​	1： 启动。已经调用open方法，但尚未调用send方法

​	2： 发送。已经调用send方法，但尚未接收到响应

​	3： 接收。已经接收的部分数据

​	4：完成。已经接收到全部响应数据，并且可以在客户端使用

对于同步请求，可以等到请求完成在进行其他操作，但通常情况，我们使用的是异步请求，所以需要在onreadystatechange事件中监测每次状态变化后readyState值。所以我们只对readyState值为4的情况感兴趣。

注意：为了保证浏览器兼容性，应该在调用open方法之前指定onreadystatechange事件的处理函数（目前没碰上过这种兼容性问题，但是建议这样处理，可能该问题在低版本浏览器会出现）



*abort方法*

调用该方法后，XHR对象会停止触发事件，而且也不允许再访问任何与响应有关的对象属性。在终止操作后，还应该对XHR对象进行解引用操作。由于内存原因，不建议重用XHR对象。

#### get、post区别和处理

使用XHR对象发送get请求

```javascript
var xhr = null;
try {
	xhr = new XMLHttpRequest();
} catch (e) {
	xhr = new ActiveXObject('Microsoft.XMLHTTP');
}
		
xhr.onreadystatechange = function() {
	if ( xhr.readyState == 4 ) {
		if ( xhr.status == 200 ) {
			console.log( xhr.responseText );
		} else {
			console.log('Error：', xhr.status, xhr.statusText);
		}
	}
}
		
/*
	存在的问题
	1.缓存 在url？后面连接一个随机数，时间戳
	2.乱码 编码encodeURI
*/
xhr.open('get','test.php?username='+encodeURI('刘伟')+'&age=30&' + new Date().getTime(),true);
xhr.send();
```

使用XHR对象发送post请求

```javascript
var xhr = null;
try {
	xhr = new XMLHttpRequest();
} catch (e) {
	xhr = new ActiveXObject('Microsoft.XMLHTTP');
}

xhr.onreadystatechange = function() {
	if ( xhr.readyState == 4 ) {
		if ( xhr.status == 200 ) {
			console.log( xhr.responseText );
		} else {
			console.log('Error：', xhr.status, xhr.statusText);
		}
	}
}
		
// post方式，数据放在send()里面作为参数传递
xhr.open('post','test.php',true); 
		
// 申明发送的数据类型
xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');

// post没有缓存问题,无需编码
xhr.send('username=刘伟&age=30');
```

#### XHR新特性

**FormData**

FormData对象用来创建于与表单格式相同的数据（用于通过XHR传输），使用了FormData之后，不需要设置请求头的content-type，XHR能够识别传入的数据类型是FormData实例，并配置适当的头部信息。

```javascript
var xhr = null;
try {
	xhr = new XMLHttpRequest();
} catch (e) {
	xhr = new ActiveXObject('Microsoft.XMLHTTP');
}

xhr.onreadystatechange = function() {
	if ( xhr.readyState == 4 ) {
		if ( xhr.status == 200 ) {
			console.log( xhr.responseText );
		} else {
			console.log('Error：', xhr.status, xhr.statusText);
		}
	}
}

// post方式，数据放在send()里面作为参数传递
xhr.open('post','test.php',true); 

let data = new FormData()
data.append('username', 'gongyz')
data.append('age', '123')

xhr.send(data);
```

**load事件：**在接收到完整的响应数据时触发，可以替换上面的onreadystatechange事件

**progress事件：**可以用来制作精度条

​	lengthComputable：表示进度信息是否可用

​	loaded：已经上传的字节数

​	total：总字节数

下面是一个Ajax上传文件的例子，我们通过这个例子来学习load和progress事件

```html
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>无标题文档</title>
<style>
#div1 {width: 300px; height: 30px; border: 1px solid #000; position: relative;}
#div2 {width: 0; height: 30px; background: #CCC;}
#div3 {width: 300px; height: 30px; line-height: 30px; text-align: center; position: absolute; left: 0; top: 0;}
</style>
<script>
window.onload = function() {
	
	var oBtn = document.getElementById('btn');
	var oMyFile = document.getElementById('myFile');
	var oDiv1 = document.getElementById('div1');
	var oDiv2 = document.getElementById('div2');
	var oDiv3 = document.getElementById('div3');
	
	oBtn.onclick = function() {
		var xhr = new XMLHttpRequest();
    
		xhr.onload = function() {
			console.log('OK,上传完成');
		}
		
		xhr.upload.onprogress = function(ev) {
			if (lengthComputable) {
				var iScale = ev.loaded / ev.total;
				oDiv2.style.width = 300 * iScale + 'px';
				oDiv3.innerHTML = iScale * 100 + '%';
			}
		}

		xhr.open('post', 'post_file.php', true);
		xhr.setRequestHeader('X-Request-With', 'XMLHttpRequest');
		
		var oFormData = new FormData();
		oFormData.append('file', oMyFile.files[0]);
		xhr.send(oFormData);
	}
}
</script>
</head>

<body>
	<input type="file" id="myFile" /><input type="button" id="btn" value="上传" />

	<div id="div1">
		<div id="div2"></div>
		<div id="div3">0%</div>
	</div>
</body>
</html>

```

**注意，progress事件不是定义在xhr，而是定义在xhr.upload，因为这里需要区分下载和上传，下载也有一个progress事件**

#### 小结

Ajax的基本知识基本上都在上面，新增的特性还有一些，感兴趣的可以去看JavaScript高级程序设计（目前是第三版）。补充一句，关于Ajax文件上传可以去看看大家可以去看看我之前的文章**从 HTML5 拖放事件 探究文件上传功能**和**Blob API的使用**，另外阮一峰老师也有一篇博客[文件上传的渐进式增强](http://www.ruanyifeng.com/blog/2012/08/file_upload.html)，也推荐大家看一看。

## ajax跨域解决方案

### JSONP

在XMLHttpRequest 2 级之前，JSONP是最常用的跨域解决方案，JSONP由两部分组成，回调函数和数据。回调函数是当响应来到是应该在页面中调用的函数。回调函数的名字一般是在请求中指定的。而数据就是传入回调函数中的JSON数据。

下面是一个JSONP的示例：

```html
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>无标题文档</title>
<style>
#q {width: 300px; height: 30px; padding: 5px; border:1px solid #f90; font-size: 16px;}
#ul1 {border:1px solid #f90; width: 310px; margin: 0;padding: 0; display: none;}
li a { line-height: 30px; padding: 5px; text-decoration: none; color: black; display: block;}
li a:hover{ background: #f90; color: white; }
</style>
<script>
function handleResponse (data) {
	
	var oUl = document.getElementById('ul1');
	var html = '';
	if (data.s.length) {
		oUl.style.display = 'block';
		for (var i=0; i<data.s.length; i++) {
			html += '<li><a target="_blank" href="http://www.baidu.com/s?wd='+data.s[i]+'">'+ data.s[i] +'</a></li>';
		}
		oUl.innerHTML = html;
	} else {
		oUl.style.display = 'none';
	}
	
}
window.onload = function() {
	var oQ = document.getElementById('q');
	var oUl = document.getElementById('ul1');
  
	oQ.onkeyup = function() {
		if ( this.value != '' ) {
			var oScript = document.createElement('script');
			oScript.src = 'http://suggestion.baidu.com/su?wd='+this.value+'&cb=handleResponse';
			document.body.appendChild(oScript);
		} else {
			oUl.style.display = 'none';
		}
	}
}
</script>
</head>

<body>
	<input type="text" id="q" />
	<ul id="ul1"></ul>
</body>
</html>
```

### CORS

跨域资源共享是XMLHttpRequest 2级加入了W3C的规范中，目前大部分主流浏览器都支持，CORS的基本思想就是使用HTTP头部让浏览器和服务器进行沟通，从而决定跨域请求时成功还是失败。

当发送一个HTTP请求时，浏览器检测到这是一个跨域请求，会给该请求添加一个额外的Origin头部，其中包含请求页面的源信息（协议、域名和端口），以便服务器根据这个头部信息来决定是否给与响应。下面是一个Origin头部的示例：

```http
Origin: http://www.nczoline.net
```

如果服务器认为这个请求可以接受，就在Access-Control-Allow-Origin头部中回发出相同的原信息（如果是公共资源，可以回发'*'）。例如：

```http
Access-Control-Allow-Origin: http://www.nczoline.net
```

如果没有这个头部，或者有这个头部但是源信息不匹配，浏览器就会驳回请求。正常情况下浏览器会处理请求。

**注意：对于跨域请求，cookie不会再客户端和服务端之间传递（安全原因）**

代码实例

```html
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>无标题文档</title>
<script>
window.onload = function() {
	/*
		实现跨域请求，还需要后端的相关配合才可以
	
		XDomainRequest： XDomainRequest是在IE8和IE9上的 CORS 的实现，在IE10中被包含CORS的 XMLHttpRequest 取代了
	*/
	var oBtn = document.getElementById('btn');
	
	oBtn.onclick = function() {
		
		var xhr = new XMLHttpRequest();
		xhr.onload = function() {
			console.log(xhr.responseText)
		}
		xhr.open('get', 'http://www.b.com/ajax.php', true);
		xhr.send();
		
		// var xdr= new XDomainRequest();
		// xdr.onload = function() {
		// 	console.log(this.responseText);
		// }
		// xdr.open('get', 'http://www.b.com/ajax.php', true);
		// xdr.send();
	}
}
</script>
</head>

<body>
	<input type="button" value="跨域请求" id="btn" />
</body>
</html>
```

```php
<?php
header('Access-Control-Allow-Origin: http://www.a.com');
echo 'hello';
```

