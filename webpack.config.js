import MiniCssExtractPlugin from "mini-css-extract-plugin"
import HtmlWebpackPlugin from "html-webpack-plugin"
import CopyPlugin from "copy-webpack-plugin"

export default {
    entry: "./web/index.js",
    devtool: "inline-source-map",
    mode: "production",
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|jpeg|gif|csv)$/i,
                type: "asset/resource",
            },
            {
                test: /\.(css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            template: "web/index.html"
        }),
        new CopyPlugin({
            patterns: [
                { from: "web/static", to: "" },
            ],
        }),
    ],
    output: {
        clean: true,
    },
}