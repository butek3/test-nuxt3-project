<template>
  <article class="card">
    <img :src="apartment.planImg" :alt="`Планировка квартиры ${apartment.id}`" />
    <div class="info">
      <div class="apartment-title">{{ apartment.rooms }}-комнатная №{{ apartment.id }}</div>
      <div class="apartment-area">{{ apartment.area }} м²</div>
      <div class="apartment-floor">
        <span class="floor-number">{{ apartment.floor }}</span>
        <span class="floor-total"> из 17</span>
      </div>
      <div class="price">{{ formatPrice(apartment.price) }} ₽</div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Apartment } from '@/types';

defineProps<{ apartment: Apartment }>();

const formatPrice = (price: number) => {
  return price.toLocaleString('ru-RU').replace(/,/g, ' ');
};
</script>

<style scoped lang="scss">
.card {
  display: flex;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  margin-bottom: 16px;
  padding: 16px;
  align-items: center;
  transition: box-shadow 0.15s;
  width: 100%;
  height: 120px;
  box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.1);

  &:hover {
    box-shadow: 0 4px 24px rgba(66,204,153,.08);
  }
}

img {
  width: 80px;
  height: 80px;
  margin-right: 20px;
  object-fit: contain;
}

.info {
  flex: 1;
  display: flex;
  align-items: center;
  font-family: $font-family;
}

.apartment-title {
  width: 281px;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
}

.apartment-area {
  width: 120px;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
}

.apartment-floor {
  width: 120px;
  display: flex;
  gap: 4px;
}

.floor-number {
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
}

.floor-total {
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  opacity: 0.5;
}

.price {
  width: 120px;
  font-weight: bold;
  color: $accent-color;
  font-size: 16px;
  line-height: 24px;
  text-align: right;
}

@include mobile {
  .card {
    flex-direction: column;
    height: auto;
    padding: 12px;
  }

  img {
    margin-right: 0;
    margin-bottom: 12px;
  }

  .info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    width: 100%;
  }

  .apartment-title,
  .apartment-area,
  .apartment-floor,
  .price {
    width: 100%;
  }
}
</style>