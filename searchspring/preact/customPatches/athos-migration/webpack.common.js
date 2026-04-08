// DO NOT EDIT - THIS FILE CAN/WILL BE REPLACED!!!
// ***********************************************

const webpack = require('webpack');
const childProcess = require('child_process');
const path = require('path');

// determine branch name for branch override usage
let branchName;
try {
	branchName = childProcess.execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
} catch (e) {
	branchName = 'production';
}

// class name for for branch override usage
const styleClass = 'ss-snap-bundle-styles';

module.exports = {
	output: {
		path: path.resolve(__dirname, 'dist'),
	},
	stats: {
		modulesSort: 'size',
		modulesSpace: 70,
	},
	plugins: [
		new webpack.BannerPlugin({
			banner: 'window.athos = window.athos || {};\nwindow.athos.managed = true;',
			raw: true,
			entryOnly: true,
		}),
		new webpack.DefinePlugin({
			BRANCHNAME: `"${branchName}"`,
		}),
	],
	module: {
		strictExportPresence: true,
		rules: [
			{
				test: /\.(css|scss)$/,
				exclude: /\.module\.(css|scss)$/,
				use: [
					{
						loader: 'style-loader',
						options: {
							attributes: { class: styleClass },
						},
					},
					'css-loader',
					'sass-loader',
				],
			},
			{
				test: /\.module\.(css|scss)$/,
				use: [
					{
						loader: 'style-loader',
						options: {
							attributes: { class: styleClass },
						},
					},
					{
						loader: 'css-loader',
						options: {
							modules: {
								localIdentName: '[local]--[hash:base64:5]',
							},
						},
					},
					'sass-loader',
				],
			},
			{
				test: /\.(png|svg)$/,
				use: ['file-loader'],
			},
		],
	},
	resolve: {
		extensions: ['.js', '.jsx'],
		alias: {
			react: 'preact/compat',
			'react-dom/test-utils': 'preact/test-utils',
			'react-dom': 'preact/compat',
		},
	},
};