var cb = require("./callbackproxy.js");

var proxy = cb();

// 测试常规用法
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

// 测试回调函数定义在回调发生之后

proxy.hello([1, 2, 3]);
setTimeout(function(){
	proxy.hello = function(arg) {
		console.log(arg);
	}	
}, 500);
