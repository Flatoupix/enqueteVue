<template>
  <div v-if="browser != null && browser.name != 'ie'" id="fileUpload">
    <div
      @mouseover="warnOff()"
      :class="['sizeWarnClass', sizeWarning ? 'warnAppear' : '']"
    >
      Votre fichier dépasse la taille autorisée de 6 Mo
    </div>
    <label :class="['headLabel', files.length >= 1 ? 'loaded' : '']">
      <div v-if="files.length == 1">{{ files.length }} fichier chargé</div>
      <div v-if="files.length >= 2">{{ files.length }} fichiers chargés</div>
      <div v-else>Ajoutez votre fichier ici</div>
      <input
        type="file"
        id="attachment"
        ref="fileattachment"
        @change="handleFileUpload()"
      />
    </label>
    <div :class="['panelDown', files.length != 0 ? 'down' : '']">
      <!-- <div
        class=""
        @click="sendAll(files)"
      >Tout envoyer</div> -->
      <div class="fileParent" :key="index" v-for="(file, index) in files">
        <div :class="['file', uppedFiles.includes(file.name) ? 'upped' : '']">
          <div class="msgUpd">
            <span class="fileName">{{ file.name }}</span>
          </div>
          <div class="fileTitle">{{ file.name }}</div>
        </div>

        <div
          :class="['submitGrid', uppedFiles.includes(file.name) ? 'sent' : '']"
        >
          <div class="submitFile">
            <div @click="submitFile(file.name)">Envoyer</div>
            <div @click="deleteFile(index, file.name)" class="deleteFile">
              Annuler
            </div>
          </div>
          <div class="fileActions">
            <div class="fileSent">Envoyé !</div>
            <div class="deleteFile" @click="deleteFile(index, file.name)">
              Supprimer
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="ieStyle" v-else>
    <input
      type="file"
      id="attachment"
      ref="fileattachment"
      @change="handleFileUpload()"
    />
    <div class="ieFiles" v-for="file in files" :key="file.id">
      <div>{{ file.name }}</div>
      <span v-if="uppedFiles.includes(file.name)">Envoyé</span>
      <button v-else @click="submitFile(file.name)">Envoyer</button>
    </div>
  </div>
