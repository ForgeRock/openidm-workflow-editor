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
];

const router = new VueRouter({
  routes,
});

export default router;
