// dependencies
var _ = require('lomath')
var graphlib = require("graphlib")
var Graph = graphlib.Graph;
var gio = require(__dirname+'/gio.js')

var g = gio.importG(__dirname+'/data/g2.json')

// var E = g.edges()
// console.log(g.nodes())
// console.log(E)

// g.removeNode('b')

// console.log(g.nodes())
// console.log(E)

// console.log(_.isEmpty(['']))

// Approx VC alg. Note this is not MVC, but is a 2-approx
// 1. init C to empty set
// 2. while E nonempty
// 	2.1 pick any edge {u,v} in E
// 	2.2 add the pair of nodes to C
// 	2.3 delete all incident edges of u,v
// 3. return C
function aVC(g) {
	var C = []
	while(!_.isEmpty(g.edges())) {
		var pair = g.edges().pop()
		_.map(pair, function(i){
			C.push(i)
			g.removeNode(i)
		})
	}
	return C
}

// console.log(aVC(g))