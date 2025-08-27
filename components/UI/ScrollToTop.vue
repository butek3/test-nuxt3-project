<template>
  <Button
    class="scroll-to-top"
    @click="scrollToTop"
    :class="{ visible: isVisible }"
    aria-label="Прокрутить наверх"
  >
    ↑
  </Button>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Button from '@/components/UI/Button.vue';

const isVisible = ref(false);

function checkScroll() {
  isVisible.value = window.pageYOffset > 300;
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

onMounted(() => {
  window.addEventListener('scroll', checkScroll);
  checkScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll);
});
</script>

<style scoped lang="scss">
.scroll-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background-color: $accent-color;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s, background-color 0.3s;

  &.visible {
    opacity: 1;
    visibility: visible;
  }

  &:hover {
    background-color: #38a06d;
  }

  &:active {
    background-color: #2e8b5d;
  }
}
</style>