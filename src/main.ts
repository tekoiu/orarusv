import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import BootstrapVue from 'bootstrap-vue';
import 'vue-loading-overlay/dist/vue-loading.css';

import router from './router';
import store from './store';

Vue.config.productionTip = false;
Vue.config.performance = true;
Vue.use(BootstrapVue, VueRouter);

new Vue({
  router,
  store,
  render: (h: any) => h(App),
}).$mount('#app');
