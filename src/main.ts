import Vue from 'vue';
import App from './App.vue';
import VantUI from 'vant';
import router from './router/index';
import store from './store/index';

import 'vant/lib/index.css';

Vue.config.productionTip = false;
Vue.use(VantUI);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
