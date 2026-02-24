import { useState, useEffect, useCallback } from 'react'

export interface PWAState {
  isInstalled: boolean
  isOnline: boolean
  promptInstall: (() => void) | null
}

export function usePWA(): PWAState {
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    // Проверка установки
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    // Обработчик установки PWA
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Проверка онлайн статуса
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Регистрация сервис-воркера
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW зарегистрирован:', registration.scope)
        })
        .catch((error) => {
          console.error('Ошибка регистрации SW:', error)
        })
    }

    // Запрос прав на уведомления
    if ('Notification' in window && Notification.permission === 'default') {
      // Можно запросить позже при взаимодействии
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const promptInstall = useCallback(() => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('Пользователь принял установку PWA')
      }
      setDeferredPrompt(null)
    })
  }, [deferredPrompt])

  return {
    isInstalled,
    isOnline,
    promptInstall,
  }
}
