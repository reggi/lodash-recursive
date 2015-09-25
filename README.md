# lodash recursive

## map recursive

```js
var assert = require('assert')
var recursive = require('lodash-recursive')

var nodes = [
  {
    value: 'alpha',
    children: [
      {
        value: 'beta'
      }
    ]
  },
  {
    value: 'gamma'
  }
]

var newNodes = recursive.map(nodes, function (node, recursive, map) {
  if (node.children) recursive(node.children)
  return map(node)
}, function (node) {
  if (node.value == 'beta') node.valid = true
  return node
})

var expected = [
  {
    "value": "alpha",
    "children": [
      {
        "value": "beta",
        "valid": true
      }
    ]
  },
  {
    "value": "gamma"
  }
]

assert.deepEqual(expected, newNodes)
```
