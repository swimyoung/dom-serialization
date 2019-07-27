[![codecov](https://codecov.io/gh/swimyoung/dom-serialization/branch/master/graph/badge.svg)](https://codecov.io/gh/swimyoung/dom-serialization) [![Build Status](https://travis-ci.org/swimyoung/dom-serialization.svg?branch=master)](https://travis-ci.org/swimyoung/dom-serialization)

# DOM Serialization

Serialize the DOM

Q. Why don't you use innerHTML?

: when you use innerHTML you lose tree structure if there are adjacent text nodes.

```txt
            span
          /       \
  text node       text node
```

dom-serialization serialize the DOM with keeping tree structure. So you can keep tree structure when you deserialize from serialized string.

## Demo

https://swimyoung.github.io/dom-serialization/

## Getting started

```sh
npm install dom-serialization
```

```js
import { serialize, deserialize } from 'dom-serialization';

const dom = document.createElement('div');
dom.appendChild(document.createTextNode('hello'));
dom.appendChild(document.createTextNode('world'));

const code = serialize(dom);
console.log(deserialize(code));
```
