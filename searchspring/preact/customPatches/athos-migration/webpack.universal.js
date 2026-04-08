// DO NOT EDIT - THIS FILE CAN/WILL BE REPLACED!!!
// ***********************************************

const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const childProcess = require('child_process');
const branchName = childProcess.execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

module.exports = merge(common, {
	mode: 'production',
	entry: './src/universal.js',
	output: {
		filename: 'universal.bundle.js',
		chunkFilename: 'universal.bundle.chunk.[fullhash:8].[id].js',
		chunkLoadingGlobal: `${branchName}BundleChunks`,
	},
	target: 'browserslist:universal',
	module: {
		rules: [
			{
				test: /\.(js|jsx|mjs)$/,
				exclude: (modulePath) => /node_modules/.test(modulePath) && !/node_modules\/(@athoscommerce|swiper|color\/|color-convert)/.test(modulePath),
				use: {
					loader: 'babel-loader',
					options: {
						sourceType: 'unambiguous',
						presets: [
							[
								'@babel/preset-env',
								{
									browserslistEnv: 'universal',
								},
							],
						],
					},
				},
			},
		],
	},
});