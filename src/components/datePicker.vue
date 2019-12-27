<template>
  <div>
    <vueDatePicker v-tooltip="question.toolTip" :placeholder="question.watermark" :required="question.required" v-if="question.type=='BIRTHDAY'" class="datePickr" :language="locales[$sessionVars.selectedLang.codeLang.toLowerCase()]" :initialView="'year'" @input="select(dateTime,question.id)" v-model="dateTime" />
    <vueDatePicker v-tooltip="question.toolTip" :placeholder="question.watermark" :required="question.required" v-if="question.type=='DATE'" class="datePickr" :language="locales[$sessionVars.selectedLang.codeLang.toLowerCase()]" @input="select(dateTime,question.id)" v-model="dateTime" />

  </div>
</template>
<style>
</style>

<script>
import vueDatePicker from "vuejs-datepicker";
import * as locales from "vuejs-datepicker/dist/locale";

export default {
  name: "DatePicker",
  components: {
    vueDatePicker
  },
  props: {
    question: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    if (this.question.response != null) {
      this.savedChoice = this.question.response.value;
    } else {
      this.savedChoice = null;
    }

    return {
      locales:locales,
      dateTime: this.savedChoice
    };
  },
  methods: {
    select(response, id) {
      this.$emit("responseInput", {
        idQuestion: id,
        value: response
      });
    }
  }
};
</script>
<style>
.datePickr {
  margin: 0 auto;
  display: block;
  text-align: center;
  width: 300px;
}
</style>
