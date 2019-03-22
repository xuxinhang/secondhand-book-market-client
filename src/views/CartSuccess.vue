<template>
  <section class="cart-success">
    <div class="cart-success_icon">
      <van-icon name="checked" color="#ff6c8a" size="6em" />
    </div>
    <div class="cart-success_text">
      我们已接受到您的订单。我们会在72小时之内与您确认核实订单并联系配送。
    </div>
    <div class="cart-success_action">
      <van-button size="small" to="/cart">返回购物车</van-button>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import '~@/styles/_vars.scss';

.cart-success {
  height: 100%;
  box-sizing: border-box;
  padding-top: 2.6em;
  background: $page-gray-bg;
}

.cart-success_icon {
  // margin-bottom: 1em;
  text-align: center;
}

.cart-success_text {
  width: 18em;
  margin: 1em auto;
  line-height: 1.4;
  font-size: 1em;
  color: $gray-alaph;
}

.cart-success_action {
  text-align: center;
}

</style>
