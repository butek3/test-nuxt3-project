<template>
  <div class="custom-table">
    <div v-if="title" class="custom-table__filter">
      <h2 class="text-xl">{{ title }}</h2>
    </div>

    <div class="custom-table__scroll-container">
      <table class="custom-table__wrapper">
        <thead>
        <tr class="custom-table__header-line">
          <th v-for="(column, idx) in columns" :key="idx" @click="column.sortable ? handleSort(column.key) : null">
            <div class="header-cell" :class="{ 'sortable': column.sortable }">
              <slot :name="`header:${column.key}`" :item="column">
                <p class="header-text">{{ column.name }}</p>
              </slot>
              <span v-if="column.sortable" class="sort-indicator">
                  {{ getSortIndicator(column.key) }}
                </span>
            </div>
          </th>
        </tr>

        <tr :style="{ 'height': computedLineSpace + 'rem' }">
          <td :colspan="columns.length" />
        </tr>
        </thead>

        <tbody>
        <template v-for="(item, index) in data" :key="item.id || index">
          <tr class="custom-table__line">
            <slot name="row" :item="item" :index="index">
              <td v-for="column in columns" :key="`data:${column.key}`">
                <slot :name="`data:${column.key}`" :item="item" :index="index">
                  {{ item[column.key] }}
                </slot>
              </td>
            </slot>
          </tr>

          <tr v-if="index !== data.length - 1" :style="{ 'height': computedLineSpace + 'rem' }">
            <td :colspan="columns.length" />
          </tr>
        </template>
        </tbody>
      </table>
    </div>

    <div class="custom-table__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
  columns: {
    type: Array,
    default: () => []
  },
  data: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: '',
  },
  lineSpace: {
    type: Number,
    default: 8,
  },
  sortField: {
    type: String,
    default: ''
  },
  sortDirection: {
    type: String,
    default: 'asc'
  }
});

const emit = defineEmits(['sort']);

const computedLineSpace = computed(() => props.lineSpace / 16);

const handleSort = (field) => {
  let direction = 'asc';

  if (props.sortField === field) {
    direction = props.sortDirection === 'asc' ? 'desc' : 'asc';
  }

  emit('sort', field, direction);
};

const getSortIndicator = (field) => {
  if (props.sortField !== field) return '○';
  return props.sortDirection === 'asc' ? '↑' : '↓';
};
</script>

<style lang="scss" scoped>

.custom-table {
  border-radius: 0.75rem;
  padding: 1.25rem 0.5rem 1.25rem 1.25rem;
  position: relative;
  width: 100%;

  &__scroll-container {
    overflow-y: auto;
    padding-right: 0.5rem;
    scrollbar-gutter: stable;

    &::-webkit-scrollbar-track {
      margin-top: 1.5rem;
      margin-left: -0.9375rem;
    }
  }

  &__filter {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.75rem 1.25rem 0;
  }

  &__line {

    td:first-child {
      border-radius: 0.375rem 0 0 0.375rem;
    }

    td:last-child {
      border-radius: 0 0.375rem 0.375rem 0;
    }

    td {
      padding: 1.25rem;
      height: 2.5rem;
    }
  }

  &__header-line {
    th {
      cursor: default;
      padding: 0 1.25rem;

      &:first-child {
        padding-left: 1.25rem;
      }

      &:last-child {
        padding-right: 1.25rem;
      }
    }
  }

  .header-cell {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &.sortable {
      cursor: pointer;
      user-select: none;

      &:hover {
        color: orange;
      }
    }
  }

  .sort-indicator {
    font-size: 0.75rem;
    margin-left: 0.25rem;
  }

  &__footer {
    margin-top: 1.5rem;
  }
}

.header-text {
  color: black;
  font-weight: 500;
  font-size: 0.75rem;
  margin: 0;
}

.text-xl {
  font-size: 1.5rem;
  font-weight: 500;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 0.5rem;
}

@media (max-width: 768px) {
  .custom-table {
    padding: 1rem;

    thead {
      display: none;
    }

    &__line {
      display: block;
      margin-bottom: 1rem;

      td {
        display: block;
        padding: 0.75rem;
        height: auto;
        border-radius: 0.375rem !important;

        &:not(:last-child) {
          margin-bottom: 0.25rem;
        }
      }
    }
  }
}
</style>