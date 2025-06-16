import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import { 
  initPushNotification, 
  subscribeToPushNotification, 
  unsubscribePushNotification 
} from '../../main';
import {
  generateAuthenticatedNavigationListTemplate,
  generateUnauthenticatedNavigationListTemplate,
  generateMainNavigationListTemplate,
  generateSubscribeButtonTemplate,
  generateUnsubscribeButtonTemplate
} from '../templates';
import { setupSkipToContent, transitionHelper } from '../utils';
import { getAccessToken, getLogout } from '../utils/auth';
class App {
  #content = null;
  #drawerButton = null;
  #drawerNavigation;
  #skipLinkButton;

  constructor({ drawerNavigation, drawerButton, content, skipLinkButton }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#drawerNavigation = drawerNavigation;
    this._initialUI(); // <-- Panggil metode ini di constructor
  }

  _initialUI() {
    // --- KODE UNTUK MENGISI NAVIGASI UTAMA ---
    const navlist = document.getElementById('navlist');
    if (navlist) {
      navlist.innerHTML = generateMainNavigationListTemplate();
      console.log('[App] Navigasi utama (#navlist) diisi.');
    } else {
      console.warn('[App] Elemen #navlist tidak ditemukan di DOM.');
    }

    // --- KODE UNTUK MENGISI NAVIGASI OTENTIKASI (JIKA ADA) ---
    const navlistAuth = document.getElementById('navlist');
    const isLoggedIn = localStorage.getItem('accessToken') ? true : false; // Sesuaikan logika pengecekan login Anda

    if (navlistAuth) {
      if (isLoggedIn) {
        navlistAuth.innerHTML = generateAuthenticatedNavigationListTemplate(); // Ganti dengan = jika Anda tidak ingin menumpuk
        console.log('[App] Navigasi autentikasi (#navlist) diisi (Authenticated).');
      } else {
        navlistAuth.innerHTML = generateUnauthenticatedNavigationListTemplate(); // Ganti dengan = jika Anda tidak ingin menumpuk
        console.log('[App] Navigasi autentikasi (#navlist) diisi (Unauthenticated).');
      }
    } else {
      console.warn('[App] Elemen #navlist tidak ditemukan di DOM.');
    }

    this.#skipLinkButton = skipLinkButton;

    this.#init();
  }

  #init() {
    setupSkipToContent(this.#skipLinkButton, this.#content);
    this.#setupDrawer();
    
    // Setup navigation list first
    this.#setupNavigationList();
    
    // Setup push notifications after navigation is rendered
    this.#setupPushNotifications();
  }

  // Setup push notifications
  async #setupPushNotifications() {
    // Hanya untuk user yang sudah login
    if (!getAccessToken()) return;
    
