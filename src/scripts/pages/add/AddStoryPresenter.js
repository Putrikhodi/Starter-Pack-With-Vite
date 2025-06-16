// AddStoryPresenter.js
// Presenter untuk fitur tambah story, dipakai oleh AddStory.js (vanilla JS)

import { addStory } from '../../data/api';

/**
 * submitStory
 * Fungsi untuk mengirim story baru ke backend melalui API
 * @param {Object} param0
 * @param {string} param0.description - Deskripsi story
 * @param {File} param0.photo - File foto (image)
 * @param {number} [param0.lat] - Latitude (opsional)
 * @param {number} [param0.lon] - Longitude (opsional)
 * @returns {Promise<{ok: boolean, message?: string}>}
 */
export async function submitStory({ description, photo, lat, lon }) {
  try {
    // Panggil fungsi addStory dari data/api.js
    const response = await addStory({ description, photo, lat, lon });
    // Kembalikan response dari API (format: {ok, message, dst})
    return response;
  } catch (error) {
    // Handle error (misal: jaringan, format data, dsb)
    return { ok: false, message: error.message };
  }
}
