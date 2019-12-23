// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import router from "./router";
import App from "./App";
import axios from "axios";
import VueScrollTo from "vue-scrollto";
import VTooltip from "v-tooltip";
import { VueReCaptcha } from "vue-recaptcha-v3";

Vue.prototype.$http = axios;
Vue.use(VTooltip, {
  // Default tooltip placement relative to target element
  defaultPlacement: "top",
  // Default CSS classes applied to the tooltip element
  defaultClass: "vue-tooltip-theme",
  // Default CSS classes applied to the target element of the tooltip
  defaultTargetClass: "has-tooltip",
  // Selector used to get the arrow element in the tooltip template
  defaultArrowSelector: ".tooltip-arrow, .tooltip__arrow",
  // Selector used to get the inner content element in the tooltip template
  defaultInnerSelector: ".tooltip-inner, .tooltip__inner",
  // Delay (ms)
  defaultDelay: 500,
  // Default events that trigger the tooltip
  defaultTrigger: "hover focus",
  // Default position offset (px)
  defaultOffset: 0,
  // Default container where the tooltip will be appended
  defaultContainer: "body",
  defaultBoundariesElement: undefined,
  defaultPopperOptions: {},
  // Class added when content is loading
  defaultLoadingClass: "tooltip-loading",
  // Displayed when tooltip content is loading
  defaultLoadingContent: "...",
  // Hide on mouseover tooltip
  autoHide: true,
  // Close tooltip on click on tooltip target?
  defaultHideOnTargetClick: true,
  // Auto destroy tooltip DOM nodes (ms)
  disposeTimeout: 500
});
Vue.use(VueScrollTo, {
  container: "body",
  duration: 500,
  easing: "ease",
  offset: 0,
  force: false,
  cancelable: true,
  onStart: false,
  onDone: false,
  onCancel: false,
  x: false,
  y: true
});

Vue.prototype.$sessionVars = {
  urlLocation: window.location.origin,
  tokenName: null,
  tokenValue: null,
  servicePath: "services/",
  serviceName: "",
  rootPage: 1,
  pagesNumber: 0,
  modelPage: 1,
  errors: [],

  signed: false,

  currentTheme: null,

  confirmed: false,
  buttonNext:null,
  buttonSubmit:null
};
Vue.config.productionTip = false;
Vue.config.devtools = true;
Vue.use(VueReCaptcha)
/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