    // Pastikan browser mendukung
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return;
    }
    
    try {
      // Daftarkan service worker
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        //type: 'classic',
        updateViaCache: 'none'
      });
      
      // Tunggu service worker aktif
      if (!registration.active) {
        await navigator.serviceWorker.ready;
      }
      
      // Cek status subscription
      let subscription = await registration.pushManager.getSubscription();
      
      // Jika belum subscribe, minta izin
      if (!subscription) {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;
        subscription = await registration.pushManager.getSubscription();
      }
      
      // Update tombol
      this.#updatePushButton(!!subscription);
      
    } catch (error) {
      console.error('Push notification error:', error);
    }
  }

  // Update tampilan tombol push notification
  #updatePushButton(isSubscribed) {
    // Pastikan container ada
    let container = document.getElementById('push-notification-tools');
    
    // Jika container tidak ditemukan, coba buat
    if (!container) {
      const navlist = document.querySelector('#navlist');
      if (!navlist) return;
      
      container = document.createElement('li');
      container.id = 'push-notification-tools';
      navlist.prepend(container);
    }
    
    // Update tombol
    container.innerHTML = isSubscribed 
      ? generateUnsubscribeButtonTemplate() 
      : generateSubscribeButtonTemplate();
    
    // Setup event listener
    const button = isSubscribed 
      ? document.getElementById('unsubscribe-button')
      : document.getElementById('subscribe-button');
    
    if (button) {
      button.onclick = isSubscribed 
        ? this.#handleUnsubscribe.bind(this)
        : this.#handleSubscribe.bind(this);
    }
  }

  // Handle subscribe
  async #handleSubscribe() {
    console.log('[DEBUG] Subscribe button clicked');
    const button = document.getElementById('subscribe-button');
    if (button) button.disabled = true;
    
    try {
      const subscription = await initPushNotification();
      if (!subscription) {
        console.log('[DEBUG] Subscription cancelled or failed');
        return;
      }

      console.log('[DEBUG] Sending subscription to server...');
      const result = await subscribeToPushNotification(subscription);
      if (result) {
        console.log('[DEBUG] Subscription successful');
        this.#updatePushButton(true);
      } else {
        console.error('[ERROR] Failed to save subscription');
        alert('Gagal menyimpan preferensi notifikasi. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Gagal subscribe:', error);
      alert('Gagal mengaktifkan notifikasi. Silakan coba lagi.');
    } finally {
      if (button) button.disabled = false;
    }
  }

  // Handle unsubscribe
  async #handleUnsubscribe() {
    console.log('[DEBUG] Unsubscribe button clicked');
    const button = document.getElementById('unsubscribe-button');
    if (button) button.disabled = true;
    
    try {
      console.log('[DEBUG] Unsubscribing...');
      const result = await unsubscribePushNotification();
      if (result) {
        console.log('[DEBUG] Unsubscription successful');
        this.#updatePushButton(false);
      } else {
        console.error('[ERROR] Failed to remove subscription');
        alert('Gagal menonaktifkan notifikasi. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Gagal unsubscribe:', error);
      alert('Gagal menonaktifkan notifikasi. Silakan coba lagi.');
    } finally {
      if (button) button.disabled = false;
    }
  }

  #setupNavigationList() {
    // Pastikan drawerNavigation ada
    if (!this.#drawerNavigation) return;

    const navlist = this.#drawerNavigation.querySelector('#navlist');
    const navlistMain = this.#drawerNavigation.querySelector('#navlist-main');
    if (!navlist || !navlistMain) return;
    
    const isLogin = !!getAccessToken();
    
    // Kosongkan semua elemen navigasi yang ada
    navlistMain.innerHTML = '';
    
    // Hapus semua elemen navigasi kecuali push-notification-tools
    const itemsToKeep = [];
    Array.from(navlist.children).forEach(child => {
      if (child.id === 'push-notification-tools') {
        itemsToKeep.push(child);
      }
    });
    
    // Kosongkan navlist dan tambahkan kembali yang perlu dipertahankan
    navlist.innerHTML = '';
    itemsToKeep.forEach(item => navlist.appendChild(item));
    
    // Render ulang navigasi utama
    navlistMain.innerHTML = generateMainNavigationListTemplate();
    
    // Pastikan container push notification ada
    if (!document.getElementById('push-notification-tools')) {
      const pushContainer = document.createElement('li');
      pushContainer.id = 'push-notification-tools';
      navlist.prepend(pushContainer);
    }
    
    // Render menu berdasarkan status login
    const navItems = isLogin 
      ? generateAuthenticatedNavigationListTemplate() 
      : generateUnauthenticatedNavigationListTemplate();
    
    // Parse HTML string ke DOM
    const temp = document.createElement('div');
    temp.innerHTML = navItems;
    
    // Tambahkan item navigasi yang belum ada
    Array.from(temp.children).forEach(item => {
      // Hapus dulu jika sudah ada
      const existingItem = document.getElementById(item.id);
      if (existingItem) {
        existingItem.remove();
      }
      // Tambahkan yang baru
      navlist.appendChild(item);
    });
    
    // Setup event listener untuk logout
    const logoutBtn = document.getElementById('logout-button');
    if (logoutBtn) {
      // Hapus event listener lama
      const newLogoutBtn = logoutBtn.cloneNode(true);
      logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);
      
      // Tambahkan event listener baru
      newLogoutBtn.onclick = (e) => {
        e.preventDefault();
        if (confirm('Apakah Anda yakin ingin keluar?')) {
          getLogout();
          window.location.hash = '/login';
        }
      };
    }
  }

  #setupDrawer() {
    // Pastikan drawerNavigation ada
    if (!this.#drawerNavigation) {
      console.error('Navigation drawer element not found');
      return;
    }

    this.#drawerButton.addEventListener('click', () => {
      this.#drawerNavigation.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      const isTargetInsideDrawer = this.#drawerNavigation?.contains(event.target);
      const isTargetInsideButton = this.#drawerButton?.contains(event.target);

      if (!(isTargetInsideDrawer || isTargetInsideButton)) {
        this.#drawerNavigation?.classList.remove('open');
      }

      this.#drawerNavigation.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#drawerNavigation.classList.remove('open');
        }
      });
    });
  }

  // Method #setupPushNotification dihapus karena sudah digantikan oleh #setupPushNotifications

  async renderPage() {
    const url = getActiveRoute();
    const route = routes[url];

    // Get page instance
    const page = route();
    console.log('Rendering page for route:', url);

    // Handle protected routes
    const protectedRoutes = ['/add-story', '/bookmark'];
    const token = getAccessToken();
    
    if (protectedRoutes.includes(url) && !token) {
      window.location.hash = '/login';
      return;
    }

    const transition = transitionHelper({
      updateDOM: async () => {
        try {
          // Clear content before rendering new page
          this.#content.innerHTML = '';
          
          // Render konten halaman
          const content = await page.render();
          if (content) {
            if (content.nodeType) {
              // Jika content adalah Node
              this.#content.appendChild(content);
            } else if (typeof content === 'string') {
              // Jika content adalah string HTML
              this.#content.innerHTML = content;
            }
          }
          
          // Call afterRender if it exists
          if (typeof page.afterRender === 'function') {
            await page.afterRender();
          }
          
          // Update navigation after page render
          this.#setupNavigationList();
        } catch (error) {
          console.error('Error rendering page:', error);
          this.#content.innerHTML = '<p>Terjadi kesalahan saat memuat halaman</p>';
        }
      },
    });

    transition.ready.catch(console.error);
    transition.updateCallbackDone.then(() => {
      scrollTo({ top: 0, behavior: 'instant' });
      // Setup push notifications after navigation is done
      this.#setupPushNotifications();
    });
  }
}

export default App;