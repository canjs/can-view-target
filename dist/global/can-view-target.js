/*[global-shim-start]*/
(function(exports, global, doEval){ // jshint ignore:line
	var origDefine = global.define;

	var get = function(name){
		var parts = name.split("."),
			cur = global,
			i;
		for(i = 0 ; i < parts.length; i++){
			if(!cur) {
				break;
			}
			cur = cur[parts[i]];
		}
		return cur;
	};
	var set = function(name, val){
		var parts = name.split("."),
			cur = global,
			i, part, next;
		for(i = 0; i < parts.length - 1; i++) {
			part = parts[i];
			next = cur[part];
			if(!next) {
				next = cur[part] = {};
			}
			cur = next;
		}
		part = parts[parts.length - 1];
		cur[part] = val;
	};
	var modules = (global.define && global.define.modules) ||
		(global._define && global._define.modules) || {};
	var ourDefine = global.define = function(moduleName, deps, callback){
		var module;
		if(typeof deps === "function") {
			callback = deps;
			deps = [];
		}
		var args = [],
			i;
		for(i =0; i < deps.length; i++) {
			args.push( exports[deps[i]] ? get(exports[deps[i]]) : ( modules[deps[i]] || get(deps[i]) )  );
		}
		// CJS has no dependencies but 3 callback arguments
		if(!deps.length && callback.length) {
			module = { exports: {} };
			var require = function(name) {
				return exports[name] ? get(exports[name]) : modules[name];
			};
			args.push(require, module.exports, module);
		}
		// Babel uses the exports and module object.
		else if(!args[0] && deps[0] === "exports") {
			module = { exports: {} };
			args[0] = module.exports;
			if(deps[1] === "module") {
				args[1] = module;
			}
		} else if(!args[0] && deps[0] === "module") {
			args[0] = { id: moduleName };
		}

		global.define = origDefine;
		var result = callback ? callback.apply(null, args) : undefined;
		global.define = ourDefine;

		// Favor CJS module.exports over the return value
		result = module && module.exports ? module.exports : result;
		modules[moduleName] = result;

		// Set global exports
		var globalExport = exports[moduleName];
		if(globalExport && !get(globalExport)) {
			set(globalExport, result);
		}
	};
	global.define.orig = origDefine;
	global.define.modules = modules;
	global.define.amd = true;
	ourDefine("@loader", [], function(){
		// shim for @@global-helpers
		var noop = function(){};
		return {
			get: function(){
				return { prepareGlobal: noop, retrieveGlobal: noop };
			},
			global: global,
			__exec: function(__load){
				doEval(__load.source, global);
			}
		};
	});
}
)({"can-util/namespace":"can"},window,function(__$source__, __$global__) { // jshint ignore:line
	eval("(function() { " + __$source__ + " \n }).call(__$global__);");
}
)
/*can-util@3.0.1#dom/child-nodes/child-nodes*/
define('can-util/dom/child-nodes/child-nodes', function (require, exports, module) {
    function childNodes(node) {
        var childNodes = node.childNodes;
        if ('length' in childNodes) {
            return childNodes;
        } else {
            var cur = node.firstChild;
            var nodes = [];
            while (cur) {
                nodes.push(cur);
                cur = cur.nextSibling;
            }
            return nodes;
        }
    }
    module.exports = childNodes;
});
/*can-util@3.0.1#js/global/global*/
define('can-util/js/global/global', function (require, exports, module) {
    module.exports = function () {
        return typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope ? self : typeof process === 'object' && {}.toString.call(process) === '[object process]' ? global : window;
    };
});
/*can-util@3.0.1#js/set-immediate/set-immediate*/
define('can-util/js/set-immediate/set-immediate', function (require, exports, module) {
    var global = require('can-util/js/global/global')();
    module.exports = global.setImmediate || function (cb) {
        return setTimeout(cb, 0);
    };
});
/*can-util@3.0.1#dom/document/document*/
define('can-util/dom/document/document', function (require, exports, module) {
    var global = require('can-util/js/global/global');
    var setDocument;
    module.exports = function (setDoc) {
        if (setDoc) {
            setDocument = setDoc;
        }
        return setDocument || global().document;
    };
});
/*can-util@3.0.1#dom/is-of-global-document/is-of-global-document*/
define('can-util/dom/is-of-global-document/is-of-global-document', function (require, exports, module) {
    var getDocument = require('can-util/dom/document/document');
    module.exports = function (el) {
        return (el.ownerDocument || el) === getDocument();
    };
});
/*can-util@3.0.1#js/is-empty-object/is-empty-object*/
define('can-util/js/is-empty-object/is-empty-object', function (require, exports, module) {
    module.exports = function (obj) {
        for (var prop in obj) {
            return false;
        }
        return true;
    };
});
/*can-util@3.0.1#dom/data/data*/
define('can-util/dom/data/data', function (require, exports, module) {
    var isEmptyObject = require('can-util/js/is-empty-object/is-empty-object');
    var data = {};
    var expando = 'can' + new Date();
    var uuid = 0;
    var setData = function (name, value) {
        var id = this[expando] || (this[expando] = ++uuid), store = data[id] || (data[id] = {});
        if (name !== undefined) {
            store[name] = value;
        }
        return store;
    };
    module.exports = {
        getCid: function () {
            return this[expando];
        },
        cid: function () {
            return this[expando] || (this[expando] = ++uuid);
        },
        expando: expando,
        clean: function (prop) {
            var id = this[expando];
            if (data[id] && data[id][prop]) {
                delete data[id][prop];
            }
            if (isEmptyObject(data[id])) {
                delete data[id];
            }
        },
        get: function (key) {
            var id = this[expando], store = id && data[id];
            return key === undefined ? store || setData(this) : store && store[key];
        },
        set: setData
    };
});
/*can-util@3.0.1#dom/contains/contains*/
define('can-util/dom/contains/contains', function (require, exports, module) {
    module.exports = function (child) {
        return this.contains(child);
    };
});
/*can-util@3.0.1#js/assign/assign*/
define('can-util/js/assign/assign', function (require, exports, module) {
    module.exports = function (d, s) {
        for (var prop in s) {
            d[prop] = s[prop];
        }
        return d;
    };
});
/*can-util@3.0.1#dom/events/events*/
define('can-util/dom/events/events', function (require, exports, module) {
    var assign = require('can-util/js/assign/assign');
    var _document = require('can-util/dom/document/document');
    module.exports = {
        addEventListener: function () {
            this.addEventListener.apply(this, arguments);
        },
        removeEventListener: function () {
            this.removeEventListener.apply(this, arguments);
        },
        canAddEventListener: function () {
            return this.nodeName && (this.nodeType === 1 || this.nodeType === 9) || this === window;
        },
        dispatch: function (event, args, bubbles) {
            var doc = _document();
            var ev = doc.createEvent('HTMLEvents');
            var isString = typeof event === 'string';
            ev.initEvent(isString ? event : event.type, bubbles === undefined ? true : bubbles, false);
            if (!isString) {
                assign(ev, event);
            }
            ev.args = args;
            return this.dispatchEvent(ev);
        }
    };
});
/*can-util@3.0.1#dom/dispatch/dispatch*/
define('can-util/dom/dispatch/dispatch', function (require, exports, module) {
    var domEvents = require('can-util/dom/events/events');
    module.exports = function () {
        return domEvents.dispatch.apply(this, arguments);
    };
});
/*can-util@3.0.1#dom/mutation-observer/mutation-observer*/
define('can-util/dom/mutation-observer/mutation-observer', function (require, exports, module) {
    var global = require('can-util/js/global/global')();
    var setMutationObserver;
    module.exports = function (setMO) {
        if (setMO !== undefined) {
            setMutationObserver = setMO;
        }
        return setMutationObserver !== undefined ? setMutationObserver : global.MutationObserver || global.WebKitMutationObserver || global.MozMutationObserver;
    };
});
/*can-util@3.0.1#js/is-array-like/is-array-like*/
define('can-util/js/is-array-like/is-array-like', function (require, exports, module) {
    function isArrayLike(obj) {
        var type = typeof obj;
        if (type === 'string') {
            return true;
        }
        var length = obj && type !== 'boolean' && typeof obj !== 'number' && 'length' in obj && obj.length;
        return typeof arr !== 'function' && (length === 0 || typeof length === 'number' && length > 0 && length - 1 in obj);
    }
    module.exports = isArrayLike;
});
/*can-util@3.0.1#js/is-promise/is-promise*/
define('can-util/js/is-promise/is-promise', function (require, exports, module) {
    module.exports = function (obj) {
        return obj instanceof Promise || Object.prototype.toString.call(obj) === '[object Promise]';
    };
});
/*can-util@3.0.1#js/types/types*/
define('can-util/js/types/types', function (require, exports, module) {
    var isPromise = require('can-util/js/is-promise/is-promise');
    var types = {
        isMapLike: function () {
            return false;
        },
        isListLike: function () {
            return false;
        },
        isPromise: function (obj) {
            return isPromise(obj);
        },
        isConstructor: function (func) {
            if (typeof func !== 'function') {
                return false;
            }
            for (var prop in func.prototype) {
                return true;
            }
            return false;
        },
        isCallableForValue: function (obj) {
            return typeof obj === 'function' && !types.isConstructor(obj);
        },
        isCompute: function (obj) {
            return obj && obj.isComputed;
        },
        iterator: typeof Symbol === 'function' && Symbol.iterator || '@@iterator',
        DefaultMap: null,
        DefaultList: null,
        queueTask: function (task) {
            var args = task[2] || [];
            task[0].apply(task[1], args);
        },
        wrapElement: function (element) {
            return element;
        },
        unwrapElement: function (element) {
            return element;
        }
    };
    module.exports = types;
});
/*can-util@3.0.1#js/is-iterable/is-iterable*/
define('can-util/js/is-iterable/is-iterable', function (require, exports, module) {
    var types = require('can-util/js/types/types');
    module.exports = function (obj) {
        return obj && !!obj[types.iterator];
    };
});
/*can-util@3.0.1#js/each/each*/
define('can-util/js/each/each', function (require, exports, module) {
    var isArrayLike = require('can-util/js/is-array-like/is-array-like');
    var has = Object.prototype.hasOwnProperty;
    var isIterable = require('can-util/js/is-iterable/is-iterable');
    var types = require('can-util/js/types/types');
    function each(elements, callback, context) {
        var i = 0, key, len, item;
        if (elements) {
            if (isArrayLike(elements)) {
                for (len = elements.length; i < len; i++) {
                    item = elements[i];
                    if (callback.call(context || item, item, i, elements) === false) {
                        break;
                    }
                }
            } else if (isIterable(elements)) {
                var iter = elements[types.iterator]();
                var res, value;
                while (!(res = iter.next()).done) {
                    value = res.value;
                    callback.call(context || elements, Array.isArray(value) ? value[1] : value, value[0]);
                }
            } else if (typeof elements === 'object') {
                for (key in elements) {
                    if (has.call(elements, key) && callback.call(context || elements[key], elements[key], key, elements) === false) {
                        break;
                    }
                }
            }
        }
        return elements;
    }
    module.exports = each;
});
/*can-util@3.0.1#dom/events/attributes/attributes*/
define('can-util/dom/events/attributes/attributes', function (require, exports, module) {
    var events = require('can-util/dom/events/events');
    var isOfGlobalDocument = require('can-util/dom/is-of-global-document/is-of-global-document');
    var domData = require('can-util/dom/data/data');
    var getMutationObserver = require('can-util/dom/mutation-observer/mutation-observer');
    var assign = require('can-util/js/assign/assign');
    var domDispatch = require('can-util/dom/dispatch/dispatch');
    var originalAdd = events.addEventListener, originalRemove = events.removeEventListener;
    events.addEventListener = function (eventName) {
        if (eventName === 'attributes') {
            var MutationObserver = getMutationObserver();
            if (isOfGlobalDocument(this) && MutationObserver) {
                var self = this;
                var observer = new MutationObserver(function (mutations) {
                    mutations.forEach(function (mutation) {
                        var copy = assign({}, mutation);
                        domDispatch.call(self, copy, [], false);
                    });
                });
                observer.observe(this, {
                    attributes: true,
                    attributeOldValue: true
                });
                domData.set.call(this, 'canAttributesObserver', observer);
            } else {
                domData.set.call(this, 'canHasAttributesBindings', true);
            }
        }
        return originalAdd.apply(this, arguments);
    };
    events.removeEventListener = function (eventName) {
        if (eventName === 'attributes') {
            var MutationObserver = getMutationObserver();
            var observer;
            if (isOfGlobalDocument(this) && MutationObserver) {
                observer = domData.get.call(this, 'canAttributesObserver');
                if (observer && observer.disconnect) {
                    observer.disconnect();
                    domData.clean.call(this, 'canAttributesObserver');
                }
            } else {
                domData.clean.call(this, 'canHasAttributesBindings');
            }
        }
        return originalRemove.apply(this, arguments);
    };
});
/*can-util@3.0.1#dom/attr/attr*/
define('can-util/dom/attr/attr', function (require, exports, module) {
    var setImmediate = require('can-util/js/set-immediate/set-immediate');
    var getDocument = require('can-util/dom/document/document');
    var global = require('can-util/js/global/global')();
    var isOfGlobalDocument = require('can-util/dom/is-of-global-document/is-of-global-document');
    var setData = require('can-util/dom/data/data');
    var domContains = require('can-util/dom/contains/contains');
    var domEvents = require('can-util/dom/events/events');
    var domDispatch = require('can-util/dom/dispatch/dispatch');
    var MUTATION_OBSERVER = require('can-util/dom/mutation-observer/mutation-observer');
    var each = require('can-util/js/each/each');
    var types = require('can-util/js/types/types');
    require('can-util/dom/events/attributes/attributes');
    var namespaces = { 'xlink': 'http://www.w3.org/1999/xlink' };
    var formElements = {
            'INPUT': true,
            'TEXTAREA': true,
            'SELECT': true
        }, toString = function (value) {
            if (value == null) {
                return '';
            } else {
                return '' + value;
            }
        }, isSVG = function (el) {
            return el.namespaceURI === 'http://www.w3.org/2000/svg';
        }, truthy = function () {
            return true;
        }, getSpecialTest = function (special) {
            return special && special.test || truthy;
        }, propProp = function (prop, obj) {
            obj = obj || {};
            obj.get = function () {
                return this[prop];
            };
            obj.set = function (value) {
                if (this[prop] !== value) {
                    this[prop] = value;
                }
                return value;
            };
            return obj;
        }, booleanProp = function (prop) {
            return {
                isBoolean: true,
                set: function (value) {
                    if (prop in this) {
                        this[prop] = value !== false;
                    } else {
                        this.setAttribute(prop, '');
                    }
                },
                remove: function () {
                    this[prop] = false;
                }
            };
        }, setupMO = function (el, callback) {
            var attrMO = setData.get.call(el, 'attrMO');
            if (!attrMO) {
                var onMutation = function () {
                    callback.call(el);
                };
                var MO = MUTATION_OBSERVER();
                if (MO) {
                    var observer = new MO(onMutation);
                    observer.observe(el, {
                        childList: true,
                        subtree: true
                    });
                    setData.set.call(el, 'attrMO', observer);
                } else {
                    setData.set.call(el, 'attrMO', true);
                    setData.set.call(el, 'canBindingCallback', { onMutation: onMutation });
                }
            }
        }, setChildOptions = function (el, value) {
            if (value != null) {
                var child = el.firstChild, hasSelected = false;
                while (child) {
                    if (child.nodeName === 'OPTION') {
                        if (value === child.value) {
                            hasSelected = child.selected = true;
                            break;
                        }
                    }
                    child = child.nextSibling;
                }
                if (!hasSelected) {
                    el.selectedIndex = -1;
                }
            } else {
                el.selectedIndex = -1;
            }
        }, setChildOptionsOnChange = function (select, aEL) {
            var handler = setData.get.call(select, 'attrSetChildOptions');
            if (handler) {
                return Function.prototype;
            }
            handler = function () {
                setChildOptions(select, select.value);
            };
            setData.set.call(select, 'attrSetChildOptions', handler);
            aEL.call(select, 'change', handler);
            return function (rEL) {
                setData.clean.call(select, 'attrSetChildOptions');
                rEL.call(select, 'change', handler);
            };
        }, attr = {
            special: {
                checked: {
                    get: function () {
                        return this.checked;
                    },
                    set: function (val) {
                        var notFalse = !!val || val === undefined || val === '';
                        this.checked = notFalse;
                        if (notFalse && this.type === 'radio') {
                            this.defaultChecked = true;
                        }
                        return val;
                    },
                    remove: function () {
                        this.checked = false;
                    },
                    test: function () {
                        return this.nodeName === 'INPUT';
                    }
                },
                'class': {
                    get: function () {
                        if (isSVG(this)) {
                            return this.getAttribute('class');
                        }
                        return this.className;
                    },
                    set: function (val) {
                        val = val || '';
                        if (isSVG(this)) {
                            this.setAttribute('class', '' + val);
                        } else {
                            this.className = val;
                        }
                        return val;
                    }
                },
                disabled: booleanProp('disabled'),
                focused: {
                    get: function () {
                        return this === document.activeElement;
                    },
                    set: function (val) {
                        var cur = attr.get(this, 'focused');
                        if (cur !== val) {
                            var element = this;
                            types.queueTask([
                                function () {
                                    if (val) {
                                        element.focus();
                                    } else {
                                        element.blur();
                                    }
                                },
                                this,
                                []
                            ]);
                        }
                        return !!val;
                    },
                    addEventListener: function (eventName, handler, aEL) {
                        aEL.call(this, 'focus', handler);
                        aEL.call(this, 'blur', handler);
                        return function (rEL) {
                            rEL.call(this, 'focus', handler);
                            rEL.call(this, 'blur', handler);
                        };
                    },
                    test: function () {
                        return this.nodeName === 'INPUT';
                    }
                },
                'for': propProp('htmlFor'),
                innertext: propProp('innerText'),
                innerhtml: propProp('innerHTML'),
                innerHTML: propProp('innerHTML', {
                    addEventListener: function (eventName, handler, aEL) {
                        var handlers = [];
                        var el = this;
                        each([
                            'change',
                            'blur'
                        ], function (eventName) {
                            var localHandler = function () {
                                handler.apply(this, arguments);
                            };
                            domEvents.addEventListener.call(el, eventName, localHandler);
                            handlers.push([
                                eventName,
                                localHandler
                            ]);
                        });
                        return function (rEL) {
                            each(handlers, function (info) {
                                rEL.call(el, info[0], info[1]);
                            });
                        };
                    }
                }),
                required: booleanProp('required'),
                readonly: booleanProp('readOnly'),
                selected: {
                    get: function () {
                        return this.selected;
                    },
                    set: function (val) {
                        val = !!val;
                        setData.set.call(this, 'lastSetValue', val);
                        return this.selected = val;
                    },
                    addEventListener: function (eventName, handler, aEL) {
                        var option = this;
                        var select = this.parentNode;
                        var lastVal = option.selected;
                        var localHandler = function (changeEvent) {
                            var curVal = option.selected;
                            lastVal = setData.get.call(option, 'lastSetValue') || lastVal;
                            if (curVal !== lastVal) {
                                lastVal = curVal;
                                domDispatch.call(option, eventName);
                            }
                        };
                        var removeChangeHandler = setChildOptionsOnChange(select, aEL);
                        domEvents.addEventListener.call(select, 'change', localHandler);
                        aEL.call(option, eventName, handler);
                        return function (rEL) {
                            removeChangeHandler(rEL);
                            domEvents.removeEventListener.call(select, 'change', localHandler);
                            rEL.call(option, eventName, handler);
                        };
                    },
                    test: function () {
                        return this.nodeName === 'OPTION' && this.parentNode && this.parentNode.nodeName === 'SELECT';
                    }
                },
                src: {
                    set: function (val) {
                        if (val == null || val === '') {
                            this.removeAttribute('src');
                            return null;
                        } else {
                            this.setAttribute('src', val);
                            return val;
                        }
                    }
                },
                style: {
                    set: function () {
                        var el = global.document && getDocument().createElement('div');
                        if (el && el.style && 'cssText' in el.style) {
                            return function (val) {
                                return this.style.cssText = val || '';
                            };
                        } else {
                            return function (val) {
                                return this.setAttribute('style', val);
                            };
                        }
                    }()
                },
                textcontent: propProp('textContent'),
                value: {
                    get: function () {
                        var value = this.value;
                        if (this.nodeName === 'SELECT') {
                            if ('selectedIndex' in this && this.selectedIndex === -1) {
                                value = undefined;
                            }
                        }
                        return value;
                    },
                    set: function (value) {
                        var nodeName = this.nodeName.toLowerCase();
                        if (nodeName === 'input') {
                            value = toString(value);
                        }
                        if (this.value !== value || nodeName === 'option') {
                            this.value = value;
                        }
                        if (attr.defaultValue[nodeName]) {
                            this.defaultValue = value;
                        }
                        if (nodeName === 'select') {
                            setData.set.call(this, 'attrValueLastVal', value);
                            setChildOptions(this, value === null ? value : this.value);
                            var docEl = this.ownerDocument.documentElement;
                            if (!domContains.call(docEl, this)) {
                                var select = this;
                                var initialSetHandler = function () {
                                    domEvents.removeEventListener.call(select, 'inserted', initialSetHandler);
                                    setChildOptions(select, value === null ? value : select.value);
                                };
                                domEvents.addEventListener.call(this, 'inserted', initialSetHandler);
                            }
                            setupMO(this, function () {
                                var value = setData.get.call(this, 'attrValueLastVal');
                                attr.set(this, 'value', value);
                                domDispatch.call(this, 'change');
                            });
                        }
                        return value;
                    },
                    test: function () {
                        return formElements[this.nodeName];
                    }
                },
                values: {
                    get: function () {
                        var values = [];
                        var child = this.firstChild;
                        while (child) {
                            if (child.nodeName === 'OPTION' && child.selected) {
                                values.push(child.value);
                            }
                            child = child.nextSibling;
                        }
                        setData.set.call(this, 'valuesLastVal', values);
                        return values;
                    },
                    set: function (values) {
                        values = values || [];
                        var child = this.firstChild;
                        while (child) {
                            if (child.nodeName === 'OPTION') {
                                child.selected = values.indexOf(child.value) !== -1;
                            }
                            child = child.nextSibling;
                        }
                        setData.set.call(this, 'valuesLastVal', values);
                        setupMO(this, function () {
                            var lastVal = setData.get.call(this, 'valuesLastVal');
                            attr.set(this, 'values', lastVal);
                            domDispatch.call(this, 'values');
                        });
                        return values;
                    },
                    addEventListener: function (eventName, handler, aEL) {
                        var localHandler = function () {
                            domDispatch.call(this, 'values');
                        };
                        domEvents.addEventListener.call(this, 'change', localHandler);
                        aEL.call(this, eventName, handler);
                        return function (rEL) {
                            domEvents.removeEventListener.call(this, 'change', localHandler);
                            rEL.call(this, eventName, handler);
                        };
                    }
                }
            },
            defaultValue: {
                input: true,
                textarea: true
            },
            setAttrOrProp: function (el, attrName, val) {
                attrName = attrName.toLowerCase();
                var special = attr.special[attrName];
                if (special && special.isBoolean && !val) {
                    this.remove(el, attrName);
                } else {
                    this.set(el, attrName, val);
                }
            },
            set: function (el, attrName, val) {
                var usingMutationObserver = isOfGlobalDocument(el) && MUTATION_OBSERVER();
                attrName = attrName.toLowerCase();
                var oldValue;
                if (!usingMutationObserver) {
                    oldValue = attr.get(el, attrName);
                }
                var newValue;
                var special = attr.special[attrName];
                var setter = special && special.set;
                var test = getSpecialTest(special);
                if (typeof setter === 'function' && test.call(el)) {
                    newValue = setter.call(el, val);
                } else {
                    attr.setAttribute(el, attrName, val);
                }
                if (!usingMutationObserver && newValue !== oldValue) {
                    attr.trigger(el, attrName, oldValue);
                }
            },
            setSelectValue: function (el, value) {
                attr.set(el, 'value', value);
            },
            setAttribute: function () {
                var doc = getDocument();
                if (doc && document.createAttribute) {
                    try {
                        doc.createAttribute('{}');
                    } catch (e) {
                        var invalidNodes = {}, attributeDummy = document.createElement('div');
                        return function (el, attrName, val) {
                            var first = attrName.charAt(0), cachedNode, node, attr;
                            if ((first === '{' || first === '(' || first === '*') && el.setAttributeNode) {
                                cachedNode = invalidNodes[attrName];
                                if (!cachedNode) {
                                    attributeDummy.innerHTML = '<div ' + attrName + '=""></div>';
                                    cachedNode = invalidNodes[attrName] = attributeDummy.childNodes[0].attributes[0];
                                }
                                node = cachedNode.cloneNode();
                                node.value = val;
                                el.setAttributeNode(node);
                            } else {
                                attr = attrName.split(':');
                                if (attr.length !== 1) {
                                    el.setAttributeNS(namespaces[attr[0]], attrName, val);
                                } else {
                                    el.setAttribute(attrName, val);
                                }
                            }
                        };
                    }
                }
                return function (el, attrName, val) {
                    el.setAttribute(attrName, val);
                };
            }(),
            trigger: function (el, attrName, oldValue) {
                if (setData.get.call(el, 'canHasAttributesBindings')) {
                    attrName = attrName.toLowerCase();
                    return setImmediate(function () {
                        domDispatch.call(el, {
                            type: 'attributes',
                            attributeName: attrName,
                            target: el,
                            oldValue: oldValue,
                            bubbles: false
                        }, []);
                    });
                }
            },
            get: function (el, attrName) {
                attrName = attrName.toLowerCase();
                var special = attr.special[attrName];
                var getter = special && special.get;
                var test = getSpecialTest(special);
                if (typeof getter === 'function' && test.call(el)) {
                    return getter.call(el);
                } else {
                    return el.getAttribute(attrName);
                }
            },
            remove: function (el, attrName) {
                attrName = attrName.toLowerCase();
                var oldValue;
                if (!MUTATION_OBSERVER()) {
                    oldValue = attr.get(el, attrName);
                }
                var special = attr.special[attrName];
                var setter = special && special.set;
                var remover = special && special.remove;
                var test = getSpecialTest(special);
                if (typeof remover === 'function' && test.call(el)) {
                    remover.call(el);
                } else if (typeof setter === 'function' && test.call(el)) {
                    setter.call(el, undefined);
                } else {
                    el.removeAttribute(attrName);
                }
                if (!MUTATION_OBSERVER() && oldValue != null) {
                    attr.trigger(el, attrName, oldValue);
                }
            },
            has: function () {
                var el = getDocument() && document.createElement('div');
                if (el && el.hasAttribute) {
                    return function (el, name) {
                        return el.hasAttribute(name);
                    };
                } else {
                    return function (el, name) {
                        return el.getAttribute(name) !== null;
                    };
                }
            }()
        };
    var oldAddEventListener = domEvents.addEventListener;
    domEvents.addEventListener = function (eventName, handler) {
        var special = attr.special[eventName];
        if (special && special.addEventListener) {
            var teardown = special.addEventListener.call(this, eventName, handler, oldAddEventListener);
            var teardowns = setData.get.call(this, 'attrTeardowns');
            if (!teardowns) {
                setData.set.call(this, 'attrTeardowns', teardowns = {});
            }
            if (!teardowns[eventName]) {
                teardowns[eventName] = [];
            }
            teardowns[eventName].push({
                teardown: teardown,
                handler: handler
            });
            return;
        }
        return oldAddEventListener.apply(this, arguments);
    };
    var oldRemoveEventListener = domEvents.removeEventListener;
    domEvents.removeEventListener = function (eventName, handler) {
        var special = attr.special[eventName];
        if (special && special.addEventListener) {
            var teardowns = setData.get.call(this, 'attrTeardowns');
            if (teardowns && teardowns[eventName]) {
                var eventTeardowns = teardowns[eventName];
                for (var i = 0, len = eventTeardowns.length; i < len; i++) {
                    if (eventTeardowns[i].handler === handler) {
                        eventTeardowns[i].teardown.call(this, oldRemoveEventListener);
                        eventTeardowns.splice(i, 1);
                        break;
                    }
                }
                if (eventTeardowns.length === 0) {
                    delete teardowns[eventName];
                }
            }
            return;
        }
        return oldRemoveEventListener.apply(this, arguments);
    };
    module.exports = exports = attr;
});
/*can-util@3.0.1#js/make-array/make-array*/
define('can-util/js/make-array/make-array', function (require, exports, module) {
    var each = require('can-util/js/each/each');
    function makeArray(arr) {
        var ret = [];
        each(arr, function (a, i) {
            ret[i] = a;
        });
        return ret;
    }
    module.exports = makeArray;
});
/*can-util@3.0.1#js/cid/cid*/
define('can-util/js/cid/cid', function (require, exports, module) {
    var cid = 0;
    module.exports = function (object, name) {
        if (!object._cid) {
            cid++;
            object._cid = (name || '') + cid;
        }
        return object._cid;
    };
});
/*can-util@3.0.1#dom/mutate/mutate*/
define('can-util/dom/mutate/mutate', function (require, exports, module) {
    var makeArray = require('can-util/js/make-array/make-array');
    var setImmediate = require('can-util/js/set-immediate/set-immediate');
    var CID = require('can-util/js/cid/cid');
    var getMutationObserver = require('can-util/dom/mutation-observer/mutation-observer');
    var childNodes = require('can-util/dom/child-nodes/child-nodes');
    var domContains = require('can-util/dom/contains/contains');
    var domDispatch = require('can-util/dom/dispatch/dispatch');
    var DOCUMENT = require('can-util/dom/document/document');
    var mutatedElements;
    var checks = {
        inserted: function (root, elem) {
            return domContains.call(root, elem);
        },
        removed: function (root, elem) {
            return !domContains.call(root, elem);
        }
    };
    var fireOn = function (elems, root, check, event, dispatched) {
        if (!elems.length) {
            return;
        }
        var children, cid;
        for (var i = 0, elem; (elem = elems[i]) !== undefined; i++) {
            cid = CID(elem);
            if (elem.getElementsByTagName && check(root, elem) && !dispatched[cid]) {
                dispatched[cid] = true;
                children = makeArray(elem.getElementsByTagName('*'));
                domDispatch.call(elem, event, [], false);
                for (var j = 0, child; (child = children[j]) !== undefined; j++) {
                    cid = CID(child);
                    if (!dispatched[cid]) {
                        domDispatch.call(child, event, [], false);
                        dispatched[cid] = true;
                    }
                }
            }
        }
    };
    var fireMutations = function () {
        var mutations = mutatedElements;
        mutatedElements = null;
        var firstElement = mutations[0][1][0];
        var doc = DOCUMENT() || firstElement.ownerDocument || firstElement;
        var root = doc.contains ? doc : doc.body;
        var dispatched = {
            inserted: {},
            removed: {}
        };
        mutations.forEach(function (mutation) {
            fireOn(mutation[1], root, checks[mutation[0]], mutation[0], dispatched[mutation[0]]);
        });
    };
    var mutated = function (elements, type) {
        if (!getMutationObserver() && elements.length) {
            var firstElement = elements[0];
            var doc = DOCUMENT() || firstElement.ownerDocument || firstElement;
            var root = doc.contains ? doc : doc.body;
            if (checks.inserted(root, firstElement)) {
                if (!mutatedElements) {
                    mutatedElements = [];
                    setImmediate(fireMutations);
                }
                mutatedElements.push([
                    type,
                    elements
                ]);
            }
        }
    };
    module.exports = {
        appendChild: function (child) {
            if (getMutationObserver()) {
                this.appendChild(child);
            } else {
                var children;
                if (child.nodeType === 11) {
                    children = makeArray(childNodes(child));
                } else {
                    children = [child];
                }
                this.appendChild(child);
                mutated(children, 'inserted');
            }
        },
        insertBefore: function (child, ref, document) {
            if (getMutationObserver()) {
                this.insertBefore(child, ref);
            } else {
                var children;
                if (child.nodeType === 11) {
                    children = makeArray(childNodes(child));
                } else {
                    children = [child];
                }
                this.insertBefore(child, ref);
                mutated(children, 'inserted');
            }
        },
        removeChild: function (child) {
            if (getMutationObserver()) {
                this.removeChild(child);
            } else {
                mutated([child], 'removed');
                this.removeChild(child);
            }
        },
        replaceChild: function (newChild, oldChild) {
            if (getMutationObserver()) {
                this.replaceChild(newChild, oldChild);
            } else {
                var children;
                if (newChild.nodeType === 11) {
                    children = makeArray(childNodes(newChild));
                } else {
                    children = [newChild];
                }
                mutated([oldChild], 'removed');
                this.replaceChild(newChild, oldChild);
                mutated(children, 'inserted');
            }
        },
        inserted: function (elements) {
            mutated(elements, 'inserted');
        },
        removed: function (elements) {
            mutated(elements, 'removed');
        }
    };
});
/*can-util@3.0.1#namespace*/
define('can-util/namespace', function (require, exports, module) {
    module.exports = {};
});
/*can-view-target@3.0.0-pre.6#can-view-target*/
define('can-view-target', function (require, exports, module) {
    var childNodes = require('can-util/dom/child-nodes/child-nodes');
    var domAttr = require('can-util/dom/attr/attr');
    var each = require('can-util/js/each/each');
    var makeArray = require('can-util/js/make-array/make-array');
    var getDocument = require('can-util/dom/document/document');
    var domMutate = require('can-util/dom/mutate/mutate');
    var namespace = require('can-util/namespace');
    var processNodes = function (nodes, paths, location, document) {
            var frag = document.createDocumentFragment();
            for (var i = 0, len = nodes.length; i < len; i++) {
                var node = nodes[i];
                frag.appendChild(processNode(node, paths, location.concat(i), document));
            }
            return frag;
        }, keepsTextNodes = typeof document !== 'undefined' && function () {
            var testFrag = document.createDocumentFragment();
            var div = document.createElement('div');
            div.appendChild(document.createTextNode(''));
            div.appendChild(document.createTextNode(''));
            testFrag.appendChild(div);
            var cloned = testFrag.cloneNode(true);
            return childNodes(cloned.firstChild).length === 2;
        }(), clonesWork = typeof document !== 'undefined' && function () {
            var a = document.createElement('a');
            a.innerHTML = '<xyz></xyz>';
            var clone = a.cloneNode(true);
            return clone.innerHTML === '<xyz></xyz>';
        }(), namespacesWork = typeof document !== 'undefined' && !!document.createElementNS;
    var cloneNode = clonesWork ? function (el) {
        return el.cloneNode(true);
    } : function (node) {
        var copy;
        if (node.nodeType === 1) {
            copy = document.createElement(node.nodeName);
        } else if (node.nodeType === 3) {
            copy = document.createTextNode(node.nodeValue);
        } else if (node.nodeType === 8) {
            copy = document.createComment(node.nodeValue);
        } else if (node.nodeType === 11) {
            copy = document.createDocumentFragment();
        }
        if (node.attributes) {
            var attributes = makeArray(node.attributes);
            each(attributes, function (node) {
                if (node && node.specified) {
                    domAttr.setAttribute(copy, node.nodeName, node.nodeValue);
                }
            });
        }
        if (node.childNodes) {
            each(node.childNodes, function (child) {
                copy.appendChild(cloneNode(child));
            });
        }
        return copy;
    };
    function processNode(node, paths, location, document) {
        var callback, loc = location, nodeType = typeof node, el, p, i, len;
        var getCallback = function () {
            if (!callback) {
                callback = {
                    path: location,
                    callbacks: []
                };
                paths.push(callback);
                loc = [];
            }
            return callback;
        };
        if (nodeType === 'object') {
            if (node.tag) {
                if (namespacesWork && node.namespace) {
                    el = document.createElementNS(node.namespace, node.tag);
                } else {
                    el = document.createElement(node.tag);
                }
                if (node.attrs) {
                    for (var attrName in node.attrs) {
                        var value = node.attrs[attrName];
                        if (typeof value === 'function') {
                            getCallback().callbacks.push({ callback: value });
                        } else {
                            domAttr.setAttribute(el, attrName, value);
                        }
                    }
                }
                if (node.attributes) {
                    for (i = 0, len = node.attributes.length; i < len; i++) {
                        getCallback().callbacks.push({ callback: node.attributes[i] });
                    }
                }
                if (node.children && node.children.length) {
                    if (callback) {
                        p = callback.paths = [];
                    } else {
                        p = paths;
                    }
                    el.appendChild(processNodes(node.children, p, loc, document));
                }
            } else if (node.comment) {
                el = document.createComment(node.comment);
                if (node.callbacks) {
                    for (i = 0, len = node.attributes.length; i < len; i++) {
                        getCallback().callbacks.push({ callback: node.callbacks[i] });
                    }
                }
            }
        } else if (nodeType === 'string') {
            el = document.createTextNode(node);
        } else if (nodeType === 'function') {
            if (keepsTextNodes) {
                el = document.createTextNode('');
                getCallback().callbacks.push({ callback: node });
            } else {
                el = document.createComment('~');
                getCallback().callbacks.push({
                    callback: function () {
                        var el = document.createTextNode('');
                        domMutate.replaceChild.call(this.parentNode, el, this);
                        return node.apply(el, arguments);
                    }
                });
            }
        }
        return el;
    }
    function getCallbacks(el, pathData, elementCallbacks) {
        var path = pathData.path, callbacks = pathData.callbacks, paths = pathData.paths, child = el, pathLength = path ? path.length : 0, pathsLength = paths ? paths.length : 0;
        for (var i = 0; i < pathLength; i++) {
            child = child.childNodes.item(path[i]);
        }
        for (i = 0; i < pathsLength; i++) {
            getCallbacks(child, paths[i], elementCallbacks);
        }
        elementCallbacks.push({
            element: child,
            callbacks: callbacks
        });
    }
    function hydrateCallbacks(callbacks, args) {
        var len = callbacks.length, callbacksLength, callbackElement, callbackData;
        for (var i = 0; i < len; i++) {
            callbackData = callbacks[i];
            callbacksLength = callbackData.callbacks.length;
            callbackElement = callbackData.element;
            for (var c = 0; c < callbacksLength; c++) {
                callbackData.callbacks[c].callback.apply(callbackElement, args);
            }
        }
    }
    function makeTarget(nodes, doc) {
        var paths = [];
        var frag = processNodes(nodes, paths, [], doc || getDocument());
        return {
            paths: paths,
            clone: frag,
            hydrate: function () {
                var cloned = cloneNode(this.clone);
                var args = makeArray(arguments);
                var callbacks = [];
                for (var i = 0; i < paths.length; i++) {
                    getCallbacks(cloned, paths[i], callbacks);
                }
                hydrateCallbacks(callbacks, args);
                return cloned;
            }
        };
    }
    makeTarget.keepsTextNodes = keepsTextNodes;
    namespace.view = namespace.view || {};
    module.exports = namespace.view.target = makeTarget;
});
/*[global-shim-end]*/
(function(){ // jshint ignore:line
	window._define = window.define;
	window.define = window.define.orig;
}
)();