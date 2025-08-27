<template>
  <div class="area-filter">
    <div class="filter-label">{{ label }}</div>

    <div class="area-inputs">
      <div class="input-group">
        <label for="min-area">От</label>
        <input
          id="min-area"
          type="text"
          :value="formatInputValue(localMin)"
          @input="handleMinInput($event)"
          @blur="validateMinInput"
          :disabled="disabled"
          class="area-input"
        />
      </div>
      <div class="input-group">
        <label for="max-area">До</label>
        <input
          id="max-area"
          type="text"
          :value="formatInputValue(localMax)"
          @input="handleMaxInput($event)"
          @blur="validateMaxInput"
          :disabled="disabled"
          class="area-input"
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
  label: 'Площадь, м²',
  min: 33,
  max: 123,
  formatValue: (value: number) => value.toString()
});

const emit = defineEmits<{
  (event: 'change', value: [number, number]): void;
}>();

const localMin = ref(props.minValue);
const localMax = ref(props.maxValue);

const actualMin = computed(() => props.min || 33);
const actualMax = computed(() => props.max || 123);

const formatInputValue = (value: number) => {
  return value.toString();
};

const handleMinInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value;

  if (!/^[\d.]*$/.test(value)) {
    value = value.replace(/[^\d.]/g, '');
  }

  const parts = value.split('.');
  if (parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join('');
  }

  const numValue = value ? parseFloat(value) : actualMin.value;

  if (!isNaN(numValue)) {
    localMin.value = Math.min(Math.max(numValue, actualMin.value), localMax.value);
     emit('change', [localMin.value, localMax.value]);
  }
};

const handleMaxInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value;

  if (!/^[\d.]*$/.test(value)) {
    value = value.replace(/[^\d.]/g, '');
  }

  const parts = value.split('.');
  if (parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join('');
  }

  const numValue = value ? parseFloat(value) : actualMax.value;

  if (!isNaN(numValue)) {
    localMax.value = Math.max(Math.min(numValue, actualMax.value), localMin.value);
      emit('change', [localMin.value, localMax.value]);
  }
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
.area-filter {
  margin-bottom: 24px;
}

.filter-label {
  font-size: 14px;
  color: #333;
  margin-bottom: 12px;
  font-weight: 500;
}

.area-inputs {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.input-group {
  display: flex;
  flex: 1;
  align-items: center;
  background: none;
  gap: 8px;
}

.input-group label {
  font-size: 12px;
  color: #666;
}

.area-input {
  border: none;
  border-radius: 6px;
  font-size: 12px;
  background: none;

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