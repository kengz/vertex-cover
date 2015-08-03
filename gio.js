// io for graphs

// dependencies
var graphlib = require("graphlib")
var fs = require('fs');

function exportG(path, g) {
	return fs.writeFile(path, JSON.stringify(g, null, 4))
}

function importG(path) {
	return graphlib.json.read(require(path))
}

module.exports = {
	exportG: exportG,
	importG: importG
}