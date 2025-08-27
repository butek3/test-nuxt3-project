<template>
  <div class="room-filter">
    <div class="rooms">
      <button
        v-for="btn in [1,2,3,4]"
        :key="btn"
        :class="['room', { active: selected === btn }]"
        @click="$emit('change', selected === btn ? null : btn)"
        :disabled="disabled"
      >
        {{ btn }}к
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  selected: number | null;
  disabled: boolean;
}>();

defineEmits<{
  (event: 'change', rooms: number | null): void;
}>();
</script>

<style scoped lang="scss">
.room-filter {
  margin-bottom: 24px;
}

.filter-label {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #333;
  margin-bottom: 12px;
  font-weight: 500;
}

.rooms {
  display: flex;
  gap: 16px;
}

.room {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: #333;
  cursor: pointer;
  border: 1px solid #ddd;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    border-color: #3EB57C;
    box-shadow: #2e8b5d;
  }

  &.active {
    background-color: #3EB57C;
    color: #ffffff;
    border-color: #3EB57C;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>