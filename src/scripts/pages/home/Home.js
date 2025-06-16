import {
  generateLoaderAbsoluteTemplate,
  generateReportItemTemplate,
  generateReportsListEmptyTemplate,
  generateReportsListErrorTemplate,
} from '../../templates';
import * as StoryAPI from '../../data/api';
import HomePresenter from './HomePresenter';
// import Map from '../../utils/map';


export default class HomePage {
  #presenter = null;
  #map = null;
  async render() {
    return `
      <section class="container">
        <h1 class="section-title">Daftar MyStory</h1>
        <div class="reports-list__container">
          <div id="reports-list"></div>
          <div id="reports-list-loading-container"></div>
        </div>
        <div id="map"></div>
        <div id="map-loading-container"></div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      apiUrl: 'https://story-api.dicoding.dev/v1/stories',
      getToken: StoryAPI.getToken, // pastikan getToken ada di StoryAPI
    });
    try {
      const stories = await this.#presenter.getStories();
      this.populateReportsList('', stories);
    } catch (error) {
      this.populateReportsListError(error.message);
    }
  }

  populateReportsList(message, reports) {
    if (reports.length <= 0) {
      this.populateReportsListEmpty();
      return;
    }

    const html = reports.reduce((accumulator, story) => {
      return accumulator.concat(
        generateReportItemTemplate({
          ...story,
          placeName: story.placeName
        }),
      );
    }, '');

    document.getElementById('reports-list').innerHTML = `
      <div class="reports-list">${html}</div>
    `;

    // Inisialisasi peta dan marker setelah daftar render
    this.initialMap(reports);
  }

  populateReportsListEmpty() {
    document.getElementById('reports-list').innerHTML = generateReportsListEmptyTemplate();
  }

  populateReportsListError(message) {
    document.getElementById('reports-list').innerHTML = generateReportsListErrorTemplate(message);
  }

  async initialMap(reports = []) {
    if (this.#map) return; // Hindari inisialisasi ulang
    // Pastikan Leaflet sudah tersedia
    if (!window.L) {
      console.error('Leaflet belum dimuat. Pastikan sudah import Leaflet di index.html');
      return;
    }
    // Default lokasi Indonesia
    const defaultLat = -2.5489;
    const defaultLon = 118.0149;
    const map = window.L.map('map').setView([defaultLat, defaultLon], 4.5);
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    // Tambahkan marker untuk setiap report yang punya lat/lon
    if (Array.isArray(reports)) {
      reports.forEach(story => {
        if (story.lat && story.lon) {
          const marker = window.L.marker([story.lat, story.lon]).addTo(map);
          marker.bindPopup(`<b>${story.name}</b><br>${story.description}`);
        }
      });
    }
    this.#map = map;
  }

  showMapLoading() {
    document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }

  showLoading() {
    document.getElementById('reports-list-loading-container').innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideLoading() {
    document.getElementById('reports-list-loading-container').innerHTML = '';
  }
}
