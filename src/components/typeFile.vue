<template>
  <div >
    <file-pond id="FileUpload" name="FileUpload" ref="pond" @init="myFunction()" :files="files" label-idle="Déposez vos
    fichiers ici..." allow-multiple="true" />

  </div>
</template>
<script>
import vueFilePond, { setOptions } from "vue-filepond";

import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";

// Import the plugin code
import FilePondPluginFileMetadata from 'filepond-plugin-file-metadata';

const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview
);

export default {
  props: {
    question: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    FilePond
  },
  methods: {
    myFunction() {
      console.log('FilePond has initialized');
      setOptions({
        allowFileMetadata: true,
    fileMetadataObject: {
        'hello': 'world'
    },

        server: {
          url:
            this.sessionVars.urlLocation +
            this.sessionVars.servicePath +
            "attachment?" +
            this.sessionVars.tokenName +
            "=" +
            encodeURIComponent(this.sessionVars.tokenValue) +
            "&q=" +
            this.question.id,            
          load: {
            url:
              "http://nla2-pc" +
              this.sessionVars.servicePath +
              "searchattachment?" +
              this.sessionVars.tokenName +
              "=" +
              encodeURIComponent(this.sessionVars.tokenValue) +
              "&q=" +
              this.question.id
          }
        }
      });
      this.$refs.pond.getFiles(this.files);
    }
  },
  data() {
    return {
      files: []
    };
  }
};
</script>
<style>
.filepond--file {
  background: #bb1515;
}
  .filepond--root {
    max-height: 10em;
    width:25rem;
    margin:0 auto;
}
  div#fileUpload {
    color: white;
    background-color: #bb1515;
    width: 10em;
    height: 2em;
    line-height: 2em;
    margin: 1em auto;
  }
  div#fileUpload label {
    cursor: pointer;
  }

</style>
