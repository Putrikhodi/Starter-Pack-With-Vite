// AddStory.js - Class-based page component untuk integrasi penuh layout dan CSS
import { submitStory } from './AddStoryPresenter';
import { checkAuthenticatedRoute } from '../../utils/auth';

class AddStoryPage {
  #form = null;
  #descriptionInput = null;
  #photoInput = null;
  #openCameraBtn = null;
  #cameraViewDiv = null;
  #videoElement = null;
  #takePhotoBtn = null;
  #canvasElement = null;
  #photoPreviewImg = null;
  #latInput = null;
  #lonInput = null;
  #messageP = null;
  #descriptionErrorP = null;
  #photoErrorP = null;
  #mediaStream = null;
  #capturedPhotoFile = null;

  constructor() {
    checkAuthenticatedRoute();
  }

  async render() {
    return `
      <div class="content">
        <h2 class="content__heading" style="text-align:center;">Tambah Story Baru</h2>
        <div class="card" style="max-width:600px;margin:24px auto;padding:32px 24px 24px 24px;box-shadow:0 1px 8px #0001;border-radius:12px;background:#fff;">
          <form id="add-story-form" class="add-story-form">
            <div class="form-group">
              <label for="description">Deskripsi*</label>
              <input id="description" name="description" type="text" required placeholder="Tulis deskripsi..." aria-describedby="description-error" />
              <p id="description-error" class="error-message" aria-live="polite"></p>
            </div>
            <div class="form-group">
              <label for="photo">Photo* (max 1MB)</label>
              <input id="photo" name="photo" type="file" accept="image/*" aria-describedby="photo-error" />
              <button type="button" id="open-camera-btn" class="btn btn--secondary" style="margin-top: 5px;">Buka Kamera</button>
              <p id="photo-error" class="error-message" aria-live="polite"></p>
            </div>
            <div id="camera-view" style="display:none; margin-bottom:12px;">
              <video id="camera-video" autoplay playsinline style="width:100%; max-width:300px; border:1px solid #ccc;"></video>
              <button type="button" id="take-photo-btn" class="btn btn--secondary" style="margin-top:5px;">Ambil Foto</button>
              <canvas id="camera-canvas" style="display:none;"></canvas>
              <h4>Preview Foto Kamera:</h4>
              <img id="photo-preview" src="#" alt="Preview Foto" style="max-width:200px; max-height:200px; margin-top:5px; display:none; border:1px solid #ddd;" />
            </div>
            <div class="form-group">
              <label for="lat">Latitude (opsional)</label>
              <input id="lat" name="lat" type="number" step="any" placeholder="-6.200000" />
            </div>
            <div class="form-group">
              <label for="lon">Longitude (opsional)</label>
              <input id="lon" name="lon" type="number" step="any" placeholder="106.800000" />
            </div>
            <div class="form-group">
              <label>Pilih lokasi pada peta (klik marker):</label>
              <div id="add-story-map" style="height:200px; margin-bottom:12px; border-radius:8px; border:1px solid #ccc;"></div>
            </div>
            <button type="submit" class="btn btn--primary" style="width:100%">Tambah Story</button>
            <p id="add-story-message" class="message" style="margin-top:16px" aria-live="polite"></p>
          </form>
        </div>
      </div>
    `;
  }

