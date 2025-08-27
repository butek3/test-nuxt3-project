import { defineStore } from 'pinia'

interface AppState {
  count: number
  lastUpdated: string
}

export const useAppStore = defineStore('app', () => {
  const state = reactive<AppState>({
    count: 0,
    lastUpdated: new Date().toISOString()
  })

  const loadFromStorage = (): AppState => {
    if (process.client) {
      try {
        const saved = localStorage.getItem('app-store')
        return saved ? JSON.parse(saved) : { count: 0, lastUpdated: new Date().toISOString() }
      } catch (error) {
        console.error('Error loading from localStorage:', error)
        return { count: 0, lastUpdated: new Date().toISOString() }
      }
    }
    return { count: 0, lastUpdated: new Date().toISOString() }
  }

  const saveToStorage = (data: AppState) => {
    if (process.client) {
      try {
        localStorage.setItem('app-store', JSON.stringify(data))
      } catch (error) {
        console.error('Error saving to localStorage:', error)
      }
    }
  }

  const savedState = loadFromStorage()
  state.count = savedState.count
  state.lastUpdated = savedState.lastUpdated

  const increment = () => {
    state.count++
    state.lastUpdated = new Date().toISOString()
    saveToStorage(state)
  }

  const decrement = () => {
    state.count--
    state.lastUpdated = new Date().toISOString()
    saveToStorage(state)
  }

  const reset = () => {
    state.count = 0
    state.lastUpdated = new Date().toISOString()
    saveToStorage(state)
  }

  const setCount = (value: number) => {
    state.count = value
    state.lastUpdated = new Date().toISOString()
    saveToStorage(state)
  }

  const isEven = computed(() => state.count % 2 === 0)
  const isPositive = computed(() => state.count > 0)

  return {
    count: computed(() => state.count),
    lastUpdated: computed(() => state.lastUpdated),
    isEven,
    isPositive,
    increment,
    decrement,
    reset,
    setCount
  }
})