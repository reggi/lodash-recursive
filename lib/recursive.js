var _ = require('lodash')

var main = {}

main.compare = function (n1, n2) {
  var path1 = n1.split('.')
  var path2 = n2.split('.')
  var maxLen = Math.max(path1.length, path2.length)
  var i = 0
  while (i < maxLen) {
    if (!path1[i] || +path1[i] < +path2[i]) {
      return -1
    }
    if (!path2[i] || +path1[i] > +path2[i]) {
      return 1
    }
    i++
  }
  return 0
}

main.subset = function (ids, id) {
  return _.filter(ids, function (_id) {
    var _idArr = _id.split('.')
    var idArr = id.split('.')
    var _idChop = _.take(_idArr, _idArr.length - 1).join('.')
    var idChop = _.take(idArr, idArr.length - 1).join('.')
    if (_idChop === idChop) return true
    return false
  })
}

main.metaInfo = function (ids, id) {
  ids = ids.sort(main.compare)
  var idIndex = ids.indexOf(id)
  var meta = {}
  meta.prev = (ids[idIndex - 1]) ? ids[idIndex - 1] : false
  meta.next = (ids[idIndex + 1]) ? ids[idIndex + 1] : false
  var idsSubset = main.subset(ids, id)
  var idSubsetIndex = idsSubset.indexOf(id)
  meta.prevSibling = (idsSubset[idSubsetIndex - 1]) ? idsSubset[idSubsetIndex - 1] : false
  meta.nextSibling = (idsSubset[idSubsetIndex + 1]) ? idsSubset[idSubsetIndex + 1] : false
  return meta
}

main.generate = function (method, nodes, recursiveSelector, callback, flatNodes) {
  var ids = _.keys(flatNodes)
  function recursive (nodes) {
    return _[method](nodes, function (node, id) {
      var dId = (this.id !== false) ? this.id + '.' + id : id.toString()
      return recursiveSelector(node, recursive.bind({
        'id': dId,
      }), callback.bind({
        'id': dId,
        'nodes': flatNodes,
        'meta': main.metaInfo(ids, dId)
      }))
    }.bind(this))
  }
  return recursive.bind({'id': false})(nodes)
}

main.map = function (nodes, recursiveSelector, callback) {
  var flatNodes = main.flatIndexed(nodes, recursiveSelector)
  return main.generate('map', nodes, recursiveSelector, callback, flatNodes)
}

main.filter = function (nodes, recursiveSelector, callback) {
  var flatNodes = main.flatIndexed(nodes, recursiveSelector)
  return main.generate('filter', nodes, recursiveSelector, callback, flatNodes)
}

main.each = function (nodes, recursiveSelector, callback) {
  return main.generate('each', nodes, recursiveSelector, callback)
}

main.flatIndexed = function (nodes, recursiveSelector) {
  var flat = {}
  main.each(nodes, recursiveSelector, function (node) {
    flat[this.id] = node
  })
  return flat
}

main.flat = function (nodes, recursiveSelector) {
  var flat = []
  main.each(nodes, recursiveSelector, function (node) {
    flat.push(node)
  })
  return flat
}

main.filterValues = function (items, callback) {
  var result = {}
  _.each(items, function (value, key) {
    if (callback(value, key)) result[key] = value
  })
  return result
}

/** returns first root node that matches callback */
main.containsChild = function (nodes, recursiveSelector, callback) {
  var flatIndexed = main.flatIndexed(nodes, recursiveSelector)
  var ids = _.keys(flatIndexed)
  var validNodes = main.filterValues(flatIndexed, function (value, key) {
    return callback.bind({
      'id': key,
      'nodes': flatIndexed,
      'meta': main.metaInfo(ids, key)
    })(value, key)
  })
  var root = _.keys(validNodes)[0].split('.')[0]
  return flatIndexed[root]
}

module.exports = main
