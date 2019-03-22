import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home.vue';
import RootLayer from '@/views/RootLayer.vue';
import More from '@/views/More.vue';
import AboutUs from '@/views/AboutUs.vue';
import Cart from '@/views/Cart.vue';
import CartSubmit from '@/views/CartSubmit.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/home',
      name: 'home',
      component: Home,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue'),
    },
    // My router config
    {
      path: '/',
      name: 'root-layer',
      component: RootLayer,
      children: [
        {
          path: '/market',
          name: 'market',
          meta: {
            activeTab: 'market',
            navbar: {
              title: '书籍市场',
              backable: false,
            },
          },
        },
        {
          path: '/cart/submit',
          name: 'cartSubmit',
          component: CartSubmit,
          meta: {
            activeTab: 'cart',
            navbar: { title: '确认订单', backable: false },
          },
        },
        {
          path: '/cart',
          name: 'cart',
          component: Cart,
          meta: {
            activeTab: 'cart',
            navbar: {
              title: '购物车',
              backable: false,
            },
          },
        },
        {
          path: '/more',
          name: 'more',
          component: More,
          meta: {
            activeTab: 'more',
            navbar: {
              title: '更多',
              backable: false,
            },
          },
        },
        {
          path: '/more/aboutus',
          name: 'aboutus',
          component: AboutUs,
          meta: {
            navbar: { title: '关于我们' },
          },
        },
      ],
    },
  ],
});
