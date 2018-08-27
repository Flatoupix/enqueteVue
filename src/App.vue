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

        <Range  type="range" @responseInput="postResponse($event)" v-if="questions.type=='RANGE'" :question="questions"/>
        <CheckBoxes @responseInput="postResponse($event)" v-if="questions.type=='MULTI'" :question="questions" />

        <DatePicker @responseInput="postResponse($event)" :inptType="questions.type" :question="questions" />

        <input @input="postResponse(inputNum,questions.id)" v-model="inputNum" type="Number" v-if="questions.type=='NUM'" />

        <VueSignature v-if="questions.type=='CAPTURE'" id="signature" ref="signaturePad" height="200px" width="50%">
          <button @click="save()">Save</button>
        </VueSignature>

        <textarea @input="postResponse(inputText, questions.id)" v-model="inputText" v-if="questions.type=='MEMO'" />

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
    Range
  },
  data() {
    return {
      inputText: null,
      inputNum: null,
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
      // jsonKey: {
      //   ano:
      //     "ano=xErR2%2BcLW5hpdgwad68nmeOYZxxApVN%2Fd4r%2FNmAcbH7uUvWRzRCN%2Bslc1N8ZKC9UtjeMvI6%2F7Pz88lv3CJyOC3MzEGodznO9h1BJvbESa84%3D",
      //   com: "com=Xela17fFtozsh5eQ34Dto5sNO%2BBWOO%2Fs7zXcjV%2FhU38%3D"
      // },
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
