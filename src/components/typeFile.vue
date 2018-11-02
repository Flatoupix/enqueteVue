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

      <div :class="['file',uppedFiles.includes(file.lastModified)?'upped':'']" :key="index" v-for="(file, index) in files">
        <div class="msgUpd"><span>{{file.name}}</span> envoyé !<div class="closeBtn" @click="deleteFile(index)">+</div>
        </div>
        <div class="fileTitle">{{file.name}}<div class="closeBtn" @click="deleteFile(index)">+</div>
        </div>

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
        this.uppedFiles.push(file.lastModified);
        console.log(this.uppedFiles);
      }
      formData.append("Quest", this.question.id);
      this.$http
        .post(
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
        // id: this.question.id,
        uidFile: this.fileIDs[index],
        extension: ""
      };

      this.$http
        .post(
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
          this.fileIDs.splice(index, 1);
        })
        .catch(function() {
          console.log("FAILURE DELETE!!");

          // A SUPPRIMER --

          this.files.splice(index, 1);
          this.fileIDs.splice(index, 1);
        });
    },

    /*
        Handles a change on the file upload
      */
    handleFileUpload() {
      for (const file of this.$refs.fileattachment.files) {
        this.files.push(file);

        console.log(this.uppedFiles);
      }
    }
  }
};
</script>
<style scoped>
@keyframes submitOn {
  from {
    opacity: 0;
    margin-right: -2em;
  }
  to {
    opacity: 1;
    margin-right: 0;
  }
}
@keyframes fileAppears {
  form {
    margin-top: -2em;
  }
  to {
    margin-top: 0em;
  }
}
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
  overflow: hidden;
}

div#fileUpload > div.panelDown > div.file.upped {
  margin-right: -18em;
  margin-left: 0;
}
div#fileUpload > div.panelDown > div.file:hover div > div.closeBtn {
  display: inline-block;
  opacity: 1;
}
div#fileUpload > div.panelDown > div.file > div {
  position: relative;
}
div#fileUpload > div.panelDown > div.file div > div.closeBtn {
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
  position: absolute;
  right: 0.5em;
  top: 0.5em;
  text-indent: initial;
}
div#fileUpload > div.panelDown > div.file > div.fileTitle {
  color: #404040;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  text-indent: 0.8em;
}
#fileUpload > div.panelDown.down > div.file > * {
  height: 2em;
  line-height: 2em;
}

#fileUpload > div.panelDown.down > div.file > div.msgUpd {
  height: 2em;
  line-height: 2em;
  color: #bb1515;
  background-color: #fff;
  border-bottom: 0.1em solid #bb1515;
}

div#fileUpload > div.panelDown.down {
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
  display: none;
  margin-left: -0.2em;
  opacity: 0;
}
div#fileUpload > div.panelDown > div.file {
  background-color: #d7d7d7;
  -webkit-transition: 0.5s;
  white-space: nowrap;
  margin-left: -18em;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 2em;
  animation: 0.25s 0.25s fileAppears both;

  margin-top: -2em;
  opacity: 1;
  z-index: -1;
}
div#fileUpload > div.submitFile.attached {
  animation-fill-mode: forwards;
  animation: 0.25s submitOn;
  display: inline-block;
  opacity: 1;
}
div#fileUpload > label > input#attachment {
  display: none;
}
</style>
