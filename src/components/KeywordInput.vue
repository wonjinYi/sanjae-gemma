<template>
  <div class="keyword-input">
    <p class="description">{{ description }}</p>
    <form @submit.prevent="addKeyword">
      <input
        type="text"
        placeholder="키워드 입력 후 ENTER를 눌러주세요"
        v-model="textInput"
      />
    </form>
    <div class="card-container">
      <button-card
        class="keyword-card hover-warning"
        :text="keyword"
        v-for="(keyword, index) in modelValue.slice().reverse()"
        :key="index"
        @click="removeKeyword(keyword)"
      ></button-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ButtonCard from "./ButtonCard.vue";

const props = defineProps({
  description: String,
  modelValue: Array,
  autoSplit: {
    type: Boolean,
    default: true,
  },
});
const emits = defineEmits(["update:modelValue"]);
const textInput = ref("");

function addKeyword(e) {
  if (textInput.value === "") return;

  let arr;
  console.log(props.autoSplit);
  if (props.autoSplit) {
    arr = textInput.value
      .trim()
      .split(" ")
      .filter((k) => k.trim() !== "");
  } else {
    arr = [textInput.value.trim()];
  }

  const newKeywords = [...props.modelValue, ...arr];
  emits("update:modelValue", newKeywords);

  textInput.value = "";
}

function removeKeyword(keyword) {
  const newKeywords = props.modelValue.filter((k) => k !== keyword);
  emits("update:modelValue", newKeywords);
}
</script>

<style lang="scss" scoped>
.keyword-input {
  .description {
    padding: 1rem 0;
  }
  input {
    width: 100%;
    padding: 1rem;
    // font-size: 0.8rem;
    font-family: "Gowun Batang", serif;
    border: 2px solid $grey-medium;
    border-radius: 0.5rem;
    margin-bottom: 1rem;

    outline-color: $primary-color;
  }
  .card-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;

    .hover-warning {
      &:hover {
        background-color: $error-color;
        color: white;
      }
    }
  }
}
</style>
