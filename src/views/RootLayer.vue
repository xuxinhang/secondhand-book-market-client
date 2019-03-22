<template>
  <div id="root_wrapper">
    <header class="van-hairline--bottom">
      <van-nav-bar
        :title="initialTitle"
        :left-arrow="isBackBtnVisible"
        @click-left="navBackBtnClick"
      />
    </header>
    <main>
      <router-view></router-view>
    </main>
    <footer :hidden="!isTabbarPage">
      <van-tabbar v-model="activeTab" :fixed="false">
        <van-tabbar-item>
          <span>书籍市场</span>
          <van-icon
            slot="icon" slot-scope="props"
            :name="'shop' + (props.active ? '' : '-o')"
          />
        </van-tabbar-item>
        <van-tabbar-item :info="cartListNumber || undefined">
          <span>购物车</span>
          <van-icon
            slot="icon" slot-scope="props"
            :name="'cart' + (props.active ? '' : '-o')"
          />
        </van-tabbar-item>
        <van-tabbar-item>
          <span>更多</span>
          <van-icon
            slot="icon" slot-scope="props"
            :name="'more' + (props.active ? '' : '-o')"
          />
        </van-tabbar-item>
      </van-tabbar>
    </footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

const tabbarItemList = ['market', 'cart', 'more'];

@Component({
  //
})
export default class RootLayer extends Vue {
  get isTabbarPage() {
    const activeTab = this.$route.meta && this.$route.meta.activeTab;
    return activeTab !== undefined && tabbarItemList.indexOf(activeTab) !== -1;
  }
  get activeTab() {
    return tabbarItemList.indexOf(this.$route.meta && this.$route.meta.activeTab);
  }
  set activeTab(index) {
    this.$router.replace({ name: tabbarItemList[index] });
  }
  get initialTitle() {
    const title = this.$route.meta &&
      this.$route.meta.navbar &&
      this.$route.meta.navbar.title;
    return title === undefined ? '二手书市' : title;
  }
  get isBackBtnVisible() {
    const show = this.$route.meta &&
      this.$route.meta.navbar &&
      this.$route.meta.navbar.backable;
    return show === undefined ? true : show;
  }
  get cartListNumber() {
    return this.$store.getters['cart/cartCount'];
  }

  // methods
  public navBackBtnClick() {
    this.$router.back();
  }
}
</script>

<style lang="scss" type="text/sass" scoped>
#root_wrapper {
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
}
header {
  width: 100%;
  flex: 0 0;
  border-bottom: 1px solid #eeeeee;
  box-shadow: 0 0 0.2em rgba(0, 0, 0, 0.1);
}
main {
  flex: 1 1;
  overflow: auto;
}
footer {
  flex: 0 0;
}
</style>




