
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    target:"node",
    entry:["./src/app"],
    output:{
        filename:"app.js",
        path:path.resolve(__dirname,"dist")
    },
    mode:"development",
    devtool:"inline-source-map",
    plugins:[
        new CopyWebpackPlugin({
            patterns:[
                {from:"./settings.json", to:""}
            ]
        })
    ],
    module:{
        rules:[{
            test:/\.ts$/,
            exclude:/node_module/,
            use:"ts-loader"
        }]
    },
    experiments: {
        topLevelAwait: true
    },
    resolve:{
        extensions:[".ts","js"]
    }
};