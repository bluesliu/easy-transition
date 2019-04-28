const path = require('path');

module.exports = {
    entry: './src/index.js',
    mode: "production",
    output: {
        path: path.resolve(__dirname, './lib'),
        filename: "index.js",
        // 输出的代码符合 CommonJS 模块化规范，以供给其它模块导入使用。
        libraryTarget: 'commonjs2'
    },
    // 通过正则命中所有以 react 或者 babel-runtime 开头的模块
    // 这些模块使用外部的，不能被打包进输出的代码里
    externals: /^(react|babel-runtime)/,
    module: {
        rules: [
            {
                // 用正则去匹配要用该 loader 转换的 CSS 文件
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192
                        }
                    }
                ]
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    presets: ['@babel/preset-env', '@babel/preset-react'],
                    plugins: ['@babel/plugin-proposal-class-properties']
                }
            },
        ]
    },
    // 输出 Source Map
    devtool: 'source-map'
};