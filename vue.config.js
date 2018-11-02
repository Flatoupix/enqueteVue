module.exports = {
  baseUrl:"",
  filenameHashing: false,
  outputDir: "../Build",
  assetsDir: "static",
  devServer: {
    proxy: {
      "/services": {
        target:
          "http://localhost/Specif/EUDO_EXTENSION_ENQUETE/root/SectionORM/modules/enquete/"
      }
    }
    
  }
};
