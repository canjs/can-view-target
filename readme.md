# can-view-target

[![Build Status](https://travis-ci.org/canjs/can-view-target.png?branch=master)](https://travis-ci.org/canjs/can-view-target)

Fast cloning micro templates

## Usage

### ES6 use

With StealJS, you can import this module directly in a template that is autorendered:

```js
import plugin from 'can-view-target';
```

### CommonJS use

Use `require` to load `can-view-target` and everything else
needed to create a template that uses `can-view-target`:

```js
var plugin = require("can-view-target");
```

## AMD use

Configure the `can` and `jquery` paths and the `can-view-target` package:

```html
<script src="require.js"></script>
<script>
	require.config({
	    paths: {
	        "jquery": "node_modules/jquery/dist/jquery",
	        "can": "node_modules/canjs/dist/amd/can"
	    },
	    packages: [{
		    	name: 'can-view-target',
		    	location: 'node_modules/can-view-target/dist/amd',
		    	main: 'lib/can-view-target'
	    }]
	});
	require(["main-amd"], function(){});
</script>
```

### Standalone use

Load the `global` version of the plugin:

```html
<script src='./node_modules/can-view-target/dist/global/can-view-target.js'></script>
```

## Contributing

### Making a Build

To make a build of the distributables into `dist/` in the cloned repository run

```
npm install
node build
```

### Running the tests

Tests can run in the browser by opening a webserver and visiting the `test.html` page.
Automated tests that run the tests from the command line in Firefox can be run with

```
npm test
```
