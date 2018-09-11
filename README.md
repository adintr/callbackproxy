# callbackproxy
简化 Javascript 中回调函数的使用 
#### 1. 用一个名称来标识一个回调, 回调函数的定义可以在使用回调之前, 也可以在使用回调之后, 还可以在回调发生之后.
对于如下的回调代码:  
```
setTimeout(function(){
	console.log(1);
	setTimeout(function(){
		console.log(2);
		setTimeout(function(){
			console.log(3);			
			setTimeout(function(){
				console.log(4);				
			}, 4000);
		}, 3000)
	}, 2000);
}, 1000);
```
使用 callproxy 辅助后可以写成这种方式:
```
var cb = require("./callbackproxy.js");

var proxy = cb();

setTimeout(proxy.first, 1000);

proxy.first = function() {
	console.log(1);
	setTimeout(proxy.second, 2000);
}

proxy.second = function() {
	console.log(2);
	setTimeout(proxy.third, 3000);
}

proxy.third = function() {
	console.log(3);
	setTimeout(proxy.forth, 4000);
}

proxy.forth = function() {
	console.log(4);
}
```
