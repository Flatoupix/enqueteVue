module.exports = {
  filenameHashing: false,
  outputDir: "../Build",
  assetsDir: "static",
  baseUrl:"./",
  devServer: {
    proxy: {
      "/services": {
        target:
          "http://localhost/Specif/EUDO_EXTENSION_ENQUETE/root/SectionORM/modules/enquete"
      }
    }
    
  }
};
