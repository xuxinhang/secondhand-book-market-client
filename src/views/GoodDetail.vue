<template>
  <section class="good-detail">
    <div class="container">
      <div class="image-block block-cell" @click="showImagePreview">
        <img
          :src="goodDetail.imgUrl"
        />
      </div>
      <div class="detail-block block-cell">
        <div class="detail_title">
          {{goodDetail.title}}
          <span class="detail_price primary-gradient">
            ￥{{formatPrice(goodDetail.price)[0]}}.<small>{{formatPrice(goodDetail.price)[1]}}</small>
          </span>
        </div>
        <div class="detail_desc">{{goodDetail.desc}}</div>
      </div>
      <div class="tip-block block-cell">
        整套图书可半价租用，让你不再有闲置图书。预付全
        款，我们送货上门，学期结束申请退书，我们上门回
        收，并退还一半书款。
      </div>
    </div>
    <div class="action-block">
      <em></em>
      <van-button
        v-if="goodDetail.restNum === 0"
        class="add-to-cart-btn"
        size="large" square type="primary" disabled
      >
        补货中
      </van-button>
      <van-button
        v-else-if="addCartBtnClicked"
        disabled size="large" square type="primary"
        class="add-to-cart-btn"
      >
        已添加到购物车
      </van-button>
      <van-button
        v-else
        size="large" square type="primary"
        class="add-to-cart-btn"
        @click="onAddCartBtnClick"
      >
        加入购物车
      </van-button>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import { ImagePreview } from 'vant';
import apier from '@/utils/apier.js';
// import { ResponseStat } from '@/utils/apier.js';
import { CartItem } from '@/store/cart';

export default Vue.extend({
  data() {
    return {
      addCartBtnClicked: false,
      goodDetail: {
        goodId: -1,
        title: '',
        desc: '',
        restNum: 1,
        price: 0,
        imgUrl: '',
      },
    };
  },

  computed: {
    currentGoodId(): string {
      return this.$route.params.goodId;
    },
  },

  methods: {
    showImagePreview() {
      ImagePreview({
        images: [
          this.goodDetail.imgUrl,
        ],
      });
    },
    formatPrice(price: number): string[] {
      const hundred = Math.round(price * 100);
      if (hundred < 100) {
        return ['0', (hundred < 10 ? '0' : '') + String(hundred)];
      } else {
        const str = String(hundred);
        const splitIndex = str.length - 2;
        return [str.substring(0, splitIndex), str.substr(splitIndex, 2)];
      }
    },
    fetchGoodDetail() {
      const goodId = this.currentGoodId;
      const toast = this.$toast.loading({
        duration: 0,       // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
        message: '正在加载',
      });
      apier.fetch('goodDetail', { goodId })
        .then(({ data, stat }) => {
          this.goodDetail = { ...this.goodDetail, ...data };
          toast.clear();
        })
        .catch(({ data, stat }) => {
          this.$dialog.alert({
            title: '加载商品详情时出现错误',
            message: stat.frimsg,
            beforeClose: () => this.$router.back(),
          });
          toast.clear();
        });
    },
    onAddCartBtnClick() {
      const newCartItem: CartItem = {
        num: 1,
        checked: true,
        good: this.goodDetail,
      };
      this.$store.commit('cart/addGood', newCartItem);
      this.$store.dispatch('emphasizeCartTab');
      this.addCartBtnClicked = true;
      this.$toast.success('此商品已添加至你的购物车');
    },
  },

  mounted() {
    this.fetchGoodDetail();
  },
});
</script>

<style lang="scss" scoped>
@import '~@/styles/_vars.scss';

.good-detail {
  height: 100%;
  position: relative;
  background: $page-gray-bg;
}

.container {
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
  &::after {
    content: '';
    display: block;
    height: 3em;
  }
}

.block-cell {
  margin-bottom: 0.66em;
  background: white;
  box-shadow:0 1px 2px 0 rgba(0,0,0,0.05);
  color: $gray-alaph;
}

.image-block {
  padding: none;
  min-height: 10em;
  height: 35vh; // 50vh;
  text-align: center;
  span {
    display: block;
    height: 100%;
    width: 100%;
    background-position: center center;
    background-size: contain;
    background-repeat: no-repeat;
  }
  img {
    max-height: 100%;
    max-width: 100%;
  }
}

.detail-block {
  padding: 1em 0.93em 0.78em;
  .detail_title {
    margin-bottom: 0.59em;
    font-weight: 600;
    font-size: 1.125em;
  }
  .detail_price {
    display: block;
    float: right;
    font-size: 1.125em;
    // color:#ff4c4c;
  }
  .detail_desc {
    margin-bottom: 0.7em;
    font-size: 0.9em;
  }
}

.tip-block {
  padding: 0.78em 0.93em;
  font-size: 0.9em;
}

.action-block {
  display: flex;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  & > em {
    flex: 1;
  }
  .add-to-cart-btn {
    width: 11em;
  }
}

</style>
