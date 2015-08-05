// parse from-to:
// plain input - graphlib
// graphlib - plain input
// graphlib - sigma.js
// coloring sigma.js

// dependencies
var _ = require('lomath')
var graphlib = require("graphlib")
var Graph = graphlib.Graph;
var gio = require(__dirname+'/gio.js')

// sample data
var nodes = ['a','b','c','d','e']
var edges = [
'a-b', 'a-c', 'a-d', 'b-c', 'b-e', 'c-e'
]
var pg = {
	nodes: nodes,
	edges: edges
}

// parse from plain JSON into graphlib functional obj
function plain2graphlib(pg) {
	var g = new Graph({directed: false})
	_.each(pg.nodes, g.setNode, g)
	_.each(pg.edges, function(e){
		g.setEdge.apply(g, _.union(e.split(/\-/), [e]))
	})
	// returns a functional graphlib graph
	return g
}

// parse from graphlib functional obj into plain JSON
function graphlib2plain(g) {
	// convert to proper JSON format
	g = graphlib.json.write(g)
	var nodes = []
	_.each(g.nodes, function(n){
		nodes.push(n.v)
	})
	var edges = []
	console.log
	_.each(g.edges, function(e){
		edges.push(e.v+'-'+e.w)
	})
	return {
		nodes: nodes,
		edges: edges
	}
}

// parse from graphlib functional obj into sigma.js format
function graphlib2sigma(g) {
	// convert to proper JSON format
	g = graphlib.json.write(g)
	// init sigma graph
	sg = {
		"nodes": [],
		"edges": []
	}
	// add the nodes
	var nodes = g.nodes
	_.map(nodes, function(n){
		var obj = {
			id: n.v,
			label: n.v,
			x: Math.random(),
			y: Math.random(),
			size: 1,
			color: '#E73834'
		}
		sg.nodes.push(obj)
	})
	// add the edges
	var edges = g.edges
	_.map(edges, function(e){
		var obj = {
			id: e.v+'-'+e.w,
			source: e.v,
			target: e.w,
			size: 1,
			color: '#E73834'
		}
		sg.edges.push(obj)
	})
	return sg
}

// mutates sigma graph to recolor node n and its edges, with optional color
function colorSigma(sg, n, color) {
	color = color || '#78afc0'
	// nodes
	_.each(sg.nodes, function(nObj){
		if (nObj.id == n)
			nObj.color = color
	})
	// incident edges
	_.each(sg.edges, function(eObj){
		if (eObj.source == n || eObj.target == n)
			eObj.color = color
	})
}



module.exports = {
	plain2graphlib: plain2graphlib,
	graphlib2plain: graphlib2plain,
	graphlib2sigma: graphlib2sigma,
	colorSigma: colorSigma
}


// var g = plain2graphlib(pg)
// console.log(g.edge('a', 'b'))
// var pg = graphlib2plain(g)
// console.log(pg)
// var sg = graphlib2sigma(g)
// console.log(sg.nodes)
// console.log(sg.edges)

// colorSigma(sg, 'a')
// console.log(sg.nodes)
// console.log(sg.edges)

// gio.exportG(__dirname+'/data/g1.json', g)
// gio.exportG(__dirname+'/data/sg1.json', sg)

