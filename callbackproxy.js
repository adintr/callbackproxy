!function(){
	var create_key = function(target, key) {
		if(!(key in target)) {
			target[key] = {
				funcs: [],
				argus: [],
				thats: [],
				refcount: 0,
			};
		}

		return target[key];
	};

	var callback_comming = function(obj, that, args) {
		var cbindex = obj.argus.length;
		if(obj.funcs.length > cbindex) {
			obj.argus.push(null);
			obj.thats.push(null);
			obj.funcs[cbindex].apply(that, args);
			obj.funcs[cbindex] = null;
		} else if(typeof(obj.everyfunc) == "function") {
			obj.everyfunc.apply(that, args);
		} else if(typeof(obj.oneoffunc) == "function") {
			obj.oneoffunc.apply(that, args);
			obj.oneoffunc = function(){};
		} else if(typeof(obj.allfunc) == "function" 
			&& cbindex >= obj.refcount - 1 
			&& cbindex >= obj.allcount - 1) {
			obj.allfunc.apply(that, args);
			obj.argus = [];
			obj.thats = [];
		} else {
			obj.argus.push(args);
			obj.thats.push(that);
		}
	};

	var callback_setfunc = function(obj, func) {
		var funindex = obj.funcs.length;
		if(obj.argus.length > funindex) {
			obj.funcs.push(null);
			func.apply(obj.thats[funindex], obj.argus[funindex]);
			obj.argus[funindex] = null;
			obj.thats[funindex] = null;
		} else {
			obj.funcs.push(func);
		}
	};

	var callback_setting = function(obj, value) {
		if(typeof(value) == "function") {
			callback_setfunc(obj, value);
		} else if(typeof(value) == "object") {
			for(var key in value) {
				callback_setfunc(obj, value[key]);
			}
		}
	};

	var callback_setevery = function(obj, func) {
		for(var i in obj.argus) {
			func.apply(obj.thats[i], obj.argus[i]);
			obj.argus[i] = null;
			obj.thats[i] = null;
		}

		obj.everyfunc = func;
	};

	var callback_setall = function(obj, a1, a2) {
		if(typeof(a1) == "function")
		{
			a2 = a1;
			a1 = obj.refcount;
		}

		if(a1 <= 0)
		{
			a1 == 1;
		}

		if(obj.argus.length >= a1) {
			a2.apply(obj.thats[0], obj.argus[0]);
			obj.argus = [];
			obj.thats = [];
			return;
		}

		obj.allfunc = a2;
		obj.allcount = a1;
	};

	var callback_setoneof = function(obj, func) {
		if(obj.argus.length > 0) {
			func.apply(obj.thats[0], obj.argus[0]);
			obj.argus = [];
			obj.thats = [];
			return;
		}

		obj.oneoffunc = func;
	};

	var operator_proxy = function(target, key) {
		if(key == "") {
			return function(){
				var args = arguments;
				for(var i in args) {
					var obj = create_key(target, args[i]);
					obj.refcount++;	
				}

				return function(){					
					for(var i in args) {
						var obj = create_key(target, args[i]);
						callback_comming(obj, this, arguments);	
					}
				}
			};
		}

		var obj = create_key(target, key);
		return {
			push: (func) => callback_setfunc(obj, func),
			every: (func) => callback_setevery(obj, func),
			all: (a1, a2)=> callback_setall(obj, a1, a2),
			oneof: (func)=> callback_setoneof(obj, func),
		};
	};

	function CallBackProxyConstruct() {
		return new Proxy({}, {
			get: (target, key) => {
				if(key[0] == '_') {
					key = key.substr(1);
					return operator_proxy(target, key);
				}
				
				var obj = create_key(target, key);	
				obj.refcount++;	
				return function() {
					callback_comming(obj, this, arguments);			
				};
			},

			set: (target, key, value) => {
				var obj = create_key(target, key);
				callback_setting(obj, value);
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