<template>
  <div id="app-root">
    <app-header></app-header>
    <!-- <router-view class="router-view"></router-view> -->
    <router-view class="router-view" v-slot="{ Component }">
      <transition>
        <component :is="Component" />
      </transition>
    </router-view>
    <app-footer></app-footer>
  </div>
</template>

<script setup>
import { ref } from "vue";

import AppHeader from "@/layouts/AppHeader.vue";
import AppFooter from "@/layouts/AppFooter.vue";
</script>

<style lang="scss" scoped>
#app-root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: "Gowun Batang", serif;
}

.router-view {
  flex: 1;
}

//  transition animation
.v-enter-active {
  transition: all 0.25s linear;
  transition-delay: 0.25s;
}
.v-leave-active {
  transition: all 0.25s linear;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
