// dependencies
var _ = require('lomath')
var graphlib = require("graphlib")
var Graph = graphlib.Graph;

var gio = require(__dirname+'/gio.js')

// // algorithms
// // Serialization
// // json.read
// // json.write
// // alg.components
// // alg.dijkstra
// // alg.dijkstraAll
// // alg.findCycles
// // alg.floydWarshall
// // alg.isAcyclic
// // alg.postorder
// // alg.preorder
// // alg.prim
// // alg.tarjan
// // alg.topsort

// var Graph = require("graphlib").Graph;

// // Create a new directed graph
// var g = new Graph();

// // Add node "a" to the graph with no label
// g.setNode("a");

// g.hasNode("a");
// // => true

// // Add node "b" to the graph with a String label
// g.setNode("b", "b's value");

// // Get the label for node b
// g.node("b");
// // => "b's value"

// // Add node "c" to the graph with an Object label
// g.setNode("c", { k: 123 });

// // What nodes are in the graph?
// g.nodes();
// // => `[ 'a', 'b', 'c' ]`

// // Add a directed edge from "a" to "b", but assign no label
// g.setEdge("a", "b");

// // Add a directed edge from "c" to "d" with an Object label.
// // Since "d" did not exist prior to this call it is automatically
// // created with an undefined label.
// g.setEdge("c", "d", { k: 456 });

// // What edges are in the graph?
// g.edges();
// // => `[ { v: 'a', w: 'b' },
// //       { v: 'c', w: 'd' } ]`.

// // Which edges leave node "a"?
// g.outEdges("a");
// // => `[ { v: 'a', w: 'b' } ]`

// // Which edges enter and leave node "d"?
// g.nodeEdges("d");
// // => `[ { v: 'c', w: 'd' } ]`

// import graph from json, then construct
var g = gio.importG(__dirname+"/data/g2.json")

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

// API docs here
// https://github.com/cpettitt/graphlib/wiki/API-Reference#graph-api

var undir = new Graph({directed: false});

// start adding edges: node, node, label
undir.setEdge("a", "b", "1")
undir.setEdge("a", "c", "2")
undir.setEdge("a", "d", "3")
// g.setNode("z");


// Sigma form
var i,
s,
N = 20,
E = 20,
g = {
	nodes: [],
	edges: []
};

// Generate a random graph:
for (i = 0; i < N; i++)
	g.nodes.push({
		id: 'n' + i,
		label: 'Node ' + i,
		x: Math.random(),
		y: Math.random(),
		size: 0.5,
		color: '#E73834'
	});

for (i = 0; i < E; i++)
	g.edges.push({
		id: 'e' + i,
		source: 'n' + (Math.random() * N | 0),
		target: 'n' + (Math.random() * N | 0),
		size: 0.5,
		color: '#E73834'
	});


// export data
// gio.exportG(__dirname+'/data/g3.json', g)

