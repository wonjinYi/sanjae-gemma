<template>
  <div class="text-input">
    <p class="description">{{ description }}</p>
    <textarea
      type="text"
      placeholder="내용을 입력해주세요"
      @input="() => emits('update:modelValue', textInput)"
      v-model="textInput"
    />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  description: String,
  modelValue: String,
});
const emits = defineEmits(["update:modelValue"]);
const textInput = ref(props.modelValue);

watch(
  () => {
    return props.modelValue;
  },
  (newVal) => {
    textInput.value = newVal;
  }
);
</script>

<style lang="scss" scoped>
.text-input {
  .description {
    padding: 1rem 0;
  }
  textarea {
    width: 100%;
    padding: 1rem;
    height: 300px; /* 원하는 고정 높이 설정 */
    // font-size: 0.8rem;
    font-family: "Gowun Batang", serif;
    border: 2px solid $grey-medium;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    font-size: 1.1rem;

    resize: none; /* 사용자가 크기를 조절하지 못하도록 설정 */

    &:focus {
      border-color: $primary-color; // 포커스 시 파란색 테두리
      outline: none; // 기본 브라우저 outline 제거
    }
  }
}
</style>
