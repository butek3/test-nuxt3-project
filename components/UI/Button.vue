<template>
  <button :class="['btn', variant]" :disabled="disabled" @click="$emit('click')">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'outline';
  disabled?: boolean;
}>();

defineEmits<{
  (event: 'click'): void;
}>();
</script>

<style scoped lang="scss">
.btn {
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: $font-family;
  font-size: 14px;
  transition: all 0.2s;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.primary {
    background-color: $accent-color;
    color: white;

    &:hover:not(:disabled) {
      background-color: darken($accent-color, 10%);
    }
  }

  &.outline {
    background-color: transparent;
    border: 1px solid $border-color;
    color: $primary-color;

    &:hover:not(:disabled) {
      background-color: $hover-color;
    }
  }
}
</style>