<template>
  <div id="app-header">
    <div class="logo" @click="goMain">
      <span>🧑‍⚖️ 산재판례 요약 서비스</span>
    </div>
    <!-- <div class="menu">
      <span class="menu-btn">스크랩 관리</span>
    </div> -->
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
function goMain() {
  router.push("/");
}
</script>

<style lang="scss" scoped>
#app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem;
  height: $header-height;
  background-color: white;
  color: black;
  border-bottom: 2px solid $grey-medium;

  .logo {
    font-size: 1.3rem;
    font-family: "Diphylleia", serif;
    // font-family: 'Nanum Myeongjo', serif;
    font-weight: 400;
    font-style: normal;

    cursor: pointer;
    // font-weight: bold;
  }
  // .menu {
  //   .menu-btn {
  //     cursor: pointer;
  //     font-size: 0.8rem;
  //   }
  // }
}
</style>
