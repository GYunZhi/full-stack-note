---
title: 从HTML5拖放事件探究文件上传功能
copyright: true
date: 2018-07-14 22:16:56
tags: JavaScript
categories: JavaScript
---

### 拖放事件

HTML5为所有的HTML元素新增了一个`draggable`属性，表示元素是否允许拖动。默认情况下，图像、链接和文本是可以拖动的，文本只有在被选中的情况下才能拖动。 **需要注意的是在ff下只加`draggable="true"`还不能实现拖放，需要做一些处理，大多数浏览器会为正被拖动的元素创建一个半透明的副本，这个副本始终跟着光标移**动。

元素拖放时会触发一系列的拖放事件

```html
（1）拖放元素事件：事件对象为被拖放的元素

    ondragstart  拖放开始触发
    ondragend    拖放结束触发
	  ondrag       拖放期间触发，连续触发(无论拖放元素放在有效目标还是无效目标，都会触发)

（2）目标元素事件：事件对象为目标元素

     ondragenter  拖放元素进入目标元素触发
     ondragleave  拖放元素离开目标元素触发
     ondragover   拖放元素进入目标元素和离开目标元素之间触发，连续触发
     ondrop       在目标元素上释放鼠标时触发，要想触发drop事件就必须在dragover当中阻止默认事件

（3）事件执行顺序：

  drop不触发的时候
  dragstart > drag > dragenter > dragover > dragleave > dragend

	drop触发的时候 在dragover中阻止默认事件
	dragstart > drag > dragenter > dragover > drop > dragend

```

示例代码：

```html
<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<title>拖放事件</title>
	<style type="text/css">
		ul li {
			width: 100px;
			height: 40px;
			background: #ff0;
			margin-bottom: 8px;
			list-style: none;
		}

		div {
			width: 200px;
			height: 200px;
			background: #f00;
			margin: 100px 0 0 100px;
		}
	</style>
</head>
<script>
	window.onload = function () {
		var oUl = document.getElementById('ul1');
		var oDiv = document.getElementById('div1');
		var oLi = oUl.getElementsByTagName('li')[0];
		var i = 0;

		// 拖放元素事件
		oLi.ondragstart = function () {
			this.style.background = 'blue';
		}

		oLi.ondragend = function () {
			this.style.background = 'yellow';
		}

		oLi.ondrag=function (){
			//连续触发
			document.title=i++;
		}

		// 目标元素事件,通过重写dragenter和dragleave方法来自定义目标元素背景颜色
		oDiv.ondragenter=function (){
			this.style.background='green';
		}

		oDiv.ondragleave=function (){
			this.style.background='red';
		}

		// 要想触发drop事件就必须在dragover当中阻止默认事件
		oDiv.ondragover = function () {
			console.log(i);
			return false;
		}
		
		// 在目标元素上释放鼠标时触发
		oDiv.ondrop = function () {
			this.style.background = '#000';
		}
	};
</script>

<body>
	<ul id="ul1">
		<li draggable="true">拖放元素</li>
	</ul>

	<div id="div1">目标元素</div>
</body>
</html>
```

### 解决ff下不能拖放的问题 

