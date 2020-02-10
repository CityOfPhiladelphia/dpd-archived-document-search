import BrowserSupport from  "./browser-support.js";
BrowserSupport.isIE();
// import 'core-js';

import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';

import DocumentsTable from "./components/DocumentsTable";
import EntitiesDropdown from "./components/EntitiesDropdown";
import EntityCategories from "./components/EntityCategories";

Vue.config.productionTip = false;
Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'home',
      component: EntitiesDropdown,
    },
    {
      path: '/:entityName/',
      name: 'categories',
      component: EntityCategories,
      props: true,
    },
    {
      path: '/:entityName/:categoryName/',
      name: 'documents',
      component: DocumentsTable,
      props: true,
    },
   
  ],
});

new Vue({ // eslint-disable-line no-new
  el: '#vue-app',
  router,
  render (h) {
    return h(App, {});
  },
});