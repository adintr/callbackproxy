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

#### 2. 对于按顺序执行的回调也可以简化成这样:
```
var proxy = require("./callbackproxy.js")();
setTimeout(proxy.next, 1000);

proxy.next = [
	()=>{
		console.log(1);
		setTimeout(proxy.next, 1000);
	},

	()=>{
		console.log(2);
		setTimeout(proxy.next, 1000);
	},

	()=>{
		console.log(3);
		setTimeout(proxy.next, 1000);
	},

	()=>{
		console.log(4);
	},
];
```
#### 3. 用带 _ 的属性会返回一个包含了方法的代理对象, 支持的方法包括 push, every, all, oneof. 其中 push 允许一步一步的添加方法, 而不用设置整个数组, 上面的回调也可以写成:
```
var proxy = require("./callbackproxy.js")();

setTimeout(proxy.next, 1000);

for(var i = 0; i < 10; ++i) {
	proxy._next.push(function(){
		console.log('*');
		setTimeout(proxy.next, 1000);
	})
}
```

#### 4. 如果回调使用相同的函数处理, 则可以使用 every 方法:
```
proxy._another.every(function(){
	console.log("+");
	setTimeout(proxy.another, 1000);
});

proxy.another();
```

#### 5. 用 all 设置的函数会等待回调指定的次数后才执行, 使用 oneof 设置的函数会在第一个回调发生的时候执行. 使用 _ 函数可以同时触发多个回调函数:
```
var proxy = require("./callbackproxy.js")();

setTimeout(proxy._('next', 'another'), 1000);
setTimeout(proxy._('next', 'another'), 2000);
setTimeout(proxy._('next', 'another'), 3000);
setTimeout(proxy._('next', 'another'), 4000);
setTimeout(proxy._('next', 'another'), 5000);

proxy._next.all(function(){
	console.log("All Done.");
});

proxy._another.oneof(function(){
	console.log("One Done.");
});
```

