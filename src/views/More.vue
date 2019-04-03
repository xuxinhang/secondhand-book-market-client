<template>
  <div class="wrapper">
    <van-cell-group title="卖书">
      <van-cell
        is-link icon="shop"
        title="我要卖书"
        label="填写信息并发起申请"
        to="/sellBook"
      >
        <!-- @click="onSellOrderCellClick" -->
      </van-cell>
    </van-cell-group>
    <van-cell-group title="帮助中心">
      <van-cell
        is-link icon="bill" title="平台须知"
        @click="noticeDialogOpen = true"
      >
      </van-cell>
      <van-cell
        is-link icon="info" title="关于我们"
        to="/more/aboutus"
      >
      </van-cell>
    </van-cell-group>
    <!-- Dialogs -->
    <van-dialog v-model="aboutUsDialogOpen" title="关于我们">

    </van-dialog>
    <van-dialog v-model="noticeDialogOpen" title="使用须知">

    </van-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Toast } from 'vant';

export default Vue.extend({
  data() {
    return {
      aboutUsDialogOpen: false,
      noticeDialogOpen: false,
    };
  },

  methods: {
    onSellOrderCellClick() {
      this.$toast('本功能还在建设中...');
    },
    onAboutUsClick() {
      this.aboutUsDialogOpen = true;
    },
    onNoticeClick() {
      this.noticeDialogOpen = true;
    },
  },
});
</script>

<style lang="scss">
@import '~@/styles/_vars.scss';

.wrapper {
  height: 100%;
  background: $page-gray-bg;
}

</style>
