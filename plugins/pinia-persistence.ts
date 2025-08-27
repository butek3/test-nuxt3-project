export default defineNuxtPlugin(() => {
  return {
    provide: {
      piniaPersist: (store: any, key: string) => {
        if (process.client) {
          const saved = localStorage.getItem(key)
          if (saved) {
            store.$patch(JSON.parse(saved))
          }
        }

        store.$subscribe((mutation: any, state: any) => {
          if (process.client) {
            localStorage.setItem(key, JSON.stringify(state))
          }
        })
      }
    }
  }
})