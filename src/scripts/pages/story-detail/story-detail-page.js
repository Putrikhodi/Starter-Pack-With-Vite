// story-detail-page.js

import { BASE_URL } from '../../config';
import { fetchWithAuth } from '../../data/api'; // Pastikan path ini benar
import {
  generateSubscribeButtonTemplate,
  generateUnsubscribeButtonTemplate,
  generateSaveReportButtonTemplate,
  generateRemoveReportButtonTemplate,
} from '../../templates'; // Pastikan path ini benar
import {
  initPushNotification,
  subscribeToPushNotification,
  unsubscribePushNotification
} from '../../../main'; // Pastikan path ini benar
import { StoryDB } from '../../data/indexeddb'; // Pastikan path ini benar

export default class StoryDetailPage {
  constructor() {}

  async render() {
    return `
      <div class="content">
        <div class="card" id="story-detail-card" style="max-width:600px;margin:24px auto;padding:32px 24px 24px 24px;box-shadow:0 1px 8px #0001;border-radius:12px;background:#fff;">
          <div id="story-detail-loading">Loading detail story...</div>
          <div id="story-detail-content" style="display:none"></div>
        </div>
      </div>
    `;
  }

  async afterRender() {
    const hash = window.location.hash;
    const idMatch = hash.match(/#\/stories\/(.+)$/);
    const id = idMatch ? idMatch[1] : null;
    const loadingDiv = document.getElementById('story-detail-loading');
    const contentDiv = document.getElementById('story-detail-content');

    if (!id) {
      loadingDiv.textContent = 'ID story tidak ditemukan di URL.';
      return;
    }

    loadingDiv.textContent = 'Mengambil data...';

    let story = null;
    let imageUrl = '';
    let isOffline = false; // Flag untuk menandakan apakah data diambil secara offline

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) { // Pastikan ada token sebelum fetch
        throw new Error('User not authenticated.');
      }
      const response = await fetch(`${BASE_URL}/stories/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        // Jika respons bukan ok, berarti ada masalah (offline, 4xx, 5xx)
        // Kita anggap ini sebagai sinyal untuk mencoba mode offline
        throw new Error('Gagal mengambil dari server, mencoba mode offline.');
      }

      const data = await response.json();
      story = data.story;
      imageUrl = story.photoUrl; // Default pakai dari online
      console.log('[StoryDetailPage] Story loaded online:', story);

    } catch (err) {
      console.warn('[StoryDetailPage] Gagal fetch online:', err.message, 'Mencoba dari IndexedDB...');
      isOffline = true; // Set flag offline
      const offlineStory = await StoryDB.getStory(id);

      if (!offlineStory) {
        loadingDiv.textContent = 'Gagal mengambil detail story: ' + err.message + ' dan tidak ada di penyimpanan offline.';
        return;
      }

      story = offlineStory;
      // Gunakan photoBlob dari IndexedDB jika ada
      if (story.photoBlob) {
        imageUrl = URL.createObjectURL(story.photoBlob);
        console.log('✅ Menggunakan photoBlob offline dari IndexedDB', story.photoBlob);
      } else {
        imageUrl = '';
        console.warn('⚠️ photoBlob tidak ditemukan di story offline!');
      }
      console.log('[StoryDetailPage] Story loaded offline:', story);
    }

    // Render konten cerita
    contentDiv.innerHTML = `
      ${imageUrl ? `<img src="${imageUrl}" alt="${story.name}" style="width:100%;max-width:350px;display:block;margin:0 auto 16px auto;border-radius:8px;object-fit:cover;" />` : ''}
      <h2 style="margin-bottom:8px;">${story.name}</h2>
      <div style="color:#888;font-size:0.95em;margin-bottom:10px;">${new Date(story.createdAt).toLocaleString()}</div>
      <div style="margin-bottom:16px;">${story.description}</div>
      <div id="story-detail-map" style="height:200px;border-radius:8px;border:1px solid #ccc;margin-bottom:12px;"></div>
      <div id="notif-btn" style="text-align:center;margin-top:16px;"></div>
      <div id="save-actions-container" style="text-align:center;margin-top:16px;"></div>
    `;

    loadingDiv.style.display = 'none';
    contentDiv.style.display = 'block';

    // === MAP ===
    if (window.L && story.lat && story.lon) {
      const map = L.map('story-detail-map').setView([story.lat, story.lon], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
      L.marker([story.lat, story.lon]).addTo(map)
        .bindPopup(`<b>${story.name}</b><br>${story.description}`)
        .openPopup();
    } else {
      document.getElementById('story-detail-map').innerHTML = '<div style="color:#888;text-align:center;padding-top:70px;">Tidak ada lokasi</div>';
    }

    // === NOTIFICATION BUTTON ===
    const notifBtn = document.getElementById('notif-btn');
    notifBtn.innerHTML = generateSubscribeButtonTemplate();
    await initPushNotification(); // Hanya inisialisasi, jangan subscribe langsung

    const setupNotificationButton = () => {
      document.getElementById('subscribe-btn')?.addEventListener('click', async () => {
        try {
          // Tidak perlu await initPushNotification() lagi di sini, sudah di afterRender
          await subscribeToPushNotification(); // Perluas main.js agar subscribeToPushNotification tidak memerlukan parameter registration
          notifBtn.innerHTML = generateUnsubscribeButtonTemplate();
          setupNotificationButton();
        } catch (e) {
          alert('Gagal subscribe: ' + e.message);
        }
      });

      document.getElementById('unsubscribe-btn')?.addEventListener('click', async () => {
        try {
          await unsubscribePushNotification();
          notifBtn.innerHTML = generateSubscribeButtonTemplate();
          setupNotificationButton();
        } catch (e) {
          alert('Gagal unsubscribe: ' + e.message);
        }
      });
    };

    setupNotificationButton();

    // === SIMPAN / HAPUS STORY OFFLINE ===
    const saveContainer = document.getElementById('save-actions-container');
    // Cek apakah story sudah tersimpan di IndexedDB saat ini
    const existingStoryInDb = await StoryDB.getStory(story.id);

    const renderSaveButton = (isSaved) => {
      saveContainer.innerHTML = isSaved
        ? generateRemoveReportButtonTemplate()
        : generateSaveReportButtonTemplate();

      const saveBtn = document.getElementById('report-detail-save');
      const removeBtn = document.getElementById('report-detail-remove');

      if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
          try {
            // Ambil foto dan ubah jadi Blob
            // Ini akan mem-fetch gambar dari URL, jadi hanya bekerja saat online
            // Jika Anda ingin menyimpan gambar saat offline, Anda harus punya cache atau mekanisme lain
            console.log('[StoryDetailPage] Attempting to save story offline:', story.photoUrl);
            const response = await fetch(story.photoUrl); // Ini butuh online
            if (!response.ok) {
                throw new Error('Gagal mengambil gambar dari jaringan untuk disimpan offline. Pastikan Anda online.');
            }
            const blob = await response.blob();
            console.log('[StoryDetailPage] Fetched photo as blob:', blob);

            await StoryDB.saveStory({
              id: story.id,
              name: story.name,
              description: story.description,
              createdAt: story.createdAt,
              lat: story.lat,
              lon: story.lon,
              photoBlob: blob, // <-- Pastikan ini objek Blob yang benar
              photoUrl: story.photoUrl // Simpan juga URL aslinya
            });
            alert('Story berhasil disimpan untuk offline!');
            renderSaveButton(true);
          } catch (error) {
            console.error('[StoryDetailPage] Gagal menyimpan story offline:', error);
            alert('Gagal menyimpan story untuk offline: ' + error.message);
          }
        });
      }

      if (removeBtn) {
        removeBtn.addEventListener('click', async () => {
          try {
            await StoryDB.deleteStory(story.id);
            alert('Story offline berhasil dihapus.');
            renderSaveButton(false);
          } catch (error) {
            console.error('[StoryDetailPage] Gagal menghapus story offline:', error);
            alert('Gagal menghapus story: ' + error.message);
          }
        });
      }
    };

    renderSaveButton(!!existingStoryInDb); // Cek status simpan berdasarkan `existingStoryInDb`

    // === CLEAR SEMUA STORY OFFLINE DARI STORY_STORE ===
    // Tambahkan ini di tempat yang masuk akal, mungkin di halaman daftar story
    // atau di footer aplikasi, karena ini operasi global.
    // Menyimpannya di halaman detail story mungkin membingungkan pengguna.
    // Jika Anda ingin tetap di sini, maka ini sudah benar secara kode.
    const clearBtnContainer = document.createElement('div');
    clearBtnContainer.style.textAlign = 'center';
    clearBtnContainer.style.marginTop = '12px';

    clearBtnContainer.innerHTML = `
      <button id="clear-offline-btn" style="padding:10px 16px;border:none;background:#e53935;color:#fff;border-radius:8px;cursor:pointer;">
        Hapus Semua Story Offline (Cache Lokal)
      </button>
    `;

    contentDiv.appendChild(clearBtnContainer);

    document.getElementById('clear-offline-btn')?.addEventListener('click', async () => {
      const confirmed = confirm('Yakin ingin menghapus semua story offline yang tersimpan? Ini akan menghapus data yang di-cache secara manual.');
      if (confirmed) {
        try {
          await StoryDB.clearAllStories();
          alert('Semua story offline berhasil dihapus.');
          // Setelah menghapus semua, pastikan tombol render ulang ke status "Simpan"
          renderSaveButton(false);
        } catch (error) {
          console.error('[StoryDetailPage] Gagal menghapus semua story offline:', error);
          alert('Gagal menghapus semua story offline: ' + error.message);
        }
      }
    });
  }
}