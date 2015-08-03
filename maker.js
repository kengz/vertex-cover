// dependencies
var graphlib = require("graphlib")
var fs = require('fs');
var Graph = graphlib.Graph;

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

// console.log(g)

// write to json
// obj = graphlib.json.write(undir)
path = __dirname+'/data/g3.json'
fs.writeFile(path, JSON.stringify(g, null, 4))
console.log("build")