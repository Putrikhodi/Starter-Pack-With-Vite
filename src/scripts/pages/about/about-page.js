export default class AboutPage {
  async render() {
    return `
      <section class="container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh;">
        <main id="main-content" tabindex="-1" style="width:100%; max-width:500px;">
          <article id="about-team" aria-label="About Team" style="margin-top:2rem; background:#fff; border-radius:16px; box-shadow:0 2px 12px rgba(0,0,0,0.07); padding:2rem; text-align:center;">
            <header>
              <h1 style="margin-bottom:0.5em; font-size:2rem;">About Page</h1>
              <h2 style="background:#87cefa; color:#222; padding:0.5em 0; border-radius:8px; margin-bottom:1.5em;">Tim Pengembang</h2>
            </header>
            <section>
              <figure style="margin-bottom:1em;">
                <img src="https://ui-avatars.com/api/?name=Dicoding+Team" alt="Foto Tim Dicoding" width="120" height="120" style="border-radius:50%; display:block; margin:0 auto 0.5em auto; box-shadow:0 1px 6px rgba(0,0,0,0.08);" />
                <figcaption style="margin-top:0.5em; font-weight:bold; color:#555;">Tim Dicoding Indonesia</figcaption>
              </figure>
              <ul style="list-style:none; padding:0; margin:0 0 1em 0; text-align:left; display:inline-block;">
                <li><b>Nama:</b> Dicoding Team</li>
                <li><b>Email:</b> info@dicoding.com</li>
                <li><b>Role:</b> Developer & Mentor</li>
              </ul>
            </section>
            <footer>
              <p style="margin-top:1em; color:#666; font-size:0.95em;">Website ini dibuat untuk memenuhi submission kelas Dicoding.</p>
            </footer>
          </article>
        </main>
      </section>
    `;
  }

  async afterRender() {
    // Skip to content (aksesibilitas)
    if (!document.getElementById('skip-to-content')) {
      const skip = document.createElement('a');
      skip.href = '#main-content';
      skip.id = 'skip-to-content';
      skip.textContent = 'Skip to main content';
      skip.style.position = 'absolute';
      skip.style.top = '0';
      skip.style.left = '0';
      skip.style.background = '#222';
      skip.style.color = '#fff';
      skip.style.padding = '8px';
      skip.style.zIndex = '1000';
      skip.style.transform = 'translateY(-120%)';
      skip.style.transition = 'transform 0.3s';
      skip.addEventListener('focus', () => {
        skip.style.transform = 'translateY(0)';
      });
      skip.addEventListener('blur', () => {
        skip.style.transform = 'translateY(-120%)';
      });
      document.body.prepend(skip);
    }
    // Contoh info tim/profil dengan elemen semantik
    const container = document.querySelector('.container');
    if (container && !document.getElementById('about-team')) {
      container.insertAdjacentHTML('beforeend', `
        <main id="main-content" tabindex="-1">
          <article id="about-team" aria-label="About Team" style="margin-top:2rem">
            <header>
              <h2>Tim Pengembang</h2>
            </header>
            <section>
              <figure>
                <img src="https://ui-avatars.com/api/?name=Dicoding+Team" alt="Foto Tim Dicoding" width="120" height="120" style="border-radius:50%;" />
                <figcaption>Tim Dicoding Indonesia</figcaption>
              </figure>
              <ul>
                <li><b>Nama:</b> Dicoding Team</li>
                <li><b>Email:</b> info@dicoding.com</li>
                <li><b>Role:</b> Developer & Mentor</li>
              </ul>
            </section>
            <footer>
              <p>Website ini dibuat untuk memenuhi submission kelas Dicoding.</p>
            </footer>
          </article>
        </main>
      `);
    }
  }
}
