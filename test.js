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


/*
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
*/