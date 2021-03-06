// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js

const fs = require("fs");

function tryReadFile(file) {
  try {
    return fs.readFileSync(file);
  } catch (e) {
    console.log(e);
  }
}

module.exports = function(ctx) {
  return {
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://quasar.dev/quasar-cli/cli-documentation/boot-files
    boot: ["auth", "axios", "firebase", "boot", "addressbar-color"],

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-css
    css: ["app.scss", "transitions.scss", "fontStyling.scss"],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      // 'mdi-v4',
      // 'fontawesome-v5',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      "roboto-font", // optional, you are not bound to it
      "material-icons" // optional, you are not bound to it
    ],

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-framework
    framework: {
      iconSet: "material-icons", // Quasar icon set
      lang: "en-us", // Quasar language pack

      // Possible values for "all":
      // * 'auto' - Auto-import needed Quasar components & directives
      //            (slightly higher compile time; next to minimum bundle size; most convenient)
      // * false  - Manually specify what to import
      //            (fastest compile time; minimum bundle size; most tedious)
      // * true   - Import everything from Quasar
      //            (not treeshaking Quasar; biggest bundle size; convenient)
      all: "auto",

      components: [],
      directives: [],

      // Quasar plugins
      plugins: ["Dialog", "Notify", "AddressbarColor"]
    },

    // https://quasar.dev/quasar-cli/cli-documentation/supporting-ie
    supportIE: false,

    // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-build
    build: {
      vueRouterMode: "hash", // available values: 'hash', 'history'

      // rtl: false, // https://quasar.dev/options/rtl-support
      // showProgress: false,
      // gzip: true,
      // analyze: true,

      // Options below are automatically set depending on the env, set them if you want to override
      // preloadChunks: false,
      // extractCSS: false,

      // https://quasar.dev/quasar-cli/cli-documentation/handling-webpack
      extendWebpack(cfg) {
        cfg.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /node_modules/,
          options: {
            formatter: require("eslint").CLIEngine.getFormatter("stylish")
          }
        });
      }
    },

    // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-devServer
    devServer: {
      https: true,
      port: 3000,
      open: true, // opens browser window automatically
      key: tryReadFile("server.key"),
      cert: tryReadFile("server.pem"),
      ca: tryReadFile("ca.pem")
    },

    // animations: 'all', // --- includes all animations
    // https://quasar.dev/options/animations
    animations: "all", // default setting was animations: []

    // https://quasar.dev/quasar-cli/developing-ssr/configuring-ssr
    ssr: {
      pwa: false
    },

    // https://quasar.dev/quasar-cli/developing-pwa/configuring-pwa
    pwa: {
      workboxPluginMode: "GenerateSW", // 'GenerateSW' or 'InjectManifest'
      workboxOptions: {
        skipWaiting: true // found in https://forum.quasar-framework.org/topic/2560/solved-pwa-force-refresh-when-new-version-released/28
      }, // only for GenerateSW
      manifest: {
        name: "StudiCar" + (ctx.dev ? " LOCAL" : ""),
        short_name: "StudiCar",
        description: "Green.Cheap.Social",
        display: "standalone",
        orientation: "portrait",
        background_color: "#ffffff",
        theme_color: "#02a200", // blue color: 027be3
        icons: [
          {
            src: "statics/icons/icon-128x128.png",
            sizes: "128x128",
            type: "image/png"
          },
          {
            src: "statics/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "statics/icons/icon-256x256.png",
            sizes: "256x256",
            type: "image/png"
          },
          {
            src: "statics/icons/icon-384x384.png",
            sizes: "384x384",
            type: "image/png"
          },
          {
            src: "statics/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "statics/app-icon-maskable.png", // this is just to pass lighthouse audit, tutorial at https://web.dev/maskable-icon-audit/?utm_source=lighthouse&utm_medium=devtools
            sizes: "128x128 196x196 256x256 384x384 512x512", // just for the common sizes
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      },
      metaVariables: {
        appleMobileWebAppCapable: "yes",
        appleMobileWebAppStatusBarStyle: "default",
        appleTouchIcon120: "icons/apple-icon-120x120.png",
        appleTouchIcon180: "icons/apple-icon-180x180.png",
        appleTouchIcon152: "icons/apple-icon-152x152.png",
        appleTouchIcon167: "icons/apple-icon-167x167.png",
        appleSafariPinnedTab: "icons/safari-pinned-tab.svg",
        msapplicationTileImage: "icons/ms-icon-144x144.png",
        msapplicationTileColor: "#000000"
      }
    },

    // Full list of options: https://quasar.dev/quasar-cli/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
      id: ""
    },

    // Full list of options: https://quasar.dev/quasar-cli/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true
    },

    // Full list of options: https://quasar.dev/quasar-cli/developing-electron-apps/configuring-electron
    electron: {
      bundler: "packager", // 'packager' or 'builder'

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',
        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        appId: "studicar"
      },

      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: true,

      extendWebpack(cfg) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      }
    }
  };
};
