// main.js

import { OfflineStoryQueue } from './scripts/data/indexeddb';
import { ENDPOINTS } from './scripts/data/api';

// Konfigurasi dasar aplikasi
const config = {
  vapidPublicKey: 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk',
  apiBaseUrl: 'https://story-api.dicoding.dev/v1',
};

console.log('[Main] Script loaded.');

// ==== 🔒 Token Akses ====
export function getAccessToken() {
  const token = localStorage.getItem('accessToken');
  console.log('[Auth] Access token:', token ? `***${token.slice(-5)}` : 'Tidak ada token');
  return token;
}

// ==== 🔐 VAPID Key Converter ====
export function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

// ==== 🔔 Push Notification Setup ====
export async function initPushNotification() {
  try {
    const registration = await navigator.serviceWorker.ready;
    console.log('[Push] Service Worker siap:', registration.scope);

    const permission = await Notification.requestPermission();
    console.log('[Push] Izin notifikasi:', permission);

    if (permission !== 'granted') {
      console.warn('[Push] Izin tidak diberikan');
      return null;
    }

    return registration;
  } catch (error) {
    console.error('[Push] Gagal inisialisasi:', error);
    throw error;
  }
}

export async function subscribeToPushNotification() {
  try {
    const registration = await navigator.serviceWorker.ready;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(config.vapidPublicKey),
    });

    const userToken = getAccessToken();
    if (!userToken) throw new Error('User belum login');

    const p256dh = btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh'))));
    const auth = btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth'))));

    const response = await fetch(`${config.apiBaseUrl}/notifications/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
        keys: { p256dh, auth },
      }),
    });

    if (!response.ok) throw new Error('Gagal kirim subscription ke server');

    console.log('[Push] ✅ Berhasil subscribe');
    return true;
  } catch (error) {
    console.error('[Push] ❌ Gagal subscribe:', error);
    throw error;
  }
}

export async function unsubscribePushNotification() {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      console.warn('[Push] Tidak ada subscription aktif');
      return false;
    }

    await subscription.unsubscribe();

    const userToken = getAccessToken();
    if (!userToken) throw new Error('User belum login');

    const response = await fetch(`${config.apiBaseUrl}/notifications/subscribe`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
      body: JSON.stringify({ endpoint: subscription.endpoint }),
    });

    if (!response.ok) throw new Error('Gagal hapus subscription dari server');

    console.log('[Push] ✅ Berhasil unsubscribe');
    return true;
  } catch (error) {
    console.error('[Push] ❌ Gagal unsubscribe:', error);
    throw error;
  }
}

// ==== 🔄 Service Worker Registration ====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(registration => {
        console.log('[Service Worker] Registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('[Service Worker] Registration failed:', error);
      });
  });
}

// ==== 📡 Sinkronisasi Otomatis Saat Online ====
window.addEventListener('online', async () => {
  console.log('[Sync] Online kembali, mulai sinkronisasi story offline...');
  const queue = await OfflineStoryQueue.getAll();

  for (const story of queue) {
    const { description, photoBase64, lat, lon, token, id } = story;

    try {
      const blob = await (await fetch(photoBase64)).blob();
      const file = new File([blob], 'photo.jpg', { type: blob.type });

      const formData = new FormData();
      formData.append('description', description);
      formData.append('photo', file);
      if (lat !== undefined && lon !== undefined) {
        formData.append('lat', parseFloat(lat));
        formData.append('lon', parseFloat(lon));
      }

      const res = await fetch(ENDPOINTS.STORY, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        await OfflineStoryQueue.delete(id);
        console.log('✅ Berhasil kirim story dari offline queue');
      } else {
        console.warn('⚠️ Gagal kirim story, akan dicoba ulang nanti');
      }
    } catch (error) {
      console.error('❌ Error saat upload story offline:', error);
    }
  }
});