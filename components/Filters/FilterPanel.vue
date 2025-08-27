<template>
  <div class="filter-panel">
    <div class="filter-container">
      <RoomFilter
        :selected="filters.rooms"
        :disabled="disabled"
        @change="updateRoomFilter"
      />

      <PriceFilter
        :min-value="filters.price[0]"
        :max-value="filters.price[1]"
        :disabled="disabled"
        @change="updatePriceFilter"
      />

      <AreaFilter
        :min-value="filters.area[0]"
        :max-value="filters.area[1]"
        :disabled="disabled"
        @change="updateAreaFilter"
      />

      <button
        class="reset-button"
        @click="resetFilters"
        :disabled="disabled || activeFiltersCount === 0"
      >
        Сбросить параметры ×
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Filters } from '@/types';
import RoomFilter from '@/components/Filters/RoomFilter.vue';
import PriceFilter from '@/components/Filters/PriceFilter.vue';
import AreaFilter from '@/components/Filters/AreaFilter.vue';
import { computed } from 'vue';

const props = defineProps<{
  filters: Filters;
  disabled: boolean;
}>();

const emit = defineEmits<{
  (event: 'change', filters: Filters): void;
}>();

const activeFiltersCount = computed(() => {
  let count = 0;
  if (props.filters.rooms !== null) count++;
  if (props.filters.price[0] !== 1500000 || props.filters.price[1] !== 18900000) count++;
  if (props.filters.area[0] !== 33 || props.filters.area[1] !== 123) count++;
  return count;
});

const defaultFilters: Filters = {
  rooms: null,
  price: [1500000, 18900000],
  area: [33, 123]
};

function updateRoomFilter(rooms: number | null) {
  emit('change', { ...props.filters, rooms });
}

function updatePriceFilter(price: [number, number]) {
  emit('change', { ...props.filters, price });
}

function updateAreaFilter(area: [number, number]) {
  emit('change', { ...props.filters, area });
}

function resetFilters() {
  emit('change', { ...defaultFilters });
}
</script>

<style scoped lang="scss">
.filter-panel {
  border-radius: 12px;
  margin-bottom: 40px;
  max-height: 372px;
}

.filter-container {
  padding: 40px;
  background: linear-gradient(135deg, rgba(174, 228, 178, 0.3) 0%, rgba(149, 208, 161, 0.3) 100%);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.reset-button {
  background-color: transparent;
  color: #666;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 8px;

  &:hover:not(:disabled) {
    color: #333;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
}
</style>