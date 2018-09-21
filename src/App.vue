<template>
  <div id="app">
    <PageButtons v-show="!isConfirmed && isOpen" :page="extObj.pages" :rootPage="parseInt($route.params.rootPage)" @scan="checkForm()" v-model="rootPage" @pageSelected="changePage" />

    <div class="bannerImg" v-tooltip="'TEST'" :style="{ backgroundImage: 'url(' + extObj.pic + ')' }">

    </div>
    <h1>{{extObj.title}}</h1>
    <h2 v-show="isOpen">{{extObj.subTitle}}</h2>
    <h2 v-show="!isOpen">{{extObj.closureMsg}}</h2>

    <p v-show="!isConfirmed && isOpen">{{extObj.description}}</p>
    <p v-show="isConfirmed">{{extObj.confirmMsg}}</p>

    <PageHolder v-show="sessionVars.rootPage==page.number && !isConfirmed && isOpen" :page="page" :key="page.number" :id="page.number" v-for="page in extObj.pages">
      <div class="themeTitle">{{ page.questions[0].theme }}</div>

      <QuestionHolder :id="questions.id" :question="questions" v-for="questions in
        page.questions" v-show="!questions.isHiding ||
      show.includes(questions.id)" :key="questions.id">

        <PillButtons @responseInput="postResponse($event)" v-if="(questions.type=='LISTE' || questions.type=='BOOL')" :question="questions" />
        <VueStars @responseInput="postResponse($event)" v-if="questions.type=='STARS'" :question="questions"></VueStars>

        <Range type="range" @responseInput="postResponse($event)" v-if="questions.type=='RANGE'" :question="questions" />

        <CheckBoxes @responseInput="postResponse($event)" v-if="questions.type=='MULTI' || questions.type=='SIMPLE' " :question="questions" />
        <DatePicker @responseInput="postResponse($event)" :question="questions" v-if="(questions.type=='DATE' || questions.type=='BIRTHDAY')" />

        <typeInput :tooltip="questions.toolTip" @responseInput="postResponse($event)" v-if="questions.type=='NUM' || questions.type=='TEXT' ||
        questions.type=='MEMO'" v-model="input" :question="questions" />

        <VueSignature @responseInput="postResponse($event)" v-if="questions.type=='CAPTURE'" id="signature" ref="signaturePad" height="200px" width="50%">

        </VueSignature>

      </QuestionHolder>

    </PageHolder>
    <PageHolder v-show="isConfirmed " :closeMsg="extObj.closureMsg" />
    <PageButtons v-show="!isConfirmed && isOpen" :page="extObj.pages" :rootPage="parseInt($route.params.rootPage)" v-model="rootPage" @pageSelected="changePage" @scan="checkForm()" />
    <PageBrowser v-show="!isConfirmed && isOpen" :pagesNumber="pagesNumber" v-model="rootPage" :rootPage="parseInt(rootPage)" @pageSelected="pageIncrement" @formConfirmed="finalPost()" @scan="checkForm()"></PageBrowser>
    <div class="pwrBy">Powered by Eudonet</div>
  </div>

</template>

<script>
import PageButtons from "./components/pageButtons.vue";
import PageHolder from "./components/pageHolder.vue";
import PillButtons from "./components/pillButtons.vue";
import QuestionHolder from "./components/questionHolder.vue";
import CheckBoxes from "./components/checkBoxes.vue";
import DatePicker from "./components/datePicker.vue";
import VueSignature from "vue-signature-pad";
import VueStars from "./components/Stars.vue";
import Range from "./components/typeRange.vue";
import typeInput from "./components/typeInput.vue";
import PageBrowser from "./components/pageBrowser.vue";

import datePickerVue from "./components/datePicker.vue";
import sessionVars from './store/GlobalContextInfos';

