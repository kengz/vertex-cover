// dependencies
var _ = require('lomath')
var graphlib = require("graphlib")
var Graph = graphlib.Graph;
var gio = require(__dirname + '/gio.js')
var parser = require(__dirname + '/parser.js')

var g = gio.importG(__dirname + '/data/g1.json')

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
    while (!_.isEmpty(g.edges())) {
        var pair = g.edges().pop()
        _.map(pair, function(i) {
            C.push(i)
            g.removeNode(i)
        })
    }
    return C
}

// console.log(aVC(g))


// brute force MVC: takes a path to graph json, and param k
// deletes from a combset then check if edgeCount == 0. If true return
function bruteVC(jsonify, k) {
    // init import of graph for params
    var g = graphlib.json.read(jsonify)
    var m = 0,
        nodes = g.nodes(),
        order = nodes.length,
        found = false,
        res = []
    if (order < k) throw 'order is smaller than k'
        // try while not found and m <= k
        // 
    while (!found && _.lte(++m, k)) {

        // generate combination
        _.each(_.combList(order, m), function(indArr) {
            // fresh functional graph for each new indArr
            g = graphlib.json.read(jsonify)
            _.each(indArr, function(ind) {
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


// next:
// √see how to nicely duplicate graphlib's graph. Like readjson whatever, yeah u can clone json
// implemented reducing, with folding and struction subroutines
// keep tuples
// run


// let v0 w/ neighbors v1 thru vp
// struction:
// 1. remove N[v0], add a new node vij for each antiedge {vi,vj} w/ 0 < i < j <= p
// 2. add an edge (vir,vjs) if i == j, r != s, and (vr, vs) is an edge in G
// 3. if i != j add an edge (vir, vjs)
// 4. for every u !\in N[v0] add edge (vij, u) if (vi, u) or (vj, u) is an edge in G

function struction(jsonify, v) {
    var g = graphlib.json.read(jsonify)
        // 1. Identify closed neighborhood of v
    var openN = g.neighbors(v)
    var closedN = openN.push(v)
    var complement = _.difference(g.nodes, closedN)

    var joinedNodes = []
    var pairs = _.combList(openN.length, 2)
        // for each subset pair indices
    _.map(pairs, function(pairInd) {
        var pair = _.at(openN, pairInd),
            i = pair[0],
            j = pair[1]
            // if is antiedge, add node delim by ',', as 'i,j'
        if (g.edge(i, j) == undefined) {
            joinedNodes.push(pair)
            g.setNode(pair.join(','))
        }
    })

    // 2. take the newly added ndoes with paired indices, enum pairs (in [i, j])
    var newPairs = _.combList(joinedNodes.length, 2)
    _.map(newPairs, function(pairInd) {
        // take pair of [i,r] and [j, s] as left and right
        var pair = _.at(joinedNodes, pairInd)
        var left = pair[0],
            right = pair[1],
            i = left[0],
            r = left[1],
            j = right[0],
            s = right[1]

        // if i = j, r != s, and r, s is an edge in G
        if (i == j && r != s && g.edge(r, s) != undefined) {
            // add an edge (ir, js)
            g.setEdge(left.join(','), right.join(','))
        }
        // 3. if i != j, add adge (ir, js)
        else if (i != j) {
            g.setEdge(left.join(','), right.join(','))
        }
    })

    // 4. for all u !\in closedN, add edge (ij, u) if (i,u) or (j,u) were an edge
    _.each(complement, function(u) {
        _.each(joinedNodes, function(ij) {
            if (g.edge(ij[0], u) != undefined || g.edge(ij[1], u) != undefined) {
                g.setEdge(ij.join(','), u)
            }
        })
    })

    // remove closedN from g
    _.each(closedN, function(n) {
        g.removeNode(n)
    })

    return g
}


// simple Folding from the Measure n Conquer paper
// 1. add a new node ij if (i,j) is an antiedge in N(v)
// 2. add edges bet. ij and vertices in N(i)-union-N(j)
// 3. add edge bet. each pair of new vertices
// 4. remove N[v]

function folding(jsonify, v) {
    var g = graphlib.json.read(jsonify)
        // 1. Identify closed neighborhood of v
    var openN = g.neighbors(v)
    var closedN = openN.push(v)
        // var complement = _.difference(g.nodes, closedN)
    var joinedNodes = []
    var pairs = _.combList(openN.length, 2)
        // 1. add ij if (i,j) is antiedge
    _.map(pairs, function(pairInd) {
        var pair = _.at(openN, pairInd),
            i = pair[0],
            j = pair[1]
            // if is antiedge, add node delim by ',', as 'i,j'
        if (g.edge(i, j) == undefined) {
            joinedNodes.push(pair)
            g.setNode(pair.join(','))
                // 2. connect ij to all old neighbors
            var NiUNj = _.union(g.neighbors(i), g.neighbors(j))
            _.each(NiUNj, function(u) {
                g.setEdge(u, pair.join(','))
            })
        }
    })

    // 3. add edge bet.each pair of new vertices
    var newPairs = _.combList(joinedNodes.length, 2)
    _.map(newPairs, function(pairInd) {
        var pair = _.at(joinedNodes, pairInd)
        var nleft = pair[0].join(','),
            nright = pair[1].join(',')
        g.setEdge(nleft, nright)
    })

    // 4. remove closedN from g
    _.each(closedN, function(n) {
        g.removeNode(n)
    })

    return g

}


// sample run
// function chain(plainpath) {}
var plainpath = __dirname+'/data/pg1.json'
var pg = require(plainpath)
var g = parser.plain2graphlib(pg)
var jsonify = graphlib.json.write(g)

// var jsonify = require(__dirname + '/data/g1.json')
console.log(bruteVC(jsonify, 3))

console.log(struction(jsonify, 'a').nodes())
console.log(folding(jsonify, 'a').nodes())

var res = _.combList(4, 2)

console.log(res)
