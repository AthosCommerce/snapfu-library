// DO NOT EDIT - THIS FILE CAN/WILL BE REPLACED!!!
// ***********************************************

const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const childProcess = require('child_process');

let branchName;
try {
	branchName = childProcess.execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
} catch (e) {
	branchName = 'production';
}

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
				include: [/node_modules\/@athoscommerce/, path.resolve(__dirname, 'src')],
				use: {
					loader: 'babel-loader',
					options: {
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