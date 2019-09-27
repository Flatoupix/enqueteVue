module.exports = {
  filenameHashing: false,
  outputDir: "../Build",
  assetsDir: "static",
  publicPath: "./",
  devServer: {
    proxy: {
      "/services": {
        target:
          "//localhost/" +
          "/Specif/EUDO_EXTDEV_ENQUETE/root/SectionORM/modules/enquete"
      }
    }
  }
};