要解决ff下不能拖放的问题，必须在`ondragstart`事件中设置`dataTransfer`对象的`setData`方法，`dataTransfer`对象是event对象下的一个属性，需要通过event对象访问 ，下文会详细说明`dataTransfer`对象。

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>ff下不能拖放的问题</title>
	<style type="text/css">
		ul li{width: 100px;height: 40px;background: #ff0;margin-bottom:8px;list-style: none; }
		div{width: 100px;height: 100px;background: #f00;margin:300px 0 0 300px;}
	</style>
</head>
<script>

window.onload=function (){
	var oUl=document.getElementById('ul1');
	var oDiv=document.getElementById('div1');
	var aLi=oUl.getElementsByTagName('li');
	
	// 拖放元素事件
	for (var i = 0; i < aLi.length; i++) {
		aLi[i].ondragstart=function (ev){
			ev.dataTransfer.setData('name','gongyz');
		}
	}

	// 目标元素事件
	oDiv.ondragover=function (){
		return false; // 要想触发ondrop事件，必须在onondragover中阻止默认事件
	}

	oDiv.ondrop=function (ev){
		console.log(ev.dataTransfer.getData('name'))
	}
}
</script>
<body>
	<ul id="ul1">
		<li draggable="true">a</li>
		<li draggable="true">b</li>
		<li draggable="true">c</li>
	</ul>

	<div id="div1"></div>
</body>
</html>
```

### DataTransfer 对象

#### 概述

`DataTransfer` 对象用来保存，通过拖放动作，拖动到浏览器的数据。它可以保存一项或多项数据、一种或者多种数据类型。

这个对象在所有的拖放事件属性`dataTransfer`中都是可用的，但是不能单独创建，也就是说，在进行拖放操作的时候，会自动创建一个`dataTransfer`对象，这个对象作为拖放事件的事件对象的一个属性，保存了当前拖放操作的数据。

**方法**

`setData(key,value)` ：设置拖放时要传递的数据（拖放元素）

`getData(key)`：获取拖放时传递的数据（目标元素）

`setDragImage(DOMElement image,x,y)` ：使用自定义的图片作为拖放时副本 (该方法接收三个参数  指定的元素，坐标X，坐标Y)

**属性**

`files`：用来获取外部拖放进来的文件，返回一个类数组的`FileList`对象 

#### 拖放删除元素

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>拖放删除元素</title>
	<style type="text/css">
		ul li{width: 100px;height: 30px;margin:8px;background: #ff0;}
		div{width: 200px;height: 200px;margin:100px 0 0 100px;background: #f00;}
	</style>
</head>
<script>
window.onload=function (){
	var oUl=document.getElementsByTagName('ul')[0];
	var oDiv=document.getElementsByTagName('div')[0];
	var aLi=oUl.getElementsByTagName('li');

	for (var i = 0; i < aLi.length; i++) {
		aLi[i].index=i;
		aLi[i].ondragstart=function (ev){
			ev.dataTransfer.setData('data',this.index);
		}
	}

	oDiv.ondragover=function (){
		return false;//要想触发ondrop事件，必须在onondragover中阻止默认事件
	}

	oDiv.ondrop=function (ev){
	  // 拿到索引值后删除对应的元素
		var _index=ev.dataTransfer.getData('data');
		oUl.removeChild(aLi[_index]);
		for (var i = 0; i < aLi.length; i++) {
			aLi[i].index = i;
		}
	}
}

</script>
<body>
	<ul>
		<li draggable="true">a</li>
		<li draggable="true">b</li>
		<li draggable="true">c</li>
		<li draggable="true">d</li>
	</ul>
	<div></div>
</body>
</html>
```

#### 自定义拖放副本

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>dataTransfer对象详解</title>
	<style type="text/css">
		ul li{width: 100px;height: 40px;background: #ff0;margin-bottom:8px;list-style: none; }
		div{width: 100px;height: 100px;background: #f00;margin:300px 0 0 300px;}
	</style>
</head>
<script>
window.onload=function (){
	/*
		setDragImage方法  使用自定义的图片作为拖放时副本
		该方法接收三个参数  指定的元素，坐标X，坐标Y
	*/
	var oUl=document.getElementById('ul1');
	var oDiv=document.getElementById('div1');
	var aLi=oUl.getElementsByTagName('li');
	var oImg=document.getElementsByTagName('img')[0];
	
	// 拖放元素事件
	for (var i = 0; i < aLi.length; i++) {
		aLi[i].index=i;
		aLi[i].ondragstart=function (ev){
			var ev=ev||event;
			this.style.background='blue';
			ev.dataTransfer.setData('name','leo');
			ev.dataTransfer.setDragImage(oImg,0,0)	
		}
	}

	//目标元素
	oDiv.ondragover=function (){
		return false; // 要想触发drop事件就必须在dragover当中阻止默认事件
	}

	oDiv.ondrop=function (){
		console.log(123)
	}
};
</script>
<body>
	<ul id="ul1">
		<li draggable="true">a</li>
		<li draggable="true">b</li>
		<li draggable="true">c</li>
	</ul>

	<div id="div1"></div>

	<img src="xxx.png">
</body>
</html>
```

### File和FileReader对象

File是一个是特殊类型的Blob对象，保存了和文件有关的信息。File 对象可以是来自用户在一个`<input>`元素上选择文件后返回的`FileList`对象,也可以是来自由拖放操作生成的`DataTransfer`对象中的`files`属性，这个属性就是一个类数组的`FileList`对象。

FileReader 用来读取通过`dataTransfer`对象的`files`属性获取的外部文件 ，将文件读取为Data URL格式,读取的结果保存在result属性中，如果是图片，返回base64格式的图片数据 。

结合之前的拖放操作和DataTransfer对象，我们就可以实现**拖放上传文件功能**，下面的代码示例介绍了FileReader接口的使用方法：

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>图片预览功能</title>
	<style type="text/css">
		div{width: 300px;height: 300px;background: #f00;margin:100px 0 0 200px;}
	</style>
</head>
<script>

window.onload=function (){
	/*
		fileReader对象  用来读取通过dataTransfer对象的files属性获取的文件
		
		var fd = new FileReader();
		
		readAsDataURL()方法   参数为要读取的文件对象，将文件读取为DataURL格式
		
		onload事件  			当读取文件完成的时候触发此事件
		
		fd.result            取读取的文件数据，如果是图片，返回base64格式的图片数据
	*/
	var oDiv=document.getElementById('div1');

	var oUl=document.getElementsByTagName('ul')[0];

	//目标元素
	oDiv.ondragover=function (){
		return false;// 要想触发drop事件就必须在dragover当中阻止默认事件
	}

	oDiv.ondrop=function (ev){
		var ev=ev||event;
		var fs=ev.dataTransfer.files;
		for (var i = 0; i < fs.length; i++) {
			if (fs[i].type.indexOf('image') !== -1) {
				var fd=new FileReader();
				fd.readAsDataURL(fs[i]);
				fd.onload=function (){
					var oLi=document.createElement('li');
					oLi.innerHTML='<img src="'+this.result+'">';
					oUl.appendChild(oLi);		
				}
			}else{
				alert('请上传图片类型！！！');
			}				
		}
		return false;
	}
};
</script>
<body>
	<div id="div1">请把文件拖放在此处</div>
	<ul></ul>
</body>
</html>
```
