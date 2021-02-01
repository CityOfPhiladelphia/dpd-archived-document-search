import BrowserSupport from  "./browser-support.js";
BrowserSupport.isIE();
// import 'core-js';

import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import VueGtag from "vue-gtag";

import router from './router';


Vue.config.productionTip = false;


Vue.use(VueGtag, {
  config: { id: "UA-860026-1" },
  appName: 'DPD Document Archive',
  pageTrackerScreenviewEnabled: true,
}, router) ;


new Vue({ // eslint-disable-line no-new
  el: '#vue-app',
  router,
  render (h) {
    return h(App, {});
  },
});