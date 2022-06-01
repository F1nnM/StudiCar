import { boot } from 'quasar/wrappers';
import VueFriendlyIframe from 'vue-friendly-iframe';
export default boot(({ app }) => {
  app.use(VueFriendlyIframe);
});
