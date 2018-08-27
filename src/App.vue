<template>
  <div id="app">

    <PageButtons :page="extObj.pages" :rootPage="rootPage" @pageSelected="page" />
    <!-- <image/> -->
    <div class="bannerImg">
      <image :src="extObj.pic" />
    </div>
    <h1>{{extObj.title}}</h1>
    <h2>{{extObj.subTitle}}</h2>
    {{extObj.description}}

    <PageHolder v-show="rootPage==page.number" :page="page" :key="page.number" :id="page.number" v-for="page in extObj.pages">

      <div class="themeTitle">{{ page.questions[0].theme }}</div>

      <QuestionHolder :question="questions" v-for="questions in page.questions" :key="questions.id">

        <PillButtons @responseInput="postResponse($event)"
        v-if="questions.type=='LISTE'" :question="questions" />

        <VueStars @responseInput="postResponse($event)" v-if="questions.type=='STARS'" :question="questions" ></VueStars>

        <Range  type="range" @responseInput="postResponse($event)"
        v-if="questions.type=='RANGE'" :question="questions"/>
        
        <CheckBoxes @responseInput="postResponse($event)"
        v-if="(questions.type=='CHECKBOX' &&  questions.type=='MULTI')"
        :question="questions" />
        

        <DatePicker @responseInput="postResponse($event)" :inptType="questions.type" :question="questions" v-if="(questions.type=='DATE' || questions.type=='BIRTHDAY')"/>

        <typeInput @responseInput="postResponse($event)"
        v-if="questions.type=='NUM' || questions.type=='TEXT' ||
        questions.type=='MEMO'" v-model="input" :question="questions"/>
     

        <VueSignature v-if="questions.type=='CAPTURE'" id="signature" ref="signaturePad" height="200px" width="50%">
          <button @click="save()">Save</button>
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
import typeInput from "./components/typeInput.vue"


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
        // "localhost"
        "nla2-pc.levallois.eudoweb.com"
        // "pno-pc.levallois.eudoweb.com"
      ,
      extObj: {},
      urlHeader: {},

      tokenName: null,
      tokenValue: null,
      rootPage: 1
    };
  },
  methods: {
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
      console.log(this.objFormat);
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
          console.log("succes");
  
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
      ).then(console.log( "http://" +
          this.remoteUse +
          "/specif/EUDO_MODULE_ENQUETE/root/SectionORM/modules/enquete/services/survey?" +
          this.tokenName +
          "=" +
          encodeURIComponent(this.tokenValue)))
      .then(response => {
        this.extObj = response.data;
        this.tokenName = response.data.NameKey;
        this.tokenValue = response.data.ValueKey;
    
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

.questionsHolder {
  margin: 2em 0;
}
div.questionsHolder > div#signature {
  margin: 0 auto;
}

.questionHolder > input[type="range"]::-webkit-slider-runnable-track {
    box-shadow: none;
    border: none;
    background: transparent;
    -webkit-appearance: none;
}

.questionHolder > input[type="range"]::-webkit-slider-thumb {
    width: 20px;
    height: 20px;
    border: 0;
    background-color: #f89406;
    transform: rotate(45deg);
    box-shadow: 0 0 1px 0px rgba(0, 0, 0, 0.1);
    -webkit-appearance: none;
}
</style>
