<template>
  <div class="container">
    <h1>Квартиры</h1>

    <div class="content__wrapper">
      <CustomTable
        :columns="columns"
        :data="store.visibleApartments"
        :sort-field="store.sortField"
        :sort-direction="store.sortDirection"
        @sort="handleSort"
      >
        <template #row="{ item }">
          <td>
            <div class="apartment-layout">
              <img v-if="item.planImg" :src="item.planImg" :alt="`Планировка ${item.id}`" />
              <span v-else>Планировка {{ item.id }}</span>
            </div>
          </td>
          <td> {{ item.rooms }}-комнатная №{{ item.id }}</td>
          <td>{{ item.area }} м²</td>
          <td>{{ item.floor }}</td>
          <td>{{ formatPrice(item.price) }}</td>
        </template>

        <template #footer>
          <button
            v-if="store.hasMore"
            @click="store.showMore"
            class="load-more-btn"
            :disabled="store.loading"
          >
            {{ store.loading ? 'Загрузка...' : 'Загрузить еще' }}
          </button>
        </template>
      </CustomTable>

      <FilterPanel
        :filters="store.filters"
        :disabled="store.loading"
        @change="handleFiltersChange"
      />
    </div>
  </div>
</template>

<script setup>
import { useApartmentsStore } from '@/stores/apartaments';
import { onMounted } from 'vue';
import FilterPanel from '@/components/Filters/FilterPanel.vue';
import CustomTable from '@/components/UI/CustomTable.vue';

const store = useApartmentsStore();

const columns = [
  { key: 'layout', name: 'Планировка', sortable: false },
  { key: 'rooms', name: 'Квартира', sortable: false },
  { key: 'area', name: 'S, м²', sortable: true },
  { key: 'floor', name: 'Этаж', sortable: true },
  { key: 'price', name: 'Цена, ₽', sortable: true }
];

onMounted(() => {
  store.fetchApartments();
});

const handleFiltersChange = (newFilters) => {
  store.filters = newFilters;
  store.applyFilters();
};

const handleSort = (field, direction) => {
  store.sortField = field;
  store.sortDirection = direction;
  store.applySorting();
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU').format(price);
};
</script>

<style scoped lang="scss">
.container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px 20px;
}

.content__wrapper {
  display: flex;
  gap: 80px;
  width: 100%;
  justify-content: space-between;
}

h1 {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 32px;
  color: #333;
}

.load-more-btn {
  padding: 8px 24px;
  border: 1px solid #D9D9D9;
  border-radius: 24px;
  margin-top: 48px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.2s;
  width: fit-content;


  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}

.apartment-layout {
  display: flex;
  align-items: center;
  gap: 12px;

  img {
    max-width: 80px;
    border-radius: 4px;
  }
}

@include mobile {
  .apartments-page {
    padding: 24px 16px;
  }

  h1 {
    font-size: 24px;
    margin-bottom: 24px;
  }
}
</style>