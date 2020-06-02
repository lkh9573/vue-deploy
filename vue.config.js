module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:8080"
      },
      "/node": {
        target: "http://localhost:3344"
      }
    }
  }
};
