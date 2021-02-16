const path = require('path');
module.exports = {
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.(css)$/,
                use: [
                    {loader: "style-loader"},
                    {loader: "css-loader"},
                ]
            },
            {
                test: /\.(scss)$/,
                use: [
                    {loader: "style-loader"},
                    {loader: "sass-loader"},
                ]
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                }
            },
            {
                test: /\.jsx?$/, // определяем тип файлов
                exclude: /(node_modules)/,  // исключаем из обработки папку node_modules
                loader: "babel-loader",   // определяем загрузчик
                options:{
                    presets:["@babel/preset-env", "@babel/preset-react"]    // используемые плагины
                }
            }
        ]
    },
}