<template>
  <div class="item-card">
    <p class="preview">{{ item.preview }}</p>
    <div class="info">
      <span class="title">{{ item.title }}</span>
      <span class="accnum">{{ item.accnum }}</span>
      <span class="court-name">{{ item.courtName }}</span>
    </div>
    <div class="detail-button">
      <span @click="goDetail">{{ `자세히 보기 >` }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  item: Object,
});
const emits = defineEmits(["go-detail"]);

function goDetail() {
  emits("go-detail");
}
</script>

<style lang="scss" scoped>
.item-card {
  padding: 2rem;
  background-color: white;
  border: 1px solid $grey-medium;
  border-radius: 1rem;
  transition: all 0.3s ease-in-out;
  .preview {
    font-size: 0.95rem;
    line-height: 1.1rem;
    word-break: keep-all;
  }
  .info {
    padding: 1rem 0;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: flex-end;
    color: $grey-strong;
    font-size: 0.8rem;
  }
  .detail-button {
    text-align: right;
    padding-top: 1rem;
    span {
      padding: 0.5rem;
      cursor: pointer;
      color: $secondary-color;
      font-size: 1rem;
      font-weight: bold;
    }
  }

  &:hover {
    background-color: $tertiary-color;
  }
}
</style>
