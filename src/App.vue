<template>
  <div id="app" @click.ctrl="darkTime()">
    <div class="badToken" v-if="errored">
      <h2>Une erreur est survenue.</h2>
    </div>
    <div v-if="loaded && !errored">
      <PageButtons
        v-show="!isConfirmed && isOpen && pagesNumber > 1"
        :page="extObj.pages"
        :rootPage="parseInt($route.params.rootPage)"
        @scan="checkForm()"
        v-model="$sessionVars.rootPage"
        @refresh="refreshPage"
      />

      <img
        v-show="$sessionVars.rootPage == 1 && extObj.pic != null"
        :src="extObj.pic"
      />
      <h1 v-show="$sessionVars.rootPage == 1">{{ extObj.title }}</h1>
      <h2 v-show="isOpen && $sessionVars.rootPage == 1">
        {{ extObj.subTitle }}
      </h2>
      <h2 v-show="!isOpen" v-html="extObj.closureMsg"></h2>

      <p
        v-show="!isConfirmed && isOpen && $sessionVars.rootPage == 1"
        v-html="extObj.description"
      ></p>
      <p v-show="isConfirmed" v-html="extObj.confirmMsg"></p>

      <PageHolder
        v-show="$sessionVars.rootPage == page.number && !isConfirmed && isOpen"
        :page="page"
        :key="page.number"
        :id="page.number"
        v-for="page in extObj.pages"
      >
        <QuestionHolder
          :id="questions.id"
          :question="questions"
          v-for="questions in page.questions"
          v-show="!questions.isHiding || show.includes(questions.id)"
          :key="questions.id"
        >
          <PillButtons
            @responseInput="postResponse($event)"
            v-if="questions.type == 'LISTE' || questions.type == 'BOOL'"
            :question="questions"
          />
          <VueStars
            @responseInput="postResponse($event)"
            v-if="questions.type == 'STARS'"
            :question="questions"
          ></VueStars>

          <Range
            type="range"
            @responseInput="postResponse($event)"
            v-if="
              questions.type == 'RANGE' && page.number == $sessionVars.rootPage
            "
            :question="questions"
          />

          <CheckBoxes
            @responseInput="postResponse($event)"
            v-if="questions.type == 'MULTI' || questions.type == 'SIMPLE'"
            :question="questions"
          />
          <DatePicker
            @responseInput="postResponse($event)"
            :question="questions"
            v-if="questions.type == 'DATE' || questions.type == 'BIRTHDAY'"
          />

          <typeInput
            :tooltip="questions.toolTip"
            @responseInput="postResponse($event)"
            v-if="
              questions.type == 'NUM' ||
                questions.type == 'TEXT' ||
                questions.type == 'MEMO'
            "
            v-model="input"
            :question="questions"
          />

          <typeSignature
            ref="captureType"
            v-if="
              questions.type == 'CAPTURE' &&
                page.number == $sessionVars.rootPage
            "
            @responseInput="postCapture($event)"
            :question="questions"
          />

          <file-input
            v-if="questions.type == 'FILE'"
            @responseInput="postFile($event)"
            :question="questions"
          />
        </QuestionHolder>
      </PageHolder>
      <PageHolder v-show="isConfirmed" :closeMsg="extObj.closureMsg" />
      <PageBrowser
        v-show="!isConfirmed && isOpen"
        :pagesNumber="pagesNumber"
        v-model="rootPage"
        :rootPage="parseInt(rootPage)"
        @refresh="refreshPage"
        @formConfirmed="finalPost()"
        @scan="checkForm()"
      ></PageBrowser>
      <div>
        <div v-if="!extObj.footForm" class="pwrBy">Powered by Eudonet</div>
        <div v-else v-html="extObj.footForm"></div>
      </div>
    </div>
    <div class="loadContainer" v-if="!loaded">
      <div class="loading"></div>
    </div>
  </div>
</template>

<script>
import PageButtons from "./components/pageButtons.vue";
import PageHolder from "./components/pageHolder.vue";
import PillButtons from "./components/pillButtons.vue";
import QuestionHolder from "./components/questionHolder.vue";
import CheckBoxes from "./components/checkBoxes.vue";
import DatePicker from "./components/datePicker.vue";
import typeSignature from "./components/typeSignature.vue";
import VueStars from "./components/Stars.vue";
import Range from "./components/typeRange.vue";
import typeInput from "./components/typeInput.vue";
import PageBrowser from "./components/pageBrowser.vue";
import fileInput from "./components/fileInput.vue";
import datePickerVue from "./components/datePicker.vue";

