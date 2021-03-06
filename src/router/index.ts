import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home.vue';
import RootLayer from '@/views/RootLayer.vue';
import More from '@/views/More.vue';
import AboutUs from '@/views/AboutUs.vue';
import Cart from '@/views/Cart.vue';
import CartSubmit from '@/views/CartSubmit.vue';
import CartSuccess from '@/views/CartSuccess.vue';
import MarketList from '@/views/MarketList.vue';
import GoodDetail from '@/views/GoodDetail.vue';
import SellBook from '@/views/SellBook.vue';

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
          component: MarketList,
          meta: {
            activeTab: 'market',
            navbar: {
              title: '书籍市场',
              backable: false,
            },
          },
        },
        {
          path: '/market/:goodId',
          name: 'goodDetail',
          component: GoodDetail,
          meta: {
            activeTab: 'market',
            navbar: {
              title: '书籍详情',
              backable: true,
            },
          },
        },
        {
          path: '/cart/submit',
          name: 'cartSubmit',
          component: CartSubmit,
          meta: {
            activeTab: 'cart',
            navbar: { title: '确认订单', backable: true },
          },
        },
        {
          path: '/cart/success',
          name: 'cartSuccess',
          component: CartSuccess,
          meta: {
            activeTab: 'cart',
            navbar: { title: '下单成功', backable: false },
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
        {
          path: '/sellBook',
          name: 'sellBook',
          component: SellBook,
          meta: {
            navbar: { title: '我要卖书' },
          },
        },
        // Redirect
        {
          path: '/',
          redirect: '/market',
        },
      ],
    },
  ],
});
