<template>
  <div class="loading-bounce">
    <div class="dot1"></div>
    <div class="dot2"></div>
    <div class="dot3"></div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.loading-bounce {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 1rem;

  .dot1,
  .dot2,
  .dot3 {
    width: 0.5rem;
    height: 0.5rem;
    background-color: $primary-color;
    border-radius: 50%;
    margin: 0 0.5rem;
    animation: bounce 0.4s infinite alternate;
  }

  .dot2 {
    animation-delay: 0.2s;
  }

  .dot3 {
    animation-delay: 0.4s;
  }

  @keyframes bounce {
    0% {
      transform: translateY(0);
    }

    100% {
      transform: translateY(-1rem);
    }
  }
}
</style>
