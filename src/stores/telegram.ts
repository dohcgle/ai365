import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTelegramStore = defineStore('telegram', () => {
  const tg = (window as any).Telegram?.WebApp
  
  const user = ref(tg?.initDataUnsafe?.user || null)
  const isReady = ref(false)

  const init = () => {
    if (tg) {
      tg.ready()
      tg.expand()
      isReady.value = true
      console.log('Telegram WebApp initialized', tg.initDataUnsafe)
    }
  }

  const userFullName = computed(() => {
    if (!user.value) return 'Mehmon'
    return `${user.value.first_name} ${user.value.last_name || ''}`.trim()
  })

  const closeApp = () => {
    tg?.close()
  }

  const showAlert = (message: string) => {
    tg?.showAlert(message)
  }

  return {
    tg,
    user,
    isReady,
    userFullName,
    init,
    closeApp,
    showAlert
  }
})
