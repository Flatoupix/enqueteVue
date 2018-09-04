<template>
  <div>
    <vueDatePicker v-if="question.type=='BIRTHDAY'" class="datePickr" :language="fr" :initialView="'year'" @input="select(dateTime,question.id)" v-model="dateTime" />
    <vueDatePicker v-if="question.type=='DATE'" class="datePickr" :class="datePickr" :language="fr" @input="select(dateTime,question.id)" v-model="dateTime" />

  </div>
</template>
<style>
</style>

<script>
import vueDatePicker from "vuejs-datepicker";
import { fr } from "vuejs-datepicker/dist/locale";

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
    if (this.question.reponse != "") {
      this.savedChoice = this.question.response.value;
    } else {
      this.savedChoice = null;
    }
    return {
      fr: fr,
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
