let path = require('path');
let webpack = require('webpack');
let MiniCssExtractPlugin = require("mini-css-extract-plugin");
let UglifyJsPlugin = require("uglifyjs-webpack-plugin");
let OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

let conf = {
    entry:
        './static/js/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'static/bundle/'),
      },
    devServer:{
        overlay: true
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin(),
            new OptimizeCssAssetsPlugin()
        ]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: '/node_modules/'
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                ]
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/'
                    }
                }]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].min.css",
            chunkFilename: "[id].css"
        }),
        new webpack.ProvidePlugin({
           $: "jquery",
           jQuery: "jquery"
       })
    ]

};

module.exports = (env, options)=>{
    let production = options.mode === 'production';
    conf.devtool = production ? false :'eval-sourcemap';
    // conf.devtool = production ? 'source-map' :'eval-sourcemap';
    return conf;
}
