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