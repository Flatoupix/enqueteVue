import Vue from 'vue';
import Vuetify, { VFileInput } from 'vuetify/lib';
import fr from 'vuetify/es5/locale/fr';

Vue.use(Vuetify, { VFileInput });

export default new Vuetify({
  lang: {
    locales: { fr },
    current: 'fr',
  },
});