  async afterRender() {
    this.#form = document.getElementById('add-story-form');
    this.#descriptionInput = this.#form.querySelector('#description');
    this.#photoInput = this.#form.querySelector('#photo');
    this.#openCameraBtn = this.#form.querySelector('#open-camera-btn');
    this.#cameraViewDiv = this.#form.querySelector('#camera-view');
    this.#videoElement = this.#form.querySelector('#camera-video');
    this.#takePhotoBtn = this.#form.querySelector('#take-photo-btn');
    this.#canvasElement = this.#form.querySelector('#camera-canvas');
    this.#photoPreviewImg = this.#form.querySelector('#photo-preview');
    this.#latInput = this.#form.querySelector('#lat');
    this.#lonInput = this.#form.querySelector('#lon');
    this.#messageP = this.#form.querySelector('#add-story-message');
    this.#descriptionErrorP = this.#form.querySelector('#description-error');
    this.#photoErrorP = this.#form.querySelector('#photo-error');

    // --- Inisialisasi peta Leaflet untuk pilih lat/lon ---
    if (window.L && document.getElementById('add-story-map')) {
      const map = L.map('add-story-map').setView([-6.2, 106.8], 11);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
      let marker;
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        this.#latInput.value = lat;
        this.#lonInput.value = lng;
        if (marker) {
          marker.setLatLng(e.latlng);
        } else {
          marker = L.marker(e.latlng).addTo(map);
        }
      });
    }

    this.#openCameraBtn.addEventListener('click', this.#handleOpenCamera.bind(this));
    this.#takePhotoBtn.addEventListener('click', this.#handleTakePhoto.bind(this));
    this.#form.addEventListener('submit', this.#handleSubmit.bind(this));
    window.addEventListener('beforeunload', this.#stopCameraStream.bind(this));
  }

  #stopCameraStream() {
    if (this.#mediaStream) {
      this.#mediaStream.getTracks().forEach(track => track.stop());
      this.#mediaStream = null;
      if (this.#videoElement) this.#videoElement.srcObject = null;
    }
    if (this.#cameraViewDiv) this.#cameraViewDiv.style.display = 'none';
  }

  async #handleOpenCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        this.#stopCameraStream();
        this.#mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        this.#videoElement.srcObject = this.#mediaStream;
        this.#cameraViewDiv.style.display = 'block';
        this.#photoPreviewImg.style.display = 'none';
        this.#capturedPhotoFile = null;
        this.#messageP.textContent = '';
        this.#photoErrorP.textContent = '';
      } catch (err) {
        console.error('Error accessing camera:', err);
        this.#messageP.textContent = 'Tidak bisa mengakses kamera: ' + err.message;
        this.#messageP.style.color = 'red';
        this.#stopCameraStream();
      }
    } else {
      this.#messageP.textContent = 'getUserMedia tidak didukung di browser ini.';
      this.#messageP.style.color = 'red';
    }
  }

  #handleTakePhoto() {
    if (this.#mediaStream && this.#videoElement.readyState === this.#videoElement.HAVE_ENOUGH_DATA) {
      this.#canvasElement.width = this.#videoElement.videoWidth;
      this.#canvasElement.height = this.#videoElement.videoHeight;
      const context = this.#canvasElement.getContext('2d');
      context.drawImage(this.#videoElement, 0, 0, this.#canvasElement.width, this.#canvasElement.height);
      this.#canvasElement.toBlob((blob) => {
        this.#capturedPhotoFile = new File([blob], "camera_photo.jpg", { type: 'image/jpeg' });
        this.#photoPreviewImg.src = URL.createObjectURL(this.#capturedPhotoFile);
        this.#photoPreviewImg.style.display = 'block';
        this.#messageP.textContent = 'Foto berhasil diambil dari kamera.';
        this.#messageP.style.color = 'green';
        this.#photoErrorP.textContent = '';
        this.#stopCameraStream();
      }, 'image/jpeg', 0.9);
    } else {
      this.#messageP.textContent = 'Stream kamera belum siap atau tidak ada.';
      this.#messageP.style.color = 'red';
    }
  }

  async #handleSubmit(event) {
    event.preventDefault();
    let isValid = true;
    this.#descriptionErrorP.textContent = '';
    this.#photoErrorP.textContent = '';
    this.#messageP.textContent = '';

    if (!this.#descriptionInput.value.trim()) {
      this.#descriptionErrorP.textContent = 'Deskripsi wajib diisi.';
      isValid = false;
    }
    const photoFile = this.#photoInput.files[0];
    if (!photoFile && !this.#capturedPhotoFile) {
      this.#photoErrorP.textContent = 'Photo wajib diunggah atau diambil dari kamera.';
      isValid = false;
    } else if (photoFile && photoFile.size > 1000000) {
      this.#photoErrorP.textContent = 'Ukuran foto maksimal 1MB.';
      isValid = false;
    } else if (this.#capturedPhotoFile && this.#capturedPhotoFile.size > 1000000) {
      this.#photoErrorP.textContent = 'Ukuran foto dari kamera maksimal 1MB.';
      isValid = false;
    }

    if (!isValid) {
      this.#messageP.textContent = 'Harap perbaiki error pada form.';
      this.#messageP.style.color = 'red';
      return;
    }

    this.#messageP.textContent = 'Mengirim...';
    this.#messageP.style.color = 'black';
    const response = await submitStory({
      description: this.#descriptionInput.value.trim(),
      photo: this.#capturedPhotoFile || photoFile,
      lat: this.#latInput.value ? parseFloat(this.#latInput.value) : undefined,
      lon: this.#lonInput.value ? parseFloat(this.#lonInput.value) : undefined,
    });
    if (response.ok) {
      this.#messageP.textContent = 'Story berhasil ditambahkan!';
      this.#messageP.style.color = 'green';
      this.#form.reset();
      this.#photoInput.value = '';
      this.#capturedPhotoFile = null;
      this.#photoPreviewImg.style.display = 'none';
      this.#photoPreviewImg.src = '#';
      this.#stopCameraStream();
    } else {
      this.#messageP.textContent = response.message || 'Gagal menambah story.';
      this.#messageP.style.color = 'red';
    }
  }
}

