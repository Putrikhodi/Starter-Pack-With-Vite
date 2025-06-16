import { StoryDB } from '../data/indexeddb';

const OfflineStoriesPage = {
  async render() {
    return `
      <div class="content">
        <h2>Offline Stories</h2>
        <div id="offline-stories" class="story-list"></div>
      </div>
    `;
  },

  async afterRender() {
    const container = document.getElementById('offline-stories');
    const stories = await StoryDB.getAllStories();

    if (stories.length === 0) {
      container.innerHTML = '<p>Belum ada cerita offline tersimpan.</p>';
      return;
    }

    container.innerHTML = stories.map(story => `
      <div class="story-card">
        <h3>${story.name}</h3>
        <p>${story.description}</p>
        <button class="delete-btn" data-id="${story.id}">Hapus</button>
      </div>
    `).join('');

    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', async () => {
        await StoryDB.deleteStory(button.dataset.id);
        this.afterRender(); // refresh tampilan
      });
    });
  }
};

export default OfflineStoriesPage;