export default {
  name: "App",
  components: {
    PageButtons,
    PageHolder,
    PillButtons,
    CheckBoxes,
    DatePicker,
    VueSignature,
    QuestionHolder,
    VueStars,
    Range,
    typeInput,
    PageBrowser
  },
  data() {
    return {
      input: null,

      dateInput: null,

      extObj: {},
      prevResponses: {},

      urlHeader: {},
      urlLocation: "",

      rootPage: sessionVars.rootPage,
      pagesNumber: 0,
      modelPage: 1,

      ifDisplay: [],
      show: [],
      objFormat: {},

      isConfirmed: false,
      isOpen: true,

      debugMode: true
    };
  },
  methods: {
    checkForm() {
      console.log("emit");

      sessionVars.errors = [];

      this.extObj.pages[sessionVars.rootPage - 1].questions.forEach(
        question => {
          if (question.required) {
            if (question.response == null || undefined || "")
              sessionVars.errors.push({
                id: question.id,
                question: question.question
              });
          }
        }
      );

      if (sessionVars.errors.length != 0) {
        this.$scrollTo(
          document.getElementById(sessionVars.errors[0].id),
          500,
          {
            force: false,
            offset: -300
          }
        );
      } else {
        sessionVars.confirmed = true;
      }
    },

    showQuestion() {
      console.log("ShowQuestion");
      // Liste des ID de question à dévoiler
      let buffer = [];
      this.pagesNumber = 0;

      if (this.isDisplay == undefined) {
        this.extObj.pages.forEach(page => {
          this.pagesNumber++;
          // Parcours des questions
          page.questions.forEach(question => {
            if (question.lnkQuestion != null) {
              let ids = [];
              question.lnkResponse.forEach(element => {
                ids.push(element.id);
              });
              //Stockage de toutes les questions concernées dans un tableau de référence
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
        // Parcours des questions
        page.questions.forEach(question => {
          // Filtrage
          let scan = [];
          if (question.response != null) {
            if (question.type.includes("LISTE")) {
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
                // Inscription au buffer
                // Si l'id concerné est contenu dans le tableau
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
      console.log("FinalPost");
      this.$http
        .post(
          this.urlLocation +
            "/specif/EUDO_EXTENSION_ENQUETE/root/SectionORM/modules/enquete/services/" +
            "confirm?" +
            sessionVars.tokenName +
            "=" +
            encodeURIComponent(sessionVars.tokenValue),
          JSON.stringify(this.objFormat)
        )
        .then(httpResp => {
          console.log(httpResp);
          if (httpResp.data.confirmed) {
            this.isConfirmed = httpResp.data.confirmed;
          }
        });
    },
    postResponse(response, id) {
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
          this.urlLocation +
            "/specif/EUDO_EXTENSION_ENQUETE/root/SectionORM/modules/enquete/services/" +
            "answer?" +
            sessionVars.tokenName +
            "=" +
            encodeURIComponent(sessionVars.tokenValue),
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
    changePage(currentPage) {
      sessionVars.rootPage = currentPage.number;
    },
    pageIncrement(page) {
      sessionVars.rootPage = page;
    }
  },
  mounted() {
    if (!this.debugMode) {
      this.urlLocation = window.urlLocation;
    } else {
      this.urlLocation = "http://pno-pc.levallois.eudoweb.com";
    }

    sessionVars.rootPage = parseInt(this.$route.params.rootPage);

    if (this.$route.query.auth) {
      console.log("auth");
      // l'utilisateur est authentifié : le token ne change pas
      sessionVars.tokenName = "auth";
      sessionVars.tokenValue = this.$route.query.auth;
    } else if (this.$route.query.ano) {
      sessionVars.tokenName = "ano";
      sessionVars.tokenValue = this.$route.query.ano;
    } else {
      console.log("com");
      // l'utilisateur est anonyme : le token change au premier appel
      sessionVars.tokenName = "com";
      sessionVars.tokenValue = this.$route.query.com;
    }

    console.log(this.$route.query);

    this.$http
      .get(
        this.urlLocation +
          "/specif/EUDO_EXTENSION_ENQUETE/root/SectionORM/modules/enquete/services/survey?" +
          sessionVars.tokenName +
          "=" +
          encodeURIComponent(sessionVars.tokenValue)
      )
      .then(
        console.log(
          this.urlLocation +
            "/specif/EUDO_EXTENSION_ENQUETE/root/SectionORM/modules/enquete/services/survey?" +
            sessionVars.tokenName +
            "=" +
            encodeURIComponent(sessionVars.tokenValue)
        )
      )
      .then(response => {
        this.extObj = response.data;
        this.prevResponses = response.data.responses;

        let nowDate = new Date();
        if (
          nowDate.toISOString() >= response.data.start &&
          nowDate.toISOString() <= response.data.end
        ) {
          console.log(Date());
          this.isOpen = true;
        } else {
          this.isOpen = false;
        }
        sessionVars.tokenName = response.data.NameKey;
        sessionVars.tokenValue = response.data.ValueKey;
        this.showQuestion(null);
        console.log("succes");
      })
      .catch(error => {
        console.log(error);
        this.errored = true;
      })
      .finally(() => (this.loading = false));
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
div.bannerImg {
  height: 26vw;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  margin: 0 auto;
}
div.questionsHolder > div#signature {
  margin: 0 auto;
  border: none;
  border-bottom: 1px solid #bb1515;
  background-color: #efefef;
  text-align: center;
  font-size: 1.4em;
  padding: 0.2em;
  font-weight: bold;
  color: #636363;
}

.questionsHolder {
  margin: 2em 0;
  opacity: 1;
}
::placeholder {
  opacity: 0.5;
  font-size: 0.8em
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
  box-shadow: 0 5px 30px rgba(black, .1);
}

.tooltip.popover .popover-arrow {
  border-color: #f9f9f9;
}

.tooltip[aria-hidden='true'] {
  visibility: hidden;
  opacity: 0;
  transition: opacity .15s, visibility .15s;
}

.tooltip[aria-hidden='false'] {
  visibility: visible;
  opacity: 1;
  transition: opacity .15s;
}
</style>
