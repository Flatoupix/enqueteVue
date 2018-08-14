<template>
  <div id="app">

    <PageButtons :page="extObj.pages" @pageSelected="page" />
    <!-- <image/> -->
    <div class="bannerImg">{{extObj.image}}</div>
    <h1>{{extObj.title}}</h1>
    <h2>{{extObj.subTitle}}</h2>
    {{extObj.description}}

    <PageHolder v-if="rootPage==page.number" :page="page" :key="page.number" :id="page.number" v-for="page in extObj.pages">

      <div class="themeTitle">{{ page.questions[0].theme }}</div>

      <QuestionHolder :question="questions" v-for="questions in page.questions" :key="questions.id">

        <PillButtons @responseInput="postResponse($event)" v-if="questions.type=='LISTE'" :question="questions" />

        <CheckBoxes @responseInput="postResponse($event)" v-if="questions.type=='MULTI'" :question="questions" />

        <Datepicker :idQuestion="questions.id" v-if="questions.type=='DATE'||questions.type=='BIRTHDAY'" class="datePickr" v-model="dateInput" @change="upDate" :language="fr" />

        <input :idQuestion="questions.id" type="Number" v-if="questions.type=='NUM'" />

        <VueSignature :idQuestion="questions.id" v-if="questions.type=='CAPTURE'" id="signature" ref="signaturePad" height="200px" width="50%" />

        <textarea :idQuestion="questions.id" v-if="questions.type=='MEMO'" />

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
import Datepicker from "vuejs-datepicker";
import { fr } from "vuejs-datepicker/dist/locale";
import VueSignature from "vue-signature-pad";

export default {
  remoteUse: true,
  name: "App",
  components: {
    PageButtons,
    PageHolder,
    PillButtons,
    CheckBoxes,
    Datepicker,
    VueSignature,
    QuestionHolder
  },
  data() {
    return {
      dateInput: null,
      extObj: {},
      rootPage: 1,
      fr: fr
    };
  },
  methods: {
    postResponse(response) {
      console.log(response);
      this.$http
        .post(
          "http://" +
            (this.remoteUse ? "localhost" : "pno-pc.levallois.eudoweb.com") +
            "/specif/EUDO_MODULE_ENQUETE/root/SectionORM/modules/enquete/" +
            "services/answer?com=Xela17fFtoxfis%2fafICQlXqRyeNKt1AsKDIOaYXZuzg%3d",
          JSON.stringify(response)
        )
        .then(httpresp => {
          //console.log(httpresp)
          alert("succes");
        })
        .catch(error => {
          alert("en erreur");
        });
        //response.id = questionId,
        //console.log(response)
    },
    page(currentPage) {
      this.rootPage = currentPage.number;
    },
    update() {
      console.log("youpi");
    }
  },
  mounted() {
    this.$http
      .get(
        "http://" +
          (this.remoteUse ? "localhost" : "pno-pc.levallois.eudoweb.com") +
          "/specif/EUDO_MODULE_ENQUETE/root/SectionORM/modules/enquete/services/survey?com=Xela17fFtoxfis%2fafICQlXqRyeNKt1AsKDIOaYXZuzg%3d"
      )
      .then(response => {
        this.extObj = response.data;
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

.datePickr {
  margin: 0 auto;
  display: block;
  text-align: center;
  width: 300px;
}
.questionsHolder {
  margin: 2em 0;
}

.questionsHolder > input[type="Number"] {
  font-size: 1.8em;
  width: 2.5em;
  padding: 0.2em 0.2em;
}
div.questionsHolder > div#signature {
  margin: 0 auto;
}
div.questionsHolder > textarea {
  text-align: left;
  width: 100%;
  height: 3em;
  font-size: 1.5em;
}
.questionsHolder > input,
.datePickr > div > input,
.questionsHolder > div#signature,
textarea,
textarea:focus {
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
