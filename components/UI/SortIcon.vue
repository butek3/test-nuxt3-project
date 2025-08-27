<template>
  <span class="sort-icon" :class="{ active: isActive }">
    {{ isActive ? (direction === 'asc' ? '↑' : '↓') : '○' }}
  </span>
</template>

<script setup lang="ts">
import type { SortField, SortDirection } from '@/types';
import { computed } from 'vue';

const props = defineProps<{
  field: SortField;
  currentField: SortField;
  direction: SortDirection;
}>();

const isActive = computed(() => props.field === props.currentField);
</script>

<style scoped lang="scss">
.sort-icon {
  font-size: 12px;
  opacity: 0.5;
  transition: opacity 0.2s;

  &.active {
    opacity: 1;
    color: #3EB57C;
  }
}

.header-cell:hover .sort-icon {
  opacity: 0.8;
}
</style>