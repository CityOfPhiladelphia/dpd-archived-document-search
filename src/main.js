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
      path: '/Entities',
      component: EntitiesDropdown,
    },
    {
      path: '/Categories',
      component: EntityCategories,
      props: true,
    },
    {
      path: '/DocumentsTable',
      component: DocumentsTable,
    },
   
  ],
});

new Vue({
  render: h => h(App),
  router,
}).$mount('#vue-app');