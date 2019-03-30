[![codecov](https://codecov.io/gh/swimyoung/dom-serialize/branch/master/graph/badge.svg)](https://codecov.io/gh/swimyoung/dom-serialize)

# DOM Serialize

Serialize the DOM

Q. Why don't you use innerHTML?

: when you use innerHTML you lose tree structure if there are adjacent text nodes.

```txt
            span
          /       \
  text node       text node
```

dom-serialize serialize the DOM with keeping tree structure. So you can keep tree structure when you deserialize from serialized string.

## Getting started

```sh
npm install dom-serialize
```

### ES Module

```js
import { serialize, deserialize } from 'dom-serialize';

const dom = document.createElement('div');
dom.appendChild(document.createTextNode('hello'));
dom.appendChild(document.createTextNode('world'));

const code = serialize(dom);
console.log(deserialize(code));
```

### UMD

```html
<script src="node_modules/dom-serialize/dist/domSerialize.js"></script>
<script>
  var dom = document.createElement('div');
  dom.appendChild(document.createTextNode('hello'));
  dom.appendChild(document.createTextNode('world'));

  var code = domSerialize.serialize(dom);
  console.log(domSerialize.deserialize(code));
</script>
```
