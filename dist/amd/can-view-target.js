/*can-view-target@3.0.6#can-view-target*/
define(function (require, exports, module) {
    var childNodes = require('can-util/dom/child-nodes');
    var domAttr = require('can-util/dom/attr');
    var each = require('can-util/js/each');
    var makeArray = require('can-util/js/make-array');
    var getDocument = require('can-util/dom/document');
    var domMutate = require('can-util/dom/mutate');
    var namespace = require('can-namespace');
    var MUTATION_OBSERVER = require('can-util/dom/mutation-observer');
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
            var el = document.createElement('a');
            el.innerHTML = '<xyz></xyz>';
            var clone = el.cloneNode(true);
            var works = clone.innerHTML === '<xyz></xyz>';
            var MO, observer;
            if (works) {
                el = document.createDocumentFragment();
                el.appendChild(document.createTextNode('foo-bar'));
                MO = MUTATION_OBSERVER();
                if (MO) {
                    observer = new MO(function () {
                    });
                    observer.observe(document.documentElement, {
                        childList: true,
                        subtree: true
                    });
                    clone = el.cloneNode(true);
                    observer.disconnect();
                } else {
                    clone = el.cloneNode(true);
                }
                return clone.childNodes.length === 1;
            }
            return works;
        }(), namespacesWork = typeof document !== 'undefined' && !!document.createElementNS;
    var cloneNode = clonesWork ? function (el) {
        return el.cloneNode(true);
    } : function (node) {
        var document = node.ownerDocument;
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
                    domAttr.setAttribute(copy, node.nodeName || node.name, node.nodeValue || node.value);
                }
            });
        }
        if (node && node.firstChild) {
            var child = node.firstChild;
            while (child) {
                copy.appendChild(cloneNode(child));
                child = child.nextSibling;
            }
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
    makeTarget.cloneNode = cloneNode;
    namespace.view = namespace.view || {};
    module.exports = namespace.view.target = makeTarget;
});