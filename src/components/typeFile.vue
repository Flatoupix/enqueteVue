<template>
  <div>
    <label>File
      <input type="file" id="file" ref="file" @change="handleFileUpload()"/>
      </label>
      <button @click="submitFile()">Submit</button>
  </div>
</template>
<script>
export default {
  props: {
    question: {
      type: Object,
      default: () => {}
    }
  },
  components: {},
  data() {
    return {
      files: []
    };
  },
  methods: {
    /*
        Submits the file to the server
      */
    submitFile() {
      /*
                Initialize the form data
            */
      let formData = new FormData();

      /*
                Add the form data we need to submit
            */
      formData.append("file", this.file);

      /*
          Make the request to the POST /single-file URL
        */
      this.$http
        .post(
          this.sessionVars.urlLocation +
            this.sessionVars.servicePath +
            "attachment?" +
            this.sessionVars.tokenName +
            "=" +
            encodeURIComponent(this.sessionVars.tokenValue) +
            "&q=" +
            this.question.id,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        )
        .then(resp => {
          console.log(resp);
          console.log("SUCCESS!!");
        })
        .catch(function() {
          console.log("FAILURE!!");
        });
    },

    /*
        Handles a change on the file upload
      */
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
      console.log(file)
    }
  }
};
</script>
<style>
.filepond--file {
  background: #bb1515;
}
.filepond--root {
  max-height: 10em;
  width: 25rem;
  margin: 0 auto;
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
