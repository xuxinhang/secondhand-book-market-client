<template>
  <ul class="tag-select">
    <li
      v-for="t in tags" :key="t.value"
      :class="{ 'active-tag': t.value === active }"
      @click="onTagClick(t.value)"
    >
      {{t.label}}
    </li>
  </ul>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    tags: Array,
    active: null as any,
    // active: [Number, String],
  },

  methods: {
    onTagClick(val: any) {
      this.$emit('change', val === this.active ? undefined : val);
    },
  },
});
</script>

<style lang="scss" scoped>
.tag-select {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  // grid-auto-rows: 1.6em;
  grid-gap: 0.56em;
  list-style: none;
  li {
    padding: 0.2em;
    background: #ededed;
    border-radius: 3px;
    color: rgba(0,0,0,0.87);
    text-align: center;
    &.active-tag {
      background: #ff6c8a;
      color: #fff;
    }
  }
}

</style>

