import DocumentsTable from "./pages/DocumentsTable";
import EntitiesDropdown from "./pages/EntitiesDropdown";
import EntityCategories from "./pages/EntityCategories";
import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

const router = new Router({
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

export default router;