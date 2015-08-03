// dependencies
var _ = require('lomath')
var graphlib = require("graphlib")
var fs = require('fs');

// import graph from json, then construct
var path = __dirname+"/data/g2.json"
var obj = require(path)
var g = graphlib.json.read(obj)

// What nodes are in the graph?
console.log(g.nodes())
// => `[ 'a', 'b', 'c' ]`

// What edges are in the graph?
console.log(g.edges())
// => `[ { v: 'a', w: 'b' },
//       { v: 'c', w: 'd' } ]`.

// Which edges enter and leave node "d"?
console.log(g.nodeEdges("d"))
// => `[ { v: 'c', w: 'd' } ]`

function degree(n) {
	return _.size(g.outEdges(n))
}

console.log(degree("a"))