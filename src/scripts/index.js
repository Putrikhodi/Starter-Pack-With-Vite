// CSS imports
import '../styles/styles.css';
import '../styles/responsives.css';
import '../styles/leaflet.css';

import App from './pages/app';

console.log('Script loaded');
document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOMFullyLoaded');
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    drawerNavigation: document.querySelector('#drawer-navigation'),
  });
  await app.renderPage();

  // Skip-to-content link functionality
  const skipLink = document.querySelector('.skip-link'); // Assuming '.skip-link' based on reviewer suggestion
  const mainContentElement = document.querySelector('#main-content');

  if (skipLink && mainContentElement) {
    skipLink.addEventListener('click', function (event) {
      event.preventDefault(); // Prevent page refresh and hash change
      skipLink.blur(); // Remove focus from the skip link

      // Ensure mainContent is focusable, then focus and scroll
      if (!mainContentElement.hasAttribute('tabindex')) {
        mainContentElement.setAttribute('tabindex', '-1'); // Make it focusable
      }
      mainContentElement.focus(); // Set focus to the main content
      mainContentElement.scrollIntoView({ behavior: 'smooth' }); // Scroll to main content
    });
  }

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });
});
