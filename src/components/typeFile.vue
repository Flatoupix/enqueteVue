<template>
  <div id="fileUpload">
    <label class="headLabel">
      <div>Ajoutez votre fichier ici</div>
      <input type="file" id="attachment" ref="fileattachment" multiple @change="handleFileUpload()" />
    </label>
    <div :class="['submitFile',files.length!=0 ?
    'attached':'']" @click="submitFile()">Envoyer</div>
    <div :class="['panelDown',files.length!=0 ?
    'down':'']">
      <div class="file" :key="index" v-for="(file, index) in files">
        <div class="fileTitle">{{file.name}}</div>
        <div class="closeBtn" @click="deleteFile(index)">+</div>
      </div>
    </div>

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
      files: [],
      Url:
        this.sessionVars.urlLocation +
        this.sessionVars.servicePath +
        this.sessionVars.serviceName +
        this.sessionVars.tokenName +
        "=" +
        encodeURIComponent(this.sessionVars.tokenValue),
      uppedFiles: [],
      fileIDs: []

    };
  },
  methods: {
    submitFile() {
      let formData = new FormData();
      this.sessionVars.serviceName = "attachment?";
      for (const file of this.files) {
        formData.append("FileUpload", file);
      }
      formData.append("Quest", this.question.id);
      this.$http
        .post(
          this.sessionVars.urlLocation +
            this.sessionVars.servicePath +
            this.sessionVars.serviceName +
            this.sessionVars.tokenName +
            "=" +
            encodeURIComponent(this.sessionVars.tokenValue),
          formData
        )
        .then(resp => {
          this.fileIDs.push(resp.data.reponse.CurrentIdAnnexe);

          console.log(resp);
          console.log("SUCCESS!!");
        })
        .catch(function() {
          console.log("FAILURE!!");
        });
    },
    deleteFile(index) {
      this.sessionVars.serviceName = "deleteattachment?";

      let objFormat = {
        name: "FileDelete",
        id: this.question.id,
        uidFile: this.fileIDs[index],
        extension: ""
      };

      this.$http
        .post(
          this.sessionVars.urlLocation +
            this.sessionVars.servicePath +
            this.sessionVars.serviceName +
            this.sessionVars.tokenName +
            "=" +
            encodeURIComponent(this.sessionVars.tokenValue),
          JSON.stringify(objFormat)
        )
        .then(resp => {
          console.log(resp);
          console.log("DELETE SUCCESS!!");
          this.files.splice(index, 1);
          this.fileIDs.splice(index,1)
        })
        .catch(function() {
          console.log("FAILURE DELETE!!");
        });
    },

    /*
        Handles a change on the file upload
      */
    handleFileUpload() {
      for (const file of this.$refs.fileattachment.files) {
        this.files.push(file);
        console.log(this.files);
      }
    }
  }
};
</script>
<style scoped>
div#fileUpload {
  margin: auto;
  width: 35rem;
  display: inline-block;
  user-select: none;
}
div#fileUpload label.headLabel {
  width: 40%;
  display: inline-block;
  height: 3rem;
  position: relative;
  background-color: #efefef;
  z-index: 100;
}
div#fileUpload label.headLabel > div {
  cursor: pointer;
  display: inline-block;
  color: #717171;
  width: 69%;
  line-height: 3rem;
}
div#fileUpload > div.panelDown {
  background-color: #e8e8e8;
  width: 50%;
  margin: 0 auto;
  color: #8b8b8b;
  z-index: 1;
  position: relative;
  top: -2em;
  -webkit-transition: 0.5s;
  transition: 0.5s;
}

div#fileUpload > div.panelDown > div.file {
  height: 2em;
  line-height: 2em;
  background-color: #d7d7d7;
}
div.file.upped {
  margin-top: 1em;
    background-color: #88da84;
}
div#fileUpload > div.panelDown > div.file:hover > div.closeBtn {
  display: inline-block;
  opacity: 1;
}
div#fileUpload > div.panelDown > div.file > div.closeBtn {
  background-color: #333;
  border-radius: 1em;
  color: white;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
  width: 1em;
  line-height: 1em;
  vertical-align: 0.7em;
  font-family: serif;
  opacity: 0;
  display: inline-block;
  cursor: pointer;
  transition: 0.5s;
}
div#fileUpload > div.panelDown > div.file > div.fileTitle {
  font-size: 0.8em;
  color: #404040;
  width: 80%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow-x: hidden;
  display: inline-block;
}
div#fileUpload > div.panelDown.down {
  top: 0;
}
div#fileUpload > div.submitFile {
  display: inline-block;
  background-color: #bb1515;
  color: white;
  width: 20%;
  line-height: 3rem;
  cursor: pointer;
  z-index: 100;
  position: relative;
  margin-left: 1em;
  opacity: 0;

  transition: 0.5s;
}
div#fileUpload > div.submitFile.attached {
  opacity: 1;
  margin-left: -0.2em;
}
div#fileUpload > label > input#attachment {

  display: none;
}
</style>
