// DO NOT EDIT - THIS FILE CAN/WILL BE REPLACED!!!
// ***********************************************

const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

const modern = merge(common, {
	mode: 'development',
	entry: './src/index.tsx',
	output: {
		filename: 'bundle.js',
		chunkFilename: 'bundle.chunk.[fullhash:8].[id].js',
	},
	target: 'browserslist:modern',
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							[
								'@babel/preset-env',
								{
									browserslistEnv: 'modern',
								},
							],
						],
					},
				},
			},
		],
	},
	devServer: {
		server: 'https',
		port: 3333,
		hot: true,
		allowedHosts: 'all',
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
		static: {
			directory: path.join(__dirname, 'public'),
			publicPath: ['/'],
			watch: true,
		},
		devMiddleware: {
			publicPath: '/',
		},
		client: {
			logging: 'error',
			overlay: {
				errors: true,
				warnings: false,
				runtimeErrors: false,
			},
			webSocketURL: {
				hostname: 'localhost',
			},
		},
	},
	devtool: 'source-map',
});

module.exports = modern;