</template>
<script>
import { detect } from "detect-browser";

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
      sizeWarning: false,
      sizeLimit: 6000000,
      files: [],
      Url:
        this.$sessionVars.servicePath +
        this.$sessionVars.serviceName +
        this.$sessionVars.tokenName +
        "=" +
        encodeURIComponent(this.$sessionVars.tokenValue),
      uppedFiles: [],
      fileIDs: [],
      browser: null
    };
  },
  methods: {
    deleteFileArr(array, file) {
      if (array.length != 0) {
        array.forEach(fileType => {
          if (typeof fileType == "string") {
            if (fileType == file) {
              let cocote = array.indexOf(file);
              if (cocote != -1) array.splice(cocote, 1);
            }
          } else {
            if (fileType.name == file) {
              let cocote = array.indexOf(fileType);
              if (cocote != -1) array.splice(cocote, 1);
            }
          }
        });
      }
    },
    submitFile(fileUpped) {
      let formData = new FormData();
      this.$sessionVars.serviceName = "attachment?";

      this.uppedFiles.push(fileUpped);

      for (const file of this.files) {
        if (fileUpped == file.name) {
          formData.append("FileUpload", file);
        }
      }

      formData.append("Quest", this.question.id);
      this.$http
        .post(
          this.$sessionVars.servicePath +
            this.$sessionVars.serviceName +
            this.$sessionVars.tokenName +
            "=" +
            encodeURIComponent(this.$sessionVars.tokenValue),
          formData,
          {
            onUploadProgress(e) {
              let percent = parseInt(100 - (e.loaded / e.total) * 100);
            }
          }
        )
        .then(resp => {
          this.fileIDs.push(resp.data.reponse.CurrentIdAnnexe);
        })
        .catch(function() {});
    },
    sendAll(items) {
      items.forEach(item => {
        this.uppedFiles.push(item.name);
        this.submitFile(item);
      });
    },
    deleteFile(index, fileTarget) {
      this.$sessionVars.serviceName = "deleteattachment?";
      let objFormat = {
        idQuestion: this.question.id,
        name: fileTarget,
        uidFile: this.fileIDs[index],
        extension: ""
      };

      this.$http
        .post(
          this.$sessionVars.servicePath +
            this.$sessionVars.serviceName +
            this.$sessionVars.tokenName +
            "=" +
            encodeURIComponent(this.$sessionVars.tokenValue),
          objFormat
        )
        .then(resp => {
          this.deleteFileArr(this.uppedFiles, fileTarget);
          this.deleteFileArr(this.files, fileTarget);

          this.deleteFileArr(this.fileIDs, fileTarget);
          // this.files.splice(index, 1);
          // this.fileIDs.splice(index, 1);
          // this.uppedFiles.splice(this.uppedFiles.indexOf(fileTarget), 1);
        })
        .catch(function() {});
    },

    /*
        Handles a change on the file upload
      */
    handleFileUpload() {
      for (const file of this.$refs.fileattachment.files) {
        if (file.size <= this.sizeLimit) {
          this.files.push(file);
        } else {
          this.sizeWarning = true;
        }
      }
    },
    warnOff() {
      this.sizeWarning = false;
    }
  },
  mounted() {
    this.browser = detect();

    if (this.question.response != null) {
      this.question.response.value.forEach(item => {
        this.files.push(item);
        this.uppedFiles.push(item.name);
        this.fileIDs.push(item.uidFile);
      });
    }
  }
};
</script>
<style>
/* #158D2A le vert de couleur verte */

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
@-webkit-keyframes fileAppears {
  form {
    margin-top: -2em;
  }
  to {
    margin-top: 0em;
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

.fileName,
.fileTitle {
  text-overflow: ellipsis;
  overflow-x: hidden;
  max-width: 15em;
  display: inline-block;
  text-indent: 0.5em;
}
#fileUpload
  > div.panelDown.down
  > div.fileParent
  > div.file
  > div.msgUpd
  > span:nth-child(2) {
  display: inline-block;
  vertical-align: top;
  text-indent: 0.4em;
}
div#fileUpload {
  margin: auto;
  width: 35rem;
  display: inline-block;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
div#fileUpload label.headLabel {
  width: 50%;
  display: inline-block;
  height: 3rem;
  position: relative;
  background-color: #efefef;
  z-index: 1;
  transition: all 0.5s;
  text-overflow: ellipsis;
  overflow: hidden;
}
div#fileUpload label.headLabel > div {
  cursor: pointer;
  display: inline-block;
  color: #717171;
  width: 69%;
  line-height: 3rem;
}
div#fileUpload label.headLabel.loaded {
  width: 35%;
  display: inline-block;
  height: 2rem;
  position: relative;
  background-color: white;
  margin-bottom: 1em;
  border-radius: 0.5em;
  border: 0.1em #d20000 solid;
}
div#fileUpload label.headLabel.loaded > div {
  cursor: pointer;
  display: inline-block;
  color: #bb1515;
  width: 69%;
  line-height: 2rem;
}
div#fileUpload > div.panelDown {
  background-color: #e8e8e8;
  width: 20em;
  margin: 0 auto;
  color: #8b8b8b;
  z-index: 1;
  position: relative;
  overflow: hidden;
}
div#fileUpload > div.panelDown > div.fileParent > div.file.upped {
  margin-left: 0em;
}
div.fileSent {
  background-color: #636363;
  color: white;
}
div.deleteFile {
  background-color: black;
  color: #ccc;
  line-height: 1.4em;
  font-size: 0.7em;
  position: absolute;
}
div#fileUpload > div.panelDown > div.fileParent > div.file > div {
  position: relative;
}
div#fileUpload > div.panelDown > div.fileParent > div.file div > div.closeBtn {
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
  -webkit-transition: 0.5s;
  transition: 0.5s;
  position: absolute;
  right: 0.5em;
  top: 0.5em;
  text-indent: initial;
}
div#fileUpload > div.panelDown > div.file > div.fileTitle {
  color: #404040;
  background-color: #d7d7d7;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  text-indent: 0.8em;
}
#fileUpload > div.panelDown.down > div.fileParent > div.file > * {
  height: 2em;
  line-height: 2em;
}
#fileUpload > div.panelDown.down > div.fileParent > div.file > div.msgUpd {
  height: 1.9em;
  line-height: 2em;
  color: #bb1515;
  background-color: #fff;
  border-bottom: 1px solid #bb1515;
  max-width: 18em;
}
div.submitGrid {
  display: grid;
  grid-template-rows: 2em 2em;
  transition: 0.5s;
  cursor: pointer;
}
div.submitGrid.sent {
  margin-top: -2em;
}
div.submitGrid.sent:hover {
  margin-top: -2.9em;
}
div.submitFile {
  background-color: #bb1515;
  color: white;
  cursor: pointer;
  transition: 0.5s all;
}
div.submitFile:hover {
}

#fileUpload > div.panelDown > div.fileParent {
  display: grid;
  grid-template-columns: 15em 5em;
  height: 2em;
  margin-top: -2em;
  line-height: 2em;
  animation: 0.5s fileAppears forwards;
  overflow: hidden;
}
div#fileUpload > div.panelDown > div.fileParent > div.file {
  background-color: #d7d7d7;
  white-space: nowrap;
  display: grid;
  margin-left: -15em;
  opacity: 1;
  z-index: -1;
  grid-template-columns: 15em 15em;
  transition: all 0.25s;
}
.sizeWarnClass {
  margin: 1em;
  color: #bb1515;
  opacity: 0;
  transition: 0.25s;
}
.warnAppear {
  opacity: 1;
  animation: shake 0.5s;
}
div#fileUpload > label > input#attachment {
  display: none;
}
div.ieStyle input {
  border: inherit;
  border-bottom: inherit;
  background-color: inherit;
  text-align: inherit;
  font-size: inherit;
  padding: inherit;
  font-weight: inherit;
  color: inherit;
}
div.ieFiles {
  margin: 10px auto;
}
div.ieFiles div {
  margin-right: 10px;
}
div.ieFiles > div:last-child {
  color: #bb1515;
}
div.ieFiles > * {
  display: inline-block;
}
</style>
