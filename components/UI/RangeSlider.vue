<template>
  <div class="range-slider-component">
    <div class="slider-container">
      <div class="slider" ref="sliderRef">
        <div class="slider-fill" :style="fillStyle"></div>
        <div class="slider-handle min-handle" :style="minHandleStyle"
             @mousedown="startDrag('min', $event)"
             @touchstart="startDrag('min', $event)"></div>
        <div class="slider-handle max-handle" :style="maxHandleStyle"
             @mousedown="startDrag('max', $event)"
             @touchstart="startDrag('max', $event)"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, onMounted } from 'vue';

const props = withDefaults(defineProps<{
  min: number;
  max: number;
  minValue: number;
  maxValue: number;
  formatValue?: (value: number) => string;
  disabled?: boolean;
}>(), {
  formatValue: (value: number) => value.toLocaleString('ru-RU').replace(/,/g, ' '),
  disabled: false
});

const emit = defineEmits<{
  (event: 'change', value: [number, number]): void;
}>();

const sliderRef = ref<HTMLElement | null>(null);
const isDragging = ref<string | null>(null);

const fillStyle = computed(() => {
  const minPos = ((props.minValue - props.min) / (props.max - props.min)) * 100;
  const maxPos = ((props.maxValue - props.min) / (props.max - props.min)) * 100;
  return {
    left: `${minPos}%`,
    width: `${maxPos - minPos}%`
  };
});

const minHandleStyle = computed(() => {
  const position = ((props.minValue - props.min) / (props.max - props.min)) * 100;
  return { left: `${position}%` };
});

const maxHandleStyle = computed(() => {
  const position = ((props.maxValue - props.min) / (props.max - props.min)) * 100;
  return { left: `${position}%` };
});

function startDrag(handle: string, event: MouseEvent | TouchEvent) {
  if (props.disabled) return;

  event.preventDefault();
  isDragging.value = handle;

  document.addEventListener('mousemove', handleDrag);
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchmove', handleDrag, { passive: false });
  document.addEventListener('touchend', stopDrag);
}

function handleDrag(e: MouseEvent | TouchEvent) {
  if (!isDragging.value || props.disabled || !sliderRef.value) return;

  e.preventDefault();

  const rect = sliderRef.value.getBoundingClientRect();
  let clientX: number;

  if (e instanceof MouseEvent) {
    clientX = e.clientX;
  } else if (e.touches && e.touches[0]) {
    clientX = e.touches[0].clientX;
  } else {
    return;
  }

  let position = ((clientX - rect.left) / rect.width) * 100;
  position = Math.max(0, Math.min(100, position));

  const value = Math.round(props.min + (position / 100) * (props.max - props.min));

  let newMin = props.minValue;
  let newMax = props.maxValue;

  if (isDragging.value === 'min') {
    newMin = Math.min(Math.max(value, props.min), props.maxValue);
  } else {
    newMax = Math.max(Math.min(value, props.max), props.minValue);
  }

  emit('change', [newMin, newMax]);
}

function stopDrag() {
  if (isDragging.value) {
    isDragging.value = null;
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchmove', handleDrag);
    document.removeEventListener('touchend', stopDrag);
  }
}

onUnmounted(() => {
  stopDrag();
});

onMounted(() => {
  document.addEventListener('selectstart', preventSelection);
});

onUnmounted(() => {
  document.removeEventListener('selectstart', preventSelection);
});

function preventSelection(e: Event) {
  if (isDragging.value) {
    e.preventDefault();
  }
}
</script>

<style scoped lang="scss">
.range-slider-component {
  width: 100%;
  user-select: none;
}

.range-values {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
  color: #333;
}

.slider-container {
  width: 100%;
  padding: 8px 0;
}

.slider {
  width: 100%;
  height: 4px;
  background-color: #e0e0e0;
  position: relative;
  border-radius: 2px;
  touch-action: none;
}

.slider-fill {
  height: 4px;
  background-color: #3EB57C;
  position: absolute;
  top: 0;
  border-radius: 2px;
  transition: all 0.1s ease;
}

.slider-handle {
  width: 16px;
  height: 16px;
  background-color: #3EB57C;
  border-radius: 50%;
  position: absolute;
  top: -6px;
  transform: translateX(-50%);
  cursor: pointer;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.1s ease;
  touch-action: none;

  &:hover {
    background-color: #38a06d;
    transform: translateX(-50%) scale(1.1);
  }

  &:active {
    transform: translateX(-50%) scale(1.2);
  }
}

.min-handle {
  left: 0;
}

.max-handle {
  left: 100%;
}

:disabled {
  opacity: 0.5;
  cursor: not-allowed;

  .slider-handle {
    cursor: not-allowed;
    background-color: #ccc;

    &:hover {
      background-color: #ccc;
      transform: translateX(-50%);
    }
  }

  .slider-fill {
    background-color: #ccc;
  }
}
</style>