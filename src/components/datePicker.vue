<template>
  <div>
    <vueDatePicker v-if="inptType=='BIRTHDAY'" class="datePickr" :language="fr" :format="'dd/MM/yy'" @input="select(dateTime,question.id)" v-model="dateTime" />
    <vueDatePicker v-if="inptType=='DATE'" class="datePickr" :language="fr" :format="'yy MMMM yyyy'" @input="select(dateTime,question.id)" v-model="dateTime" />
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
    },
    inptType: {
      type: String,
      default: () => ""
    }
  },
  data() {
    return {
      fr: fr,
      dateTime: null
    }
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
