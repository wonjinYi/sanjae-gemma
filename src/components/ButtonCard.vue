<template>
  <span class="button-card" :class="theme">
    {{ text }}
  </span>
</template>

<script setup>
defineProps({
  text: String,
  theme: String, // 'selected' or 'unselected'
});
</script>

<style lang="scss" scoped>
.button-card {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  background-color: white;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  cursor: pointer;

  font-size: 0.9rem;

  transition: all 0.1s;
}

.selected {
  background-color: $secondary-color;
  color: white;
  font-weight: bold;
}

// .unselected {
//   color: $grey-dark;
// }
</style>
