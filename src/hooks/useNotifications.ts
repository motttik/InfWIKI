import { useState, useEffect, useCallback } from 'react'

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    const supported = 'Notification' in window
    setIsSupported(supported)

    if (supported) {
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = useCallback(async () => {
    if (!isSupported) return 'denied' as NotificationPermission

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result
    } catch (error) {
      console.error('Notification permission error:', error)
      return 'denied'
    }
  }, [isSupported])

  const sendNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (!isSupported || permission !== 'granted') return null

      const notification = new Notification(title, {
        ...options,
        icon: options?.icon || '/favicon.svg',
        badge: '/favicon.svg',
      })

      // Автозакрытие через 5 секунд
      setTimeout(() => notification.close(), 5000)

      return notification
    },
    [isSupported, permission]
  )

  const notifyNewArticle = useCallback(
    (topic: string) => {
      return sendNotification('📚 InfWIKI', {
        body: `Новая статья: ${topic}`,
        icon: '/favicon.svg',
        data: { topic },
      })
    },
    [sendNotification]
  )

  const notifyDailyTip = useCallback(
    (tip: string) => {
      return sendNotification('💡 InfWIKI — Совет дня', {
        body: tip,
        icon: '/favicon.svg',
      })
    },
    [sendNotification]
  )

  return {
    permission,
    isSupported,
    requestPermission,
    sendNotification,
    notifyNewArticle,
    notifyDailyTip,
  }
}
