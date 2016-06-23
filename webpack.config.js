var path = require('path');
var webpack = require('webpack');
var fs = require('fs');

function getEntry() {
	var files = fs.readdirSync(__dirname + '/views/pages');
	if (!fs.existsSync('./views/entry')) {
		fs.mkdirSync('./views/entry');
	}
	return files.reduce((entry, file) => {
		var name = file.replace(/\..+?$/, '');
		var Name = name.substring(0, 1).toUpperCase() + name.substr(1);
		entry[name] = './views/entry/' + name;
		var entryFile = __dirname + '/views/entry/' + file;
		fs.writeFileSync(entryFile, `
			const React = require('react');
			const ReactDOM = require('react-dom');
			const ${Name} = require('../pages/${name}.jsx');
			window.${Name}Comp = ReactDOM.render(<${Name}
				  data={window._react_data}
				  config={window._react_config}
			/>, document.getElementById('app'));
      	`);
		return entry;
	}, {});
}
module.exports = {
	devtool: process.env.WEBPACK_DEVTOOL || 'source-map',
	entry: getEntry(),
	output: {
		// Make sure to use [name] or [id] in output.filename
		//  when using multiple entry points
		filename: "[name].bundle.js",
		chunkFilename: "[id].bundle.js",
		path: path.join(__dirname, 'public/build')
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	},

	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				loader: 'babel'
			}
		]
	},
	plugins: []
}
