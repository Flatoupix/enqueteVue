<template>
  <div id="app">
    <PageButtons :page="extObj.pages" :rootPage="parseInt($route.params.rootPage)" @pageSelected="page" />
    <!-- <image/> -->
    <div class="bannerImg">
      <image :src="extObj.pic" />
    </div>
    <h1>{{extObj.title}}</h1>
    <h2>{{extObj.subTitle}}</h2>
    {{extObj.description}}

    <PageHolder v-show="rootPage==page.number" :page="page" :key="page.number" :id="page.number" v-for="page in extObj.pages">

      <div class="themeTitle">{{ page.questions[0].theme }}</div>

      <QuestionHolder :question="questions" v-for="questions in page.questions" v-show="!questions.isHiding ||
      show.includes(questions.id)"
      :key="questions.id">

        <PillButtons @responseInput="postResponse($event)" v-if="(questions.type=='LISTE' || questions.type=='BOOL')" :question="questions" />
        <VueStars @responseInput="postResponse($event)" v-if="questions.type=='STARS'" :question="questions"></VueStars>

        <Range type="range" @responseInput="postResponse($event)" v-if="questions.type=='RANGE'" :question="questions" />

        <CheckBoxes @responseInput="postResponse($event)" v-if="questions.type=='MULTI' || questions.type=='SIMPLE' " :question="questions" />

        <DatePicker @responseInput="postResponse($event)" :question="questions" v-if="(questions.type=='DATE' || questions.type=='BIRTHDAY')" />

        <typeInput @responseInput="postResponse($event)" v-if="questions.type=='NUM' || questions.type=='TEXT' ||
        questions.type=='MEMO'" v-model="input" :question="questions" />

        <VueSignature @responseInput="postResponse($event)" v-if="questions.type=='CAPTURE'" id="signature" ref="signaturePad" height="200px" width="50%">

        </VueSignature>

      </QuestionHolder>
   
    </PageHolder>

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
    typeInput
  },
  data() {
    return {
      input: null,

      dateInput: null,
      remoteUse:
        // "nla2-pc.levallois.eudoweb.com",
        "pno-pc.levallois.eudoweb.com",
      extObj: {},
      prevResponses: {},
      urlHeader: {},
      tokenName: null,
      tokenValue: null,
      rootPage: 1,
      ifDisplay: [],
      show: []
    };
  },
  methods: {
    showQuestion() {
      console.log("ShowQuestion");
      // Liste des ID de question à dévoiler
      let buffer = [];

      if (this.isDisplay == undefined) {
        this.extObj.pages.forEach(page => {
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

    postResponse(response, id) {
      let objFormat = {};
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
          "http://" +
            this.remoteUse +
            "/specif/EUDO_MODULE_ENQUETE/root/SectionORM/modules/enquete/services/" +
            "answer?" +
            this.tokenName +
            "=" +
            encodeURIComponent(this.tokenValue),
          JSON.stringify(this.objFormat)
        )
        .then(httpresp => {
          // Parcours des pages
        
            this.extObj.pages.forEach(page => {
              // Parcours des questions
              page.questions.forEach(question => {
                if (question.id == this.objFormat.idQuestion && question.response != null) {
                  question.response.value = this.objFormat.value
                }
              })
            })
          
          console.log("succes");
          this.showQuestion(null);
        })
        .catch(error => {
          console.log("en erreur");
        });
    },
    page(currentPage) {
      this.rootPage = currentPage.number;
    }
  },
  mounted() {
    this.rootPage = this.$route.params.rootPage;

    if (this.$route.query.auth) {
      console.log("auth");
      // l'utilisateur est authentifié : le token ne change pas
      this.tokenName = "auth";
      this.tokenValue = this.$route.query.auth;
    } else if (this.$route.query.ano) {
      this.tokenName = "ano";
      this.tokenValue = this.$route.query.ano;
    } else {
      console.log("com");
      // l'utilisateur est anonyme : le token change au premier appel
      this.tokenName = "com";
      this.tokenValue = this.$route.query.com;
    }

    console.log(this.$route.query);

    this.$http
      .get(
        "http://" +
          this.remoteUse +
          "/specif/EUDO_MODULE_ENQUETE/root/SectionORM/modules/enquete/services/survey?" +
          this.tokenName +
          "=" +
          encodeURIComponent(this.tokenValue)
      )
      .then(
        console.log(
          "http://" +
            this.remoteUse +
            "/specif/EUDO_MODULE_ENQUETE/root/SectionORM/modules/enquete/services/survey?" +
            this.tokenName +
            "=" +
            encodeURIComponent(this.tokenValue)
        )
      )
      .then(response => {
        this.extObj = response.data;
        this.prevResponses = response.data.responses;
        this.tokenName = response.data.NameKey;
        this.tokenValue = response.data.ValueKey;
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
textarea {
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
</style>