export default AddStoryPage;

/**
 * Inisialisasi form tambah story di dalam elemen dengan id 'add-story-root'.
 * Pastikan ada elemen <div id="add-story-root"></div> di HTML.
 */
export function initAddStoryForm() {
  // Buat elemen form
  const root = document.getElementById('add-story-root');
  if (!root) {
    console.error('Element #add-story-root tidak ditemukan');
    return;
  }
  root.innerHTML = '';

  // --- Buat form HTML ---
  const form = document.createElement('form');
  form.style.maxWidth = '400px';
  form.style.margin = '0 auto';

  // --- Variabel untuk stream kamera dan foto yang diambil ---
  let mediaStream = null;
  let capturedPhotoFile = null;

  form.innerHTML = `
    <h2>Tambah Story Baru</h2>
    <div style="margin-bottom:12px">
      <label for="description">Deskripsi*</label><br />
      <input id="description" type="text" required placeholder="Tulis deskripsi..." style="width:100%" />
    </div>
    <div style="margin-bottom:12px">
      <label for="photo">Photo* (max 1MB)</label><br />
      <input id="photo" type="file" accept="image/*" />
      <button type="button" id="open-camera-btn" style="margin-top: 5px;">Buka Kamera</button>
    </div>
    <div id="camera-view" style="display:none; margin-bottom:12px;">
      <video id="camera-video" autoplay playsinline style="width:100%; max-width:300px; border:1px solid #ccc;"></video>
      <button type="button" id="take-photo-btn" style="margin-top:5px;">Ambil Foto</button>
      <canvas id="camera-canvas" style="display:none;"></canvas>
      <h4>Preview Foto Kamera:</h4>
      <img id="photo-preview" src="#" alt="Preview Foto" style="max-width:200px; max-height:200px; margin-top:5px; display:none; border:1px solid #ddd;" />
    </div>
    <div style="margin-bottom:12px">
      <label for="lat">Latitude (opsional)</label><br />
      <input id="lat" type="number" step="any" placeholder="-6.2" style="width:100%" />
    </div>
    <div style="margin-bottom:12px">
      <label for="lon">Longitude (opsional)</label><br />
      <input id="lon" type="number" step="any" placeholder="106.8" style="width:100%" />
    </div>
    <button type="submit" style="width:100%">Tambah Story</button>
    <p id="add-story-message" style="margin-top:16px"></p>
  `;

  // --- Tambah form ke root ---
  root.appendChild(form);

  // --- Ambil elemen input dan pesan ---
  const descriptionInput = form.querySelector('#description');
  const photoInput = form.querySelector('#photo');
  const openCameraBtn = form.querySelector('#open-camera-btn');
  const cameraViewDiv = form.querySelector('#camera-view');
  const videoElement = form.querySelector('#camera-video');
  const takePhotoBtn = form.querySelector('#take-photo-btn');
  const canvasElement = form.querySelector('#camera-canvas');
  const photoPreviewImg = form.querySelector('#photo-preview');
  const latInput = form.querySelector('#lat');
  const lonInput = form.querySelector('#lon');
  const messageP = form.querySelector('#add-story-message');

  /**
   * Handle submit form
   */
  /**
   * Fungsi untuk menghentikan stream kamera
   */
  function stopCameraStream() {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      mediaStream = null;
      if (videoElement) videoElement.srcObject = null;
    }
    if (cameraViewDiv) cameraViewDiv.style.display = 'none';
  }

  /**
   * Event listener untuk tombol Buka Kamera
   */
  openCameraBtn.onclick = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        // Hentikan stream lama jika ada
        stopCameraStream(); 
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        videoElement.srcObject = mediaStream;
        cameraViewDiv.style.display = 'block';
        photoPreviewImg.style.display = 'none'; // Sembunyikan preview lama
        capturedPhotoFile = null; // Reset foto lama
        messageP.textContent = ''; // Bersihkan pesan error/sukses lama
      } catch (err) {
        console.error('Error accessing camera:', err);
        messageP.textContent = 'Tidak bisa mengakses kamera: ' + err.message;
        messageP.style.color = 'red';
        stopCameraStream();
      }
    } else {
      messageP.textContent = 'getUserMedia tidak didukung di browser ini.';
      messageP.style.color = 'red';
    }
  };

  /**
   * Event listener untuk tombol Ambil Foto
   */
  takePhotoBtn.onclick = () => {
    if (mediaStream && videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;
      const context = canvasElement.getContext('2d');
      context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
      
      canvasElement.toBlob((blob) => {
        capturedPhotoFile = new File([blob], "camera_photo.jpg", { type: 'image/jpeg' });
        photoPreviewImg.src = URL.createObjectURL(capturedPhotoFile);
        photoPreviewImg.style.display = 'block';
        messageP.textContent = 'Foto berhasil diambil dari kamera.';
        messageP.style.color = 'green';
        // Setelah foto diambil, hentikan stream kamera
        stopCameraStream();
      }, 'image/jpeg', 0.9); // Kualitas 0.9
    } else {
      messageP.textContent = 'Stream kamera belum siap atau tidak ada.';
      messageP.style.color = 'red';
    }
  };

  /**
   * Handle submit form
   */
  form.onsubmit = async (e) => {
    e.preventDefault();
    // Validasi sederhana
    if (!descriptionInput.value.trim()) {
      messageP.textContent = 'Deskripsi wajib diisi.';
      messageP.style.color = 'red';
      return;
    }
    // Validasi: harus ada foto dari file input ATAU dari kamera
    if (!photoInput.files[0] && !capturedPhotoFile) {
      messageP.textContent = 'Photo wajib diunggah.';
      messageP.style.color = 'red';
      return;
    }
    messageP.textContent = 'Mengirim...';
    messageP.style.color = 'black';
    // Kirim ke presenter
    const response = await submitStory({
      description: descriptionInput.value.trim(),
      photo: capturedPhotoFile || photoInput.files[0], // Prioritaskan foto dari kamera
      lat: latInput.value ? parseFloat(latInput.value) : undefined,
      lon: lonInput.value ? parseFloat(lonInput.value) : undefined,
    });
    if (response.ok) {
      messageP.textContent = 'Story berhasil ditambahkan!';
      messageP.style.color = 'green';
      form.reset();
      photoInput.value = ''; // Pastikan input file juga direset
      capturedPhotoFile = null;
      photoPreviewImg.style.display = 'none';
      photoPreviewImg.src = '#';
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
      }
      cameraViewDiv.style.display = 'none';
    } else {
      messageP.textContent = response.message || 'Gagal menambah story.';
      messageP.style.color = 'red';
    }
  };

  window.addEventListener('hashchange', stopCameraStream);
}

// Agar form otomatis terinisialisasi jika file ini di-load langsung
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('add-story-root')) {
    initAddStoryForm();
  }
});
