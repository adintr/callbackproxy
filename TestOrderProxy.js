var proxy = require("./callbackproxy.js")();

// 按顺序执行的回调
setTimeout(proxy.next, 1000);

for(var i = 0; i < 10; ++i) {
	proxy._next.push(function(){
		console.log('*');
		setTimeout(proxy.next, 1000);
	})
}

/*
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
*/