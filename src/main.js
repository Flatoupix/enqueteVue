// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import router from "./router";
import App from "./App";
import sessionVars from "./store/GlobalContextInfos";
import axios from "axios";
import VueScrollTo from "vue-scrollto";

Vue.prototype.$http = axios;
Vue.use(VueScrollTo);

Vue.prototype.sessionVars = sessionVars;
Vue.config.productionTip = false;

Vue.use(VueScrollTo, {
  container: "body",
  duration: 500,
  easing: "linear",
  offset: 0,
  force: false,
  cancelable: true,
  onStart: false,
  onDone: false,
  onCancel: false,
  x: false,
  y: true
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: {
    App
  },
  template: "<App/>"
});
