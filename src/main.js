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
      component: EntitiesDropdown,
    },
    {
      path: '/:entityName/Categories/',
      name: 'categories',
      component: EntityCategories,
      props: true,
    },
    {
      path: '/:entityName/:categoryName/Documents',
      name: 'documents',
      component: DocumentsTable,
      props: true,
    },
   
  ],
});

new Vue({
  render: h => h(App),
  router,
}).$mount('#vue-app');