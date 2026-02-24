/// <reference lib="webworker" />

const CACHE_NAME = 'infwiki-v1'
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
]

// Установка сервис-воркера
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE)
    })
  )
  self.skipWaiting()
})

// Активация и очистка старых кэшей
self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    })
  )
  self.clients.claim()
})

// Перехват запросов
self.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event
  const url = new URL(request.url)

  // API запросы к Gemini - network first
  if (url.hostname === 'generativelanguage.googleapis.com') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone)
          })
          return response
        })
        .catch(() => {
          return caches.match(request)
        })
    )
    return
  }

  // Статические ресурсы - cache first
  if (request.destination === 'image' ||
      request.destination === 'style' ||
      request.destination === 'script') {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        return cachedResponse || fetch(request)
      })
    )
    return
  }

  // HTML страницы - network first с fallback в кэш
  event.respondWith(
    fetch(request)
      .then((response) => {
        const responseClone = response.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseClone)
        })
        return response
      })
      .catch(() => {
        return caches.match(request).then((cachedResponse) => {
          return cachedResponse || caches.match('/index.html')
        })
      })
  )
})

// Синхронизация в фоне
self.addEventListener('sync', (event: SyncEvent) => {
  if (event.tag === 'sync-bookmarks') {
    event.waitUntil(syncBookmarks())
  }
})

async function syncBookmarks() {
  // Логика синхронизации закладок
  console.log('Синхронизация закладок в фоне')
}

// Push уведомления
self.addEventListener('push', (event: PushEvent) => {
  const data = event.data?.json() || {}
  const { title, body, icon } = data

  event.waitUntil(
    self.registration.showNotification(title || 'InfWIKI', {
      body: body || 'Новая статья доступна',
      icon: icon || '/favicon.svg',
      badge: '/favicon.svg',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
      },
    })
  )
})

// Клик по уведомлению
self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close()
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  )
})
