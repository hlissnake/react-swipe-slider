const webpack = require('webpack');
const path = require('path');

module.exports = {
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
				test: /\.js(x|)$/,
				loaders: ['transform?envify', 'babel?cacheDirectory']
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
			}
		],
		plugins: [
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
				'process.env.ENVIRONMENT_IS_LIVE': JSON.stringify(false),
				'process.env.API_URL_BASE': JSON.stringify(process.env.API_BASE_URL || 'localhost:3000'),
				'process.env.API_URL_PROTOCOL': JSON.stringify((process.env.API_SECURE === 'true') ? 'https' : 'http'),
				'process.env.EXCAT_URL': JSON.stringify(process.env.EXCAT_URL || 'http://localhost:2000'),
				'process.env.VERSION': JSON.stringify('vSTATIC'),
				'process.env.OPEN_TAG_ID': JSON.stringify('')
			})
		]
	}
};
    
