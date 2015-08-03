// io for graphs

// dependencies
var graphlib = require("graphlib")
var fs = require('fs');

function exportG(path, g) {
	try {
		fs.writeFile(path, JSON.stringify(graphlib.json.write(g), null, 4))
	}
	catch (e) {
		fs.writeFile(path, JSON.stringify(g, null, 4))
	}
}

function importG(path) {
	try {
		return graphlib.json.read(require(path))
	}
	catch (e) {
		return require(path)
	}
}

module.exports = {
	exportG: exportG,
	importG: importG
}