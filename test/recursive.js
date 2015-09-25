var _ = require('lodash')
var assert = require('assert')
var recursive = require('../lib/recursive')

var nodes = [
  {
    type: 'pants',
    children: [
      {
        type: 'blouse',
        children: [
          {
            type: 'shirt'
          },
          {
            type: 'skirt'
          }
        ]
      }
    ]
  },
  {
    type: 'glasses',
    children: [
      {
        type: 'shirt'
      }
    ]
  },
  {
    type: 'jacket'
  },
  {
    type: 'pants'
  }
]

/* global describe, it */

describe('recursive', function () {
  describe('.flatIndexed()', function () {
    it('should work', function () {
      var _nodes = _.cloneDeep(nodes)

      var value = recursive.flatIndexed(_nodes, function (node, recursive, map) {
        if (node.children) recursive(node.children)
        return map(node)
      })

      var expected = {
        '0': {
          'type': 'pants',
          'children': [
            {
              'type': 'blouse',
              'children': [
                {
                  'type': 'shirt'
                },
                {
                  'type': 'skirt'
                }
              ]
            }
          ]
        },
        '1': {
          'type': 'glasses',
          'children': [
            {
              'type': 'shirt'
            }
          ]
        },
        '2': {
          'type': 'jacket'
        },
        '3': {
          'type': 'pants'
        },
        '0.0.0': {
          'type': 'shirt'
        },
        '0.0.1': {
          'type': 'skirt'
        },
        '0.0': {
          'type': 'blouse',
          'children': [
            {
              'type': 'shirt'
            },
            {
              'type': 'skirt'
            }
          ]
        },
        '1.0': {
          'type': 'shirt'
        }
      }

      assert.deepEqual(value, expected)

    })

  })

  describe('.map()', function () {
    it('should work', function () {
      var _nodes = _.cloneDeep(nodes)

      var value = recursive.map(_nodes, function (node, recursive, map) {
        if (node.children) recursive(node.children)
        return map(node)
      }, function (node) {
        if (node.type === 'pants') {
          node.extra = true
        }
        return node
      })

      var expected = [
        {
          'type': 'pants',
          'children': [
            {
              'type': 'blouse',
              'children': [
                {
                  'type': 'shirt'
                },
                {
                  'type': 'skirt'
                }
              ]
            }
          ],
          'extra': true
        },
        {
          'type': 'glasses',
          'children': [
            {
              'type': 'shirt'
            }
          ]
        },
        {
          'type': 'jacket'
        },
        {
          'type': 'pants',
          'extra': true
        }
      ]

      assert.deepEqual(value, expected)

    })

  })

  describe('.filter()', function () {
    it('should work', function () {
      var _nodes = _.cloneDeep(nodes)

      var value = recursive.filter(_nodes, function (node, recursive, map) {
        if (node.children) recursive(node.children)
        return map(node)
      }, function (node) {
        return (node.type === 'jacket')
      })

      var expected = [ { type: 'jacket' } ]

      assert.deepEqual(value, expected)

    })

  })

  describe('.containsChild()', function () {
    it('should work', function () {
      var _nodes = [
        {
          type: 'pants',
          children: [
            {
              type: 'blouse',
              children: [
                {
                  type: 'shirt'
                },
                {
                  type: 'skirt'
                }
              ]
            }
          ]
        },
        {
          type: 'shoes',
          children: [
            {
              type: 'glasses',
              children: [
                {
                  type: 'necklace'
                },
                {
                  type: 'sneakers'
                }
              ]
            }
          ]
        },
      ]

      var value = recursive.containsChild(_nodes, function (node, recursive, map) {
        if (node.children) recursive(node.children)
        return map(node)
      }, function (node) {
        return (node.type === 'necklace')
      })

      var expected = {
        'type': 'shoes',
        'children': [
          {
            'type': 'glasses',
            'children': [
              {
                'type': 'necklace'
              },
              {
                'type': 'sneakers'
              }
            ]
          }
        ]
      }

      assert.deepEqual(value, expected)

    })

    it('should find sibling', function () {
      var _nodes = _.cloneDeep(nodes)

      var value = recursive.containsChild(_nodes, function (node, recursive, map) {
        if (node.children) recursive(node.children)
        return map(node)
      }, function (node) {
        return (this.meta.prev && this.nodes[this.meta.prev].type === 'jacket')
      })

      var expected = { type: 'pants' }

      assert.deepEqual(value, expected)

    })

  })

})
