import Vue from 'vue';
import { ToastPlugin, ModalPlugin, TooltipPlugin } from 'bootstrap-vue';
import axios from 'axios';
import App from './App';
import router from './router';
import i18n from './i18n';


Vue.config.productionTip = false;
// Setting some global plugins here allows for easier use
Vue.use(ToastPlugin);
Vue.use(ModalPlugin);
Vue.use(TooltipPlugin);

Vue.mixin({
  methods: {
    // Generated an axios ajax request service for consistent use of calls to IDM
    getRequestService(extraHeaders) {
      const timeout = 0;
      const headers = {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-cache',
        'x-requested-with': 'XMLHttpRequest',
        'Accept-API-Version': 'resource=1.0',
        ...extraHeaders,
      };
      const baseURL = `/${process.env.VUE_APP_IDM_CONTEXT}`;
      const instance = axios.create({
        baseURL,
        timeout,
        headers,
      });

      instance.interceptors.response.use((response) => response, (error) => {
        if (error.response && error.response.data && error.response.data.code === 401) {
          this.$bvToast.toast('We were not able to detect an IDM session, only local BPMN editing available.', {
            title: 'Connection Error',
            toaster: 'b-toaster-top-center',
            variant: 'danger',
            solid: true,
          });
        }

        return Promise.reject(error);
      });

      return instance;
    },
  },
});


new Vue({
  router,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
