/**
 * @license
 * Copyright (c) 2020 ForgeRock. All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import AppAuthHelper from 'appauthhelper/appAuthHelperCompat';
import SessionCheck from 'oidcsessioncheck';
import Vue from 'vue';
import { ToastPlugin, ModalPlugin, TooltipPlugin } from 'bootstrap-vue';
import axios from 'axios';
import i18n from './i18n';
import App from './App';
import router from './router';


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

if (process.env.VUE_APP_ADMIN_CLIENT_ID && process.env.VUE_APP_AM_URL) {
  const AM_URL = process.env.VUE_APP_AM_URL;
  const commonSettings = {
    clientId: process.env.VUE_APP_ADMIN_CLIENT_ID,
    authorizationEndpoint: `${AM_URL}/oauth2/authorize`,
  };

  AppAuthHelper.init({
    clientId: commonSettings.clientId,
    authorizationEndpoint: commonSettings.authorizationEndpoint,
    tokenEndpoint: `${AM_URL}/oauth2/access_token`,
    revocationEndpoint: `${AM_URL}/oauth2/token/revoke`,
    endSessionEndpoint: `${AM_URL}/oauth2/connect/endSession`,
    identityProxyPreference: 'XHR',
    resourceServers: {
      [process.env.VUE_APP_IDM_REST_URL]: 'fr:idm:*',
    },
    tokensAvailableHandler: (claims) => {
      const sessionCheck = new SessionCheck({
        clientId: commonSettings.clientId,
        opUrl: commonSettings.authorizationEndpoint,
        subject: claims.sub,
        invalidSessionHandler() {
          AppAuthHelper.logout().then(() => window.location.reload());
        },
        sessionClaimsHandler(newClaims) {
          if (claims.auth_time !== newClaims.auth_time || claims.realm !== newClaims.realm) {
            this.invalidSessionHandler();
          }
        },
        cooldownPeriod: 5,
      });
      sessionCheck.triggerSessionCheck();

      document.addEventListener('click', sessionCheck.triggerSessionCheck());
      document.addEventListener('keypress', sessionCheck.triggerSessionCheck());


      new Vue({
        router,
        i18n,
        render: (h) => h(App),
      }).$mount('#app');
    },
  }).then(
    // In this application, we want tokens immediately, before any user interaction is attempted
    () => AppAuthHelper.getTokens(),
  );
} else {
  new Vue({
    router,
    i18n,
    render: (h) => h(App),
  }).$mount('#app');
}
