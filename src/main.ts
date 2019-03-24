import Vue from 'vue';
import VantUI from 'vant';
import router from './router/index';
// import 'vant/lib/index.css';
import 'vant/lib/index.less';
import '@/styles/vant-override.less';

import App from './App.vue';
import store from './store/index';

Vue.config.productionTip = false;
Vue.use(VantUI);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
