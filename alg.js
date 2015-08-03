// dependencies
var _ = require('lomath')
var graphlib = require("graphlib")
var Graph = graphlib.Graph;
var gio = require(__dirname+'/gio.js')

var g = gio.importG(__dirname+'/data/g1.json')

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


// brute force MVC: takes a path to graph json, and param k
// deletes from a combset then check if edgeCount == 0. If true return
function bruteVC(gpath, k) {
	// init import of graph for params
	var g = gio.importG(gpath)
	var m = 0, nodes = g.nodes(), order = nodes.length, found = false, res = []
	if (order < k) throw 'order is smaller than k'
	// try while not found and m <= k
	while(!found && _.lte(++m, k)) {

		// generate combination
		_.each(_.combList(order, m), function(indArr){
			// fresh functional graph for each new indArr
			g = gio.importG(gpath)
			_.each(indArr, function(ind){
				g.removeNode(nodes[ind])
			})
			// if is a VC, found while and quit each loop
			if (g.edgeCount() == 0) {
				res = _.pullAt(nodes, indArr)
				found = true
				return false
			}
		})
	}
	return {
		found: found,
		VC: res,
		size: m
	}
}

// console.log(bruteVC(__dirname+'/data/g1.json', 3))