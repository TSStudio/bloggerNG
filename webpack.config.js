const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const { ElementPlusResolver } = require("unplugin-vue-components/resolvers");
const { EnvironmentPlugin } = require("webpack");
const unpluginautoimport = require("unplugin-auto-import/webpack");
const unpluginvuecomponents = require("unplugin-vue-components/webpack");

module.exports = {
    entry: "./src/main.js",
    module: {
        rules: [
            { test: /\.vue$/, use: "vue-loader" },
            { test: /\.css$/, use: ["vue-style-loader", "css-loader"] },
            { test: /\.js$/, use: "babel-loader" },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
                generator: {
                    filename: "imgs/[hash][ext]",
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: "asset/resource",
                generator: {
                    filename: "fonts/[hash][ext]",
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
        }),
        new VueLoaderPlugin(),
        unpluginautoimport({
            resolvers: [ElementPlusResolver()],
        }),
        unpluginvuecomponents({
            resolvers: [ElementPlusResolver()],
        }),
        new EnvironmentPlugin({
            API_ARG:
                process.env.NODE_ENV == "development"
                    ? "dev=VXCVCX"
                    : "dev=NODEV",
        }),
    ],
    devServer: {
        host: "local.tmysam.top",
        port: 8000,
        hot: true,
    },
};
