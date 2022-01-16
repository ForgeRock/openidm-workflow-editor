/**
 * Copyright 2020 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */


const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  runtimeCompiler: true,
  publicPath: './',
  configureWebpack: {
    devtool: 'eval-source-map',
    plugins: [
      new webpack.BannerPlugin('Copyright 2022 ForgeRock AS. '
        + 'All Rights Reserved \n Use of this code '
        + 'requires a commercial software license with ForgeRock AS. '
        + 'or with one of its affiliates. '
        + 'All use shall be exclusively subject to such license between the licensee and ForgeRock AS.'),
      /**
       * For now we need to mirror copy these files out of
       * the provided folders inside of node_modules.
       * In the future we need to investigate on either improving
       * this library so that these specific html and
       * js files aren't needed to be used this way.
       * All four of these copies are currently needed to make the
       * UI effectively make use of appauthhelper and sessioncheck
       */
      new CopyWebpackPlugin([
        {
          from: 'node_modules/appauthhelper/appAuthHelperRedirect.html',
          to: 'appAuthHelperRedirect.html',
          toType: 'file',
        },
        {
          from: 'node_modules/appauthhelper/appAuthServiceWorker.js',
          to: 'appAuthServiceWorker.js',
          toType: 'file',
        },
        {
          from: 'node_modules/appauthhelper/appAuthHelperFetchTokensBundle.js',
          to: 'appAuthHelperFetchTokensBundle.js',
          toType: 'file',
        },
        {
          from: 'node_modules/oidcsessioncheck/sessionCheck.html',
          to: 'sessionCheck.html',
          toType: 'file',
        },
        {
          from: 'node_modules/oidcsessioncheck/sessionCheckFrame.js',
          to: 'sessionCheckFrame.js',
          toType: 'file',
        },
      ]),
    ],
  },
  devServer: {
    host: 'localhost',
    proxy: {
      '/openidm': {
        target: `${process.env.VUE_APP_IDM_HOST}/${process.env.VUE_APP_IDM_CONTEXT}`,
        pathRewrite: { '^/openidm': '' },
        changeOrigin: true,
      },
    },
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `
            @import "~bootstrap/scss/_functions.scss";
            @import "~bootstrap/scss/_mixins.scss";
            @import "./src/scss/theme-variables.scss";
            @import "~bootstrap/scss/_variables.scss";
          `,
      },
    },
  },
  chainWebpack: (config) => {
    config.module.rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap((options) => { options.compilerOptions.whitespace = 'preserve'; });

    config.module
      .rule('bpmn')
      .test(/\.bpmn$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end();
  },
  pluginOptions: {
    lintStyleOnBuild: true,
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false,
    },
  },
};
