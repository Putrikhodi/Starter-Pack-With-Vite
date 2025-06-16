// import CONFIG from '../config';
import { BASE_URL } from '../config';
import { getAccessToken } from '../utils/auth';
import { OfflineStoryQueue } from './indexeddb';

// Re-export getAccessToken, bisa diakses sebagai StoryAPI.getToken atau StoryAPI.getAccessToken
export { getAccessToken, getAccessToken as getToken };

const ENDPOINTS = {
  // Authentication
  REGISTER: `${BASE_URL}/register`,
  LOGIN: `${BASE_URL}/login`,

  // Stories
  STORY: `${BASE_URL}/stories`,
  STORY_DETAIL: (id) => `${BASE_URL.replace(/\/$/, '')}/stories/${id}`, // Pastikan hanya ada satu slash
  STORY_GUEST: `${BASE_URL}/stories/guest`,

};

export async function Register({ name, email, password }) {
  const data = JSON.stringify({ name, email, password });

  const fetchResponse = await fetch(ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function Login({ email, password }) {
  const data = JSON.stringify({ email, password });

  const fetchResponse = await fetch(ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function fetchWithAuth(url, token, options = {}) {
  const defaultOptions = {
    method: 'GET', // Default to GET if not specified
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    ...options, // Allow overriding method, body, etc.
  };

  const response = await fetch(url, defaultOptions);
  const data = await response.json(); // Always try to parse JSON for potential error messages

  if (!response.ok) {
    // Throw an error object that includes the status and parsed data for better debugging
    const error = new Error(data.message || `API request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data; // Attach the full data payload to the error
    throw error;
  }
  return data; // Return the parsed JSON data on success
}

export async function addStory({ description, photo, lat, lon }) {
  const token = getAccessToken();
  if (!token) {
    return {
      error: true,
      message: 'Unauthorized. Please login.',
      ok: false,
    };
  }

  // Jika offline → simpan ke IndexedDB
  if (!navigator.onLine) {
    try {
      const reader = new FileReader();

      const photoBase64 = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(photo); // Convert File → base64
      });

      await OfflineStoryQueue.add({
        description,
        photoBase64,
        lat,
        lon,
        token,
        timestamp: Date.now(),
      });

      console.warn('📌 Story disimpan ke queue karena offline');
      return {
        offline: true,
        message: 'Cerita disimpan untuk dikirim saat online.',
        ok: true,
      };
    } catch (error) {
      console.error('❌ Gagal simpan offline story:', error);
      return {
        error: true,
        message: 'Gagal menyimpan cerita secara offline.',
        ok: false,
      };
    }
  }

  // Jika online → langsung kirim
  try {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('photo', photo);
    if (lat !== undefined && lon !== undefined && lat !== null && lon !== null) {
      formData.append('lat', parseFloat(lat));
      formData.append('lon', parseFloat(lon));
    }

    const fetchResponse = await fetch(ENDPOINTS.STORY, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const json = await fetchResponse.json();
    return {
      ...json,
      ok: fetchResponse.ok,
    };
  } catch (error) {
    console.error('Error submitting story:', error);
    return {
      error: true,
      message: error.message || 'Failed to submit story.',
      ok: false,
    };
  }
}

export { ENDPOINTS };
