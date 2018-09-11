var proxy = require("./callbackproxy.js")();

proxy.next();

setTimeout(proxy.next, 1000);

proxy._next.every(function(){
	console.log("-");
});

setTimeout(proxy.next, 2000);
setTimeout(proxy.next, 3000);

// For every
proxy._another.every(function(){
	console.log("+");
	setTimeout(proxy.another, 1000);
});

proxy.another();