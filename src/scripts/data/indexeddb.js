// indexeddb.js

import { openDB } from 'idb';

const DB_NAME = 'story-app-db';
const DB_VERSION = 2; // Pastikan ini tetap 2, sesuai dengan yang di sw.js
const STORY_STORE = 'stories';
const OFFLINE_STORE = 'offline-stories';

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db, oldVersion) {
    if (!db.objectStoreNames.contains(STORY_STORE)) {
      db.createObjectStore(STORY_STORE, { keyPath: 'id' });
    }

    if (oldVersion < 2 && !db.objectStoreNames.contains(OFFLINE_STORE)) {
      db.createObjectStore(OFFLINE_STORE, { keyPath: 'id', autoIncrement: true });
    }
    console.log(`[IndexedDB] Database upgraded/created to version ${db.version}.`);
  }
});

export const StoryDB = {
  async saveStory(story) {
    const db = await dbPromise;
    const storyToSave = { ...story };
    // Saat menyimpan ke STORY_STORE (yang disimpan manual),
    // konversi photoBlob (jika ada dan berupa Blob) ke ArrayBuffer untuk penyimpanan.
    if (storyToSave.photoBlob instanceof Blob) {
      storyToSave._photoBlobData = await storyToSave.photoBlob.arrayBuffer();
      storyToSave._photoBlobType = storyToSave.photoBlob.type;
      delete storyToSave.photoBlob; // Hapus referensi Blob asli agar tidak disimpan ganda/loop
    } else {
        // Pastikan properti ini tidak ada jika tidak ada gambar
        delete storyToSave._photoBlobData;
        delete storyToSave._photoBlobType;
    }
    console.log('[StoryDB] Saving story:', storyToSave);
    return db.put(STORY_STORE, storyToSave);
  },

  async getStory(id) {
    const db = await dbPromise;
    const story = await db.get(STORY_STORE, id);
    // Saat mengambil dari STORY_STORE, konversi kembali ArrayBuffer ke Blob
    if (story && story._photoBlobData) {
      story.photoBlob = new Blob([story._photoBlobData], { type: story._photoBlobType || 'image/jpeg' });
      // Hapus properti internal setelah konversi jika tidak lagi diperlukan di luar DB
      delete story._photoBlobData;
      delete story._photoBlobType;
    }
    console.log('[StoryDB] Retrieved story:', story);
    return story;
  },

  async getAllStories() {
    const db = await dbPromise;
    const stories = await db.getAll(STORY_STORE);
    // Konversi untuk setiap cerita yang diambil
    return stories.map(story => {
      if (story._photoBlobData) {
        story.photoBlob = new Blob([story._photoBlobData], { type: story._photoBlobType || 'image/jpeg' });
        delete story._photoBlobData;
        delete story._photoBlobType;
      }
      return story;
    });
  },

  async deleteStory(id) {
    const db = await dbPromise;
    console.log('[StoryDB] Deleting story with ID:', id);
    return db.delete(STORY_STORE, id);
  },

  async clearAllStories() {
    const db = await dbPromise;
    console.log('[StoryDB] Clearing all stories from STORY_STORE.');
    return db.clear(STORY_STORE);
  }
};

export const OfflineStoryQueue = {
  async add(story) {
    const db = await dbPromise;
    const storyToSave = { ...story };
    // Saat menyimpan ke OFFLINE_STORE, photo adalah objek File dari input form.
    // Konversi ke ArrayBuffer untuk penyimpanan.
    if (storyToSave.photo instanceof File) {
      storyToSave.photoBlob = await storyToSave.photo.arrayBuffer();
      storyToSave.photoName = storyToSave.photo.name;
      storyToSave.photoType = storyToSave.photo.type;
      delete storyToSave.photo; // Hapus objek File asli
    } else {
        delete storyToSave.photoBlob;
        delete storyToSave.photoName;
        delete storyToSave.photoType;
    }
    // Pastikan token otentikasi disimpan bersama cerita
    storyToSave.token = localStorage.getItem('accessToken');
    storyToSave.timestamp = new Date().toISOString(); // Mungkin berguna untuk keyPath autoIncrement
    console.log('[OfflineStoryQueue] Adding story to queue:', storyToSave);
    return db.add(OFFLINE_STORE, storyToSave);
  },

  async getAll() {
    const db = await dbPromise;
    console.log('[OfflineStoryQueue] Getting all stories from queue.');
    const stories = await db.getAll(OFFLINE_STORE);
    // Di sini kita tidak perlu mengonversi photoBlob kembali ke Blob
    // karena SW yang akan mengambilnya dan melakukan konversi saat membuat FormData.
    return stories;
  },

  async delete(id) {
    const db = await dbPromise;
    console.log('[OfflineStoryQueue] Deleting story from queue with ID:', id);
    return db.delete(OFFLINE_STORE, id);
  },

  async clearAll() {
    const db = await dbPromise;
    console.log('[OfflineStoryQueue] Clearing all stories from OFFLINE_STORE.');
    return db.clear(OFFLINE_STORE);
  }
};