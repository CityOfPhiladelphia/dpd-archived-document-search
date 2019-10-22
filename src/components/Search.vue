<template>
  <div class="search-wrapper">
    <input type="search">
    <!-- Advanced Search component -->
    <div class="accordion-wrap">
      <div
        :class="{open : showContent}"
        class="accordion-title bg-ghost-gray"
        tabindex="0"
        role="region"
        :aria-expanded="showContent"
        @click="toggle"
        @keyup.enter="toggle"
      >
        <slot name="title">
          Advanced Search
        </slot>
      </div>
      <div
        v-show="showContent"
        class="accordion-content"
        tabindex="0"
      >
        <slot name="content">
          Content
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import VueFuse from "vue-fuse";

Vue.use(VueFuse);

export default {
  name: "Search",

  data() {
    return {
      showContent: false,
    };
  },
  computed: {},
  methods: {
    toggle() {
      this.showContent = !this.showContent;
    },
    makeID() {
      return this.accordionTitle.replace(/\s+/g, "-").toLowerCase();
    },
  },
};
</script>

<style lang="scss" >
.search-wrapper {
  padding-bottom: 1rem;
  
  .accordion-title {
    cursor: pointer;
    text-transform: uppercase;
    color: #444;
    font-size: 17px;
    font-weight: 700;
    padding: 1.15rem 1rem;
    border-bottom: 1px solid #ccc;
    position: relative;

    &:after {
      font-family: "Font Awesome 5 Pro";
      font-weight: 900;
      position: absolute;
      top: calc(50% - 13px);
      right: 2rem;
    }
  }
  .accordion-content {
    padding: 1rem;
  }
}
</style>