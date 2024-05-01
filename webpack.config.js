import path from "path";

export default {
  mode: "production",
  entry: "./dist/next-up-down.js",
  output: {
    path: path.resolve("dist"),
    filename: "next-up-down.min.js",
    library: "next_up_down",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /\.test\.ts$/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
};
