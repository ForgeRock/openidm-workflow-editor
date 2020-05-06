import Vue from 'vue';
import { ToastPlugin, ModalPlugin, TooltipPlugin } from 'bootstrap-vue';
import App from './App';
import router from './router';
import i18n from './i18n';


Vue.config.productionTip = false;
Vue.use(ToastPlugin);
Vue.use(ModalPlugin);
Vue.use(TooltipPlugin);

new Vue({
  router,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