export default {
  name: "App",
  components: {
    PageButtons,
    PageHolder,
    PillButtons,
    CheckBoxes,
    DatePicker,
    QuestionHolder,
    typeSignature,
    VueStars,
    Range,
    typeInput,
    fileInput,
    PageBrowser
  },
  data() {
    return {
      input: null,

      dateInput: null,
      extObj: {},
      prevResponses: {},

      urlHeader: {},
      urlLocation: window.location.origin,

      rootPage: this.$sessionVars.rootPage,
      pagesNumber: 0,
      modelPage: 1,

      ifDisplay: [],
      show: [],
      objFormat: {},

      isConfirmed: false,
      isOpen: true,

      loaded: false,
      errored: false,
      debugVars: this.$sessionVars,
      debugMode: false,
      darkMode: false

      // browser: this.Browser
    };
  },
  methods: {
    checkForm() {
      console.log("Check")
      this.$sessionVars.errors = [];

      this.extObj.pages[this.$sessionVars.rootPage - 1].questions.forEach(
        question => {
          console.log('error')
          if (question.type != ("STARS" && "MEMO" && "CAPTURE")) {
            if (question.required) {
              if (this.show.includes(question.id)) {
                if (question.response == null || undefined || "") {
                  this.$sessionVars.errors.push(question.id);
                }
              }
            }
          } else if (question.type == "CAPTURE") {
              if (question.required) {
                if (!this.$sessionVars.signed) {
                  this.$sessionVars.errors.push(question.id);
                }
              }
            }
          }
      );

      if (this.$sessionVars.errors.length != 0) {
        this.$scrollTo(
          document.getElementById(this.$sessionVars.errors[0]),
          500,
          {
            force: false,
            offset: -300
          }
        );
      } else {
        this.$sessionVars.confirmed = true;
      }
    },

    showQuestion() {
      // Liste des ID de question à dévoiler
      let buffer = [];
      this.pagesNumber = 0;

      if (this.ifDisplay.length == 0) {
        this.extObj.pages.forEach(page => {
          // Parcours des questions
          page.questions.forEach(question => {
            if (question.lnkQuestion != null) {
              let ids = [];
              question.lnkResponse.forEach(element => {
                ids.push(element.id);
              });
              //Stockage de toutes les questions concernées dans un tableau de
              //référence
              this.ifDisplay.push({
                id: question.id,
                lnkQuestion: question.lnkQuestion,
                lnkResponse: ids
              });
            }
          });
        });
      }

      // Parcours des pages

      this.extObj.pages.forEach(page => {
        this.pagesNumber++;
        // Parcours des questions
        page.questions.forEach(question => {
          // Filtrage
          let scan = [];
          if (question.response != null) {
            if (
              question.type.includes("LISTE") ||
              question.type.includes("BOOL")
            ) {
              scan = [question.response.value];
            }
            if (
              question.type.includes("MULTI") ||
              question.type.includes("SIMPLE")
            ) {
              scan = question.response.value;
            }

            // Parcours des réponses cochées
            scan.forEach(id => {
              // Parcours des règles d'affichage

              this.ifDisplay.forEach(ifd => {
                // Inscription au buffer Si l'id concerné est contenu dans le
                // tableau
                if (
                  ifd.lnkQuestion == question.id &&
                  ifd.lnkResponse.includes(id)
                ) {
                  buffer.push(ifd.id);
                }
              });
            });
          }
        });
      });

      // Parcours des pages
      this.show = [];
      this.extObj.pages.forEach(page => {
        // Parcours des questions
        page.questions.forEach(question => {
          // Rétention
          if (question.isHiding) {
            if (buffer.includes(question.id)) {
              this.show.push(question.id);
            }
          }
        });
      });
    },
    finalPost() {
      this.objFormat = {
        confirmed: true
      };

      this.$http
        .post(
          "services/confirm?" +
            this.$sessionVars.tokenName +
            "=" +
            encodeURIComponent(this.$sessionVars.tokenValue),
          JSON.stringify(this.objFormat)
        )
        .then(httpResp => {
          if (httpResp.data.confirmed) {
            this.isConfirmed = httpResp.data.confirmed;
          }
        });
    },
    postResponse(response, id) {
      let serviceLink = "answer?";

      if (typeof response !== "object") {
        this.objFormat = {
          idQuestion: id,
          value: response
        };
      } else {
        this.objFormat = response;
      }
      this.$http
        .post(
          "services/" +
            serviceLink +
            this.$sessionVars.tokenName +
            "=" +
            encodeURIComponent(this.$sessionVars.tokenValue),
          JSON.stringify(this.objFormat)
        )
        .then(httpresp => {
          // Parcours des pages

          this.extObj.pages.forEach(page => {
            // Parcours des questions
            page.questions.forEach(question => {
              if (question.id == this.objFormat.idQuestion) {
                if (question.response == null) {
                  question.response = this.objFormat;
                }
                question.response.value = this.objFormat.value;
                console.log(this.objFormat);
              }
            });
          });

          console.log("succes");
          this.showQuestion(null);
        })
        .catch(error => {
          console.log("en erreur");
        });
    },
    postCapture(response, id) {
      let serviceLink = "capture?";
      this.objFormat = response;
      this.$http
        .post(
          "services/" +
            serviceLink +
            this.$sessionVars.tokenName +
            "=" +
            encodeURIComponent(this.$sessionVars.tokenValue),
          JSON.stringify(this.objFormat)
        )
        .then(httpresp => console.log(httpresp))
        .catch(error => {
          console.log("en erreur");
        });
    },
    postFile(response, id) {
      let serviceLink = "attachment?";
      this.objFormat = response;
      this.$http
        .post(
          "services/" +
            serviceLink +
            this.$sessionVars.tokenName +
            "=" +
            encodeURIComponent(this.$sessionVars.tokenValue),
          JSON.stringify(this.objFormat)
        )
        .catch(error => {
          console.log("en erreur");
        });
    },
    refreshPage(noReload) {
      this.$router.push({
        name: "enquete",
        params: {
          rootPage: this.$sessionVars.rootPage
        }
      });
      if (this.$sessionVars.tokenName == "com") {
        this.$router.push({
          query: {
            com: this.$sessionVars.tokenValue
          }
        });
      } else if (this.$sessionVars.tokenName == "auth") {
        this.$router.push({
          query: {
            auth: this.$sessionVars.tokenValue
          }
        });
      } else if (this.$sessionVars.tokenName == "ano") {
        this.$router.push({
          query: {
            ano: this.$sessionVars.tokenValue
          }
        });
      }
      if (!noReload) {
        // this.$sessionVars.pageRefresh = true
      }
    },
    darkTime() {
      this.darkMode = !this.darkMode;
      if (this.darkMode) {
        window.document.body.style.backgroundColor = "#1b1b1b";
      } else {
        window.document.body.style.backgroundColor = "#ffffff";
      }
    }
  },
  mounted() {
    this.$sessionVars.rootPage = parseInt(this.$route.params.rootPage);
    if (this.$route.query.auth) {
      // l'utilisateur est authentifié : le token ne change pas
      this.$sessionVars.tokenName = "auth";
      this.$sessionVars.tokenValue = this.$route.query.auth;
    } else if (this.$route.query.ano) {
      this.$sessionVars.tokenName = "ano";
      this.$sessionVars.tokenValue = this.$route.query.ano;
    } else {
      console.log("com");
      // l'utilisateur est anonyme : le token change au premier appel
      this.$sessionVars.tokenName = "com";
      this.$sessionVars.tokenValue = this.$route.query.com;
    }

    console.log(this.$route.query);

    this.$http
      .get(
        "services/survey?" +
          this.$sessionVars.tokenName +
          "=" +
          encodeURIComponent(this.$sessionVars.tokenValue)
      )
      .then(
        console.log(
          "services/survey?" +
            this.$sessionVars.tokenName +
            "=" +
            encodeURIComponent(this.$sessionVars.tokenValue)
        )
      )
      .then(response => {
        this.extObj = response.data;
        this.prevResponses = response.data.responses;

        let nowDate = new Date();
        console.log(
          "Aujourd'hui = " +
            nowDate.toLocaleDateString() +
            " " +
            "Date de début = " +
            new Date(response.data.start).toLocaleDateString() +
            "Date de fin = " +
            new Date(response.data.end).toLocaleDateString()
        );
        if (
          nowDate.toISOString() >= response.data.start &&
          nowDate.toISOString() <= response.data.end
        ) {
          console.log(Date());
          this.isOpen = true;
        } else {
          this.isOpen = false;
        }
        this.$sessionVars.tokenName = response.data.NameKey;
        this.$sessionVars.tokenValue = response.data.ValueKey;
        this.showQuestion(null);
        this.refreshPage(true);
        console.log("succes");
      })
      .catch(error => {
        console.log(error);
        this.errored = true;
      })
      .finally(() => (this.loaded = true));
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Cabin|Open+Sans");
:focus {
  border: none;
  outline: none;
}
#app {
  font-family: "Cabin", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 1em;
  max-width: 80%;
  margin: 5em auto;
}

h1,
h2,
h3 {
  font-family: "Open Sans", sans-serif;
  text-align: left;
}
h1 {
  color: #bb1515;
  text-transform: uppercase;
  text-align: inherit;
}
h2 {
  text-align: inherit;
}
.themeTitle {
  font-size: 1.3em;
  text-transform: uppercase;
  color: #bb1515;
  border-bottom: 1px solid #bb1515;
  text-align: left;
  margin: 1.4em auto;
}
input,
textarea,
select {
  border: none;
  border-bottom: 1px solid #bb1515;
  background-color: #efefef;
  text-align: center;
  font-size: 1.4em;
  padding: 0.2em;
  font-weight: bold;
  color: #636363;
}
select {
  color: inherit;
  font-weight: inherit;
}

.questionsHolder {
  margin: 2em 0;
  opacity: 1;
}
::placeholder {
  opacity: 0.5;
  font-size: 0.8em;
}
.pwrBy {
  color: #bb1515;
  font-weight: bold;
  margin-top: 7%;
  float: right;
  margin-right: -12%;
}
.tooltip {
  display: block !important;
  z-index: 10000;
  font-family: Cabin;
}

.tooltip .tooltip-inner {
  background: black;
  color: white;
  border-radius: 16px;
  padding: 5px 10px 4px;
}

.tooltip .tooltip-arrow {
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 5px;
  border-color: black;
  z-index: 1;
}

.tooltip[x-placement^="top"] {
  margin-bottom: 5px;
}

.tooltip[x-placement^="top"] .tooltip-arrow {
  border-width: 5px 5px 0 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  bottom: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="bottom"] {
  margin-top: 5px;
}

.tooltip[x-placement^="bottom"] .tooltip-arrow {
  border-width: 0 5px 5px 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-top-color: transparent !important;
  top: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="right"] {
  margin-left: 5px;
}

.tooltip[x-placement^="right"] .tooltip-arrow {
  border-width: 5px 5px 5px 0;
  border-left-color: transparent !important;
  border-top-color: transparent !important;
  border-bottom-color: transparent !important;
  left: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip[x-placement^="left"] {
  margin-right: 5px;
}

.tooltip[x-placement^="left"] .tooltip-arrow {
  border-width: 5px 0 5px 5px;
  border-top-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  right: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip.popover .popover-inner {
  background: #f9f9f9;
  color: black;
  padding: 24px;
  border-radius: 5px;
  box-shadow: 0 5px 30px rgba(black, 0.1);
}

.tooltip.popover .popover-arrow {
  border-color: #f9f9f9;
}

.tooltip[aria-hidden="true"] {
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.15s, visibility 0.15s;
}

.tooltip[aria-hidden="false"] {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.15s;
}

@keyframes loadLoop {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.loadContainer {
  position: absolute;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
}
.loading {
  width: 10em;
  height: 10em;
  border-radius: 10em;
  border-top-style: dashed;
  border-top-width: 1px;
  border-right-style: dashed;
  border-bottom-style: solid;
  border-left-style: solid;
  border-color: #bb1515;
  border-width: 8pt;
  -webkit-animation: loadLoop infinite 1s;
  animation: loadLoop infinite 1s ease-in-out;
  margin: 40vh auto;
}
.badToken {
  margin: 10em auto;
}
</style>
