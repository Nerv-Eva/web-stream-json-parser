# web-stream-json-parser
> A stream JSON parser based on web stream.

## Install

```sh
$ npm i web-stream-json-parser -S
```

If you're using module bundler like webpack:

```javascript
// ES6
import StreamParser from 'web-stream-json-parser';

// or CommonJS
var StreamParser = require('web-stream-json-parser');
```

Or you can include dist/stream-parser.umd.js to your html:

```html
<script src="stream-parser.umd.js"></script>
```
You can find it on `window.StreamParser`

## Usage
```javascript
import StreamParser from 'web-stream-json-parser';

const parser = new StreamParser();

fetch('data.json').then(response => parser.parse(response.body));

// register your event
parser.on('string', str => {
    // do something
})

parser.on('onColon', () => {
    // do something
});

// ....more

```

## EventList
|    Event   |      Status                   |
|------------|:-----------------------------:|
|   number   |  Found and emit a number.     |
|   string   |  Found and emit a string.     |
|   boolean  |  Found and emit a boolean.    |
|   null     |  Found and emit a null.       |
| startObject|  An object started.           |
| endObject  |  An object ended.             |
| startArray |  An array started.            |
| endArray   |  An array ended.              |
| colon      |  Found a colon.               |
| comma      |  Found a comma.               |

## Examples & Demos

Please check [web-stream-demos](https://github.com/Nerv-Eva/web-stream-demos)

#### Thanks for the event-only version of jsonparse from [Tim Caswell](https://gist.github.com/creationix/1821394)