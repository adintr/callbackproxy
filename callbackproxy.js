!function(){
	function CallBackProxyConstruct() {
		return new Proxy({}, {
			get: (target, key) => {
				if(!(key in target)) {
					target[key] = {};
				}
	
				return function() {
					var obj = target[key];
					if(typeof(obj.realfunc) != "undefined") {
						obj.realfunc.apply(this, arguments);
					} else {
						obj.arguments = arguments;
						obj.that = this;
					}
				};
			},

			set: (target, key, value) => {
				if(!(key in target)) {
					target[key] = {};
				}

				var obj = target[key];
				if(typeof(obj.arguments) != "undefined") {
					value.apply(obj.that, obj.arguments);
				} else {
					obj.realfunc = value;
				}

				return target;
			}
		});
	}

	if(typeof(module) != "undefined") {
		module.exports = CallBackProxyConstruct;
	}
	else if(typeof(window) != "undefined") {
		window.CallbackProxy = CallBackProxyConstruct;
	}
}();