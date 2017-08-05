import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import Docs from '@/components/Docs';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },

    {
      path: '/docs',
      name: 'Docs',
      component: Docs,
      children: [{
        path: ':category',
        name: 'docs-category',
        children: [{
          path: ':file',
          name: 'docs-file',
        }],
      }],
    },
  ],
});
