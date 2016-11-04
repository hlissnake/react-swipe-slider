const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');

const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
	app: path.join(__dirname, 'src'),
	build: path.join(__dirname, 'dist'),
	node_modules: path.join(__dirname, 'node_modules')
};

process.env.BABEL_ENV = TARGET;

const common = {
	entry: [
		path.join(PATHS.app, 'index.jsx')
	],
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	output: {
		path: PATHS.build,
		filename: 'main.js',
		publicPath: '/'
	},
	module: {
		loaders: [
			{
				test: /\.scss$/,
				loaders: ["style", "css", "sass"]
			},
			{
				test: /\.css$/,
				loaders: [ 'style', 'css' ]
			},
			{
				test: /\.json$/,
				loaders: ['json']
			},
			{
				test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: "url-loader?limit=10000&minetype=application/font-woff"
			},
			{
				test: /\.(ttf|eot|svg|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: "file-loader"
			},
			{
				test: /\.js(x|)$/,
				loaders: ['transform?envify', 'babel?cacheDirectory'],
				include: PATHS.app,
				exclude: [PATHS.node_modules]
			}
		]
	}
};

if (TARGET === 'start' || !TARGET) {
	module.exports = merge(common, {
		devtool: 'eval-source-map',
		devServer: {
			historyApiFallback: true,
			hot: true,
			inline: true,
			progress: true,
			
			// display only errors to reduce the amount of output
			stats: {
				// Config for minimal console.log mess.
				assets: false,
				colors: true,
				version: false,
				hash: false,
				timings: false,
				chunks: false,
				chunkModules: false
			},
			
			// parse host and port from env so this is easy
			// to customize
			host: process.env.HOST,
			port: process.env.PORT
		}
	});
} else {
	module.exports = merge(common, {});
}
