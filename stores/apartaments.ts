import { defineStore } from 'pinia';
import type { Apartment, Filters } from '@/types';

interface ApartmentsState {
  apartments: Apartment[];
  filtered: Apartment[];
  filters: Filters;
  loading: boolean;
  hasMore: boolean;
  visible: number;
  sortField: string,
  sortDirection: string,
}

export const useApartmentsStore = defineStore('apartments', {
  state: (): ApartmentsState => ({
    apartments: [],
    filtered: [],
    filters: {
      rooms: null,
      price: [1500000, 18900000],
      area: [33, 123]
    },
    loading: false,
    hasMore: true,
    visible: 12,
    sortField: '',
    sortDirection: 'asc',
  }),

  getters: {
    visibleApartments: (state) => {
      return state.filtered.slice(0, state.visible);
    },
    activeFiltersCount: (state) => {
      let count = 0;
      if (state.filters.rooms !== null) count++;
      if (state.filters.price[0] !== 1500000 || state.filters.price[1] !== 18900000) count++;
      if (state.filters.area[0] !== 33 || state.filters.area[1] !== 123) count++;
      return count;
    }
  },

  actions: {
    async fetchApartments() {
      this.loading = true;
      try {
        const res = await fetch('/data/apartments.json');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        this.apartments = await res.json();
        this.applyFilters();
      } catch (error) {
        console.error('Failed to fetch apartments:', error);
        this.apartments = this.getMockApartments();
        this.applyFilters();
      } finally {
        this.loading = false;
      }
    },

    applyFilters() {
      this.filtered = this.apartments.filter(apartment => {
        // Фильтр по комнатам
        if (this.filters.rooms !== null && apartment.rooms !== this.filters.rooms) {
          return false;
        }

        if (apartment.price < this.filters.price[0] || apartment.price > this.filters.price[1]) {
          return false;
        }

        if (apartment.area < this.filters.area[0] || apartment.area > this.filters.area[1]) {
          return false;
        }

        return true;
      });

      this.hasMore = this.visible < this.filtered.length;
    },

    applySorting() {
      if (!this.sortField) return;

      this.visibleApartments.sort((a, b) => {
        let valueA = a[this.sortField];
        let valueB = b[this.sortField];

        if (!isNaN(valueA) && !isNaN(valueB)) {
          valueA = Number(valueA);
          valueB = Number(valueB);
        }

        if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    },

    toggleRoomFilter(rooms: number) {
      if (this.filters.rooms === rooms) {
        this.filters.rooms = null;
      } else {
        this.filters.rooms = rooms;
      }
      this.applyFilters();
    },

    setPriceFilter(min: number, max: number) {
      this.filters.price = [min, max];
      this.applyFilters();
    },

    setAreaFilter(min: number, max: number) {
      this.filters.area = [min, max];
      this.applyFilters();
    },

    resetFilters() {
      this.filters = {
        rooms: null,
        price: [1500000, 18900000],
        area: [33, 123]
      };
      this.applyFilters();
    },

    showMore() {
      this.visible += 12;
      this.hasMore = this.visible < this.filtered.length;
    },

    getMockApartments(): Apartment[] {
      return [
        {
          id: 1,
          rooms: 2,
          area: 45,
          floor: 5,
          price: 8500000,
          planImg: '/images/plans.png'
        },
        {
          id: 2,
          rooms: 2,
          area: 48,
          floor: 3,
          price: 8900000,
          planImg: '/images/plans.png'
        },
        {
          id: 3,
          rooms: 3,
          area: 65,
          floor: 7,
          price: 12500000,
          planImg: '/images/plans.png'
        }
      ];
    }
  }
});