const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, '/public'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.jsx$|\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    resolve: {
        extensions: [',','.js','.jsx']
    },
    devServer: {
        contentBase: path.join(__dirname, '/public'),
        historyApiFallback: true,
        compress: true,
        port: 8000,
        open: true,
        proxy: {
            '/api/': {
                target: {
                    host: '127.0.0.1',
                    protocol: 'http',
                    port: 3000
                }
            }
        }
    }
}