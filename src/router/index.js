import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: { name: 'Editor' },
  },
  {
    path: '/editor',
    name: 'Editor',
    component: () => import(/* webpackChunkName: "editor" */ '../views/Editor'),
  },
  // For now will just force any none known route to reroute to the primary editor page
  {
    path: '*',
    redirect: { name: 'Editor' },
  },
];

const router = new VueRouter({
  routes,
});

export default router;
