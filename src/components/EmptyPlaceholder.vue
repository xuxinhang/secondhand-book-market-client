<template>
  <div class="empty-placeholder_wrapper">
    <div class="empty-placeholder_icon">
      <slot name="icon">
        <van-icon :name="iconName" size="3em" color="#ccc" />
      </slot>
    </div>
    <div class="empty-placeholder_title">
      <slot>{{title}}</slot>
    </div>
    <div class="empty-placeholder_desc">
      <slot name="desc">{{desc}}</slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    iconName: { type: String, default: 'send-gift-o' },
    title: { type: String, default: '这里空空如也' },
    desc: { type: String, default: '' },
  },
});
</script>

<style lang="scss" scoped>
@import '~@/styles/_vars.scss';

.empty-placeholder_wrapper {
  padding: 1em;
}
.empty-placeholder_icon {
  margin-bottom: 0.4em;
  text-align: center;
}
.empty-placeholder_title {
  margin-bottom: 0.4em;
  text-align: center;
  color: $gray-alaph;
  font-size: 1em;
}
.empty-placeholder_desc {
  text-align: center;
  color: $gray-beta;
  font-size: 0.8em;
}
</style>


