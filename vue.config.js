/**
 * Copyright 2020 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */
module.exports = {
  runtimeCompiler: true,
  publicPath: './',
  configureWebpack: {
    devtool: 'eval-source-map',
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
