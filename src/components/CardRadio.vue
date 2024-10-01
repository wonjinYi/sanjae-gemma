<template>
  <div class="card-radio">
    <div class="label-container">
      <span class="title">{{ title }}</span>
      <span class="description">{{ description }}</span>
    </div>
    <div class="card-container">
      <button-card
        class="option-card"
        :text="labels[index]"
        :theme="modelValue === option ? 'selected' : 'unselected'"
        v-for="(option, index) in options"
        :key="index"
        @click="selectOption(option)"
      />
    </div>
  </div>
</template>

<script setup>
import ButtonCard from "@/components/ButtonCard.vue";
const props = defineProps({
  title: String,
  description: String,
  options: Array,
  labels: Array,
  modelValue: [String, Number],
  allowUnselect: {
    type: Boolean,
    default: true,
  },
});

const emits = defineEmits(["update:modelValue", "changed"]);

const selectOption = (option) => {
  if (props.modelValue === option && props.allowUnselect) {
    emits("update:modelValue", null);
    emits("changed");
  } else if (props.modelValue !== option) {
    emits("update:modelValue", option);
    emits("changed");
  }
};
</script>

<style lang="scss" scoped>
.card-radio {
  .label-container {
    padding: 1rem 0;
    .description {
      //   font-size: 0.8rem;
      //   color: $grey-dark;
    }
  }

  .card-container {
    display: flex;
    flex-wrap: wrap;
    // justify-content: center;
    gap: 1rem;
  }
}
</style>
