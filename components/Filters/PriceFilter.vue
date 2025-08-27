<template>
  <div class="price-filter">
    <div class="filter-label">{{ label }}</div>

    <div class="price-inputs">
      <div class="input-group">
        <label for="min-price">От</label>
        <input
          id="min-price"
          type="text"
          :value="formatInputValue(localMin)"
          @input="handleMinInput($event)"
          @blur="validateMinInput"
          :disabled="disabled"
          class="price-input"
        />
      </div>
      <div class="input-group">
        <label for="max-price">До</label>
        <input
          id="max-price"
          type="text"
          :value="formatInputValue(localMax)"
          @input="handleMaxInput($event)"
          @blur="validateMaxInput"
          :disabled="disabled"
          class="price-input"
        />
      </div>
    </div>

    <RangeSlider
      :min="actualMin"
      :max="actualMax"
      :min-value="localMin"
      :max-value="localMax"
      :format-value="formatValue"
      :disabled="disabled"
      @change="handleSliderChange"
    />
  </div>
</template>

<script setup lang="ts">
import RangeSlider from '@/components/UI/RangeSlider.vue';
import { ref, computed, watch } from 'vue';

const props = withDefaults(defineProps<{
  minValue: number;
  maxValue: number;
  disabled: boolean;
  label?: string;
  min?: number;
  max?: number;
  formatValue?: (value: number) => string;
}>(), {
  label: 'Стоимость квартиры, ₽',
  min: 1500000,
  max: 18900000,
  formatValue: (value: number) => value.toLocaleString('ru-RU').replace(/,/g, ' ')
});

const emit = defineEmits<{
  (event: 'change', value: [number, number]): void;
}>();

const localMin = ref(props.minValue);
const localMax = ref(props.maxValue);

const actualMin = computed(() => props.min || 1500000);
const actualMax = computed(() => props.max || 18900000);

const formatInputValue = (value: number) => {
  return value.toLocaleString('ru-RU').replace(/,/g, ' ');
};

const handleMinInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\s/g, '');

  if (!/^\d*$/.test(value)) {
    value = value.replace(/\D/g, '');
  }

  const numValue = value ? parseInt(value) : actualMin.value;
  localMin.value = Math.min(Math.max(numValue, actualMin.value), localMax.value);

  emit('change', [localMin.value, localMax.value]);
};

const handleMaxInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\s/g, '');

  if (!/^\d*$/.test(value)) {
    value = value.replace(/\D/g, '');
  }

  const numValue = value ? parseInt(value) : actualMax.value;
  localMax.value = Math.max(Math.min(numValue, actualMax.value), localMin.value);

  emit('change', [localMin.value, localMax.value]);
};

const validateMinInput = () => {
  let minVal = Math.max(actualMin.value, localMin.value);
  minVal = Math.min(minVal, localMax.value);

  if (minVal !== localMin.value) {
    localMin.value = minVal;
    emit('change', [minVal, localMax.value]);
  }
};

const validateMaxInput = () => {
  let maxVal = Math.min(actualMax.value, localMax.value);
  maxVal = Math.max(maxVal, localMin.value);

  if (maxVal !== localMax.value) {
    localMax.value = maxVal;
    emit('change', [localMin.value, maxVal]);
  }
};

const handleSliderChange = (values: [number, number]) => {
  localMin.value = values[0];
  localMax.value = values[1];
  emit('change', values);
};

watch(() => props.minValue, (newVal) => {
  if (newVal !== localMin.value) {
    localMin.value = newVal;
  }
});

watch(() => props.maxValue, (newVal) => {
  if (newVal !== localMax.value) {
    localMax.value = newVal;
  }
});
</script>

<style scoped lang="scss">
.price-filter {
  margin-bottom: 24px;
}

.filter-label {
  font-size: 14px;
  color: #333;
  margin-bottom: 12px;
  font-weight: 500;
}

.price-inputs {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.input-group {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 8px;
}

.input-group label {
  font-size: 12px;
  color: #666;
}

.price-input {
  border: none;
  border-radius: 6px;
  background: none;
  font-weight: 400;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #3EB57C;
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
}
</style>