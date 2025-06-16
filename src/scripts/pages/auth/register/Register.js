import RegisterPresenter from './RegisterPresenter';
import * as StoryAPI from '../../../data/api';

// const presenter = new RegisterPresenter();

export default class Register {
  #presenter = null;
  async render() {
    return `
      <div style="display:flex;justify-content:center;align-items:center;height:90vh;">
        <div style="border:2px solid #ccc;padding:2em 3em;border-radius:12px;min-width:350px;background:#fff;box-shadow:0 2px 8px #0001;">
          <h2 style="text-align:center;font-size:2.5rem;font-weight:bold;margin-bottom:1.5em;">Sign Up</h2>
          <form id="registerForm" autocomplete="off">
            <div style="margin-bottom:1em;">
              <label for="name" style="display:block;font-size:1.1em;margin-bottom:0.3em;">Nama</label>
              <input type="text" id="name" placeholder="Nama" required style="width:100%;padding:0.6em;border:1.5px solid #aaa;border-radius:6px;font-size:1.1em;" />
            </div>
            <div style="margin-bottom:1em;">
              <label for="email" style="display:block;font-size:1.1em;margin-bottom:0.3em;">Email</label>
              <input type="email" id="email" placeholder="Email" required style="width:100%;padding:0.6em;border:1.5px solid #aaa;border-radius:6px;font-size:1.1em;" />
            </div>
            <div style="margin-bottom:1.5em;">
              <label for="password" style="display:block;font-size:1.1em;margin-bottom:0.3em;">Password</label>
              <input type="password" id="password" placeholder="Password" required minlength="8" style="width:100%;padding:0.6em;border:1.5px solid #aaa;border-radius:6px;font-size:1.1em;" />
            </div>
            <div id="submit-button-container">
              <button type="submit" style="width:100%;padding:0.7em 0;font-size:1.2em;background:#0099ff;color:#fff;border:none;border-radius:8px;margin-bottom:1em;cursor:pointer;box-shadow:0 2px 4px #0001;">Sign Up</button>
            </div>
          </form>
          <div id="registerMsg" style="min-height:1.5em;text-align:center;color:#d00;margin-bottom:1em;"></div>
          <div style="text-align:center;font-size:1.1em;">
            Already have an account? <a href="#/login" style="color:#0099ff;text-decoration:none;font-weight:bold;">Log In</a>
          </div>
        </div>
      </div>
    `;
  }


  async afterRender() {
    this.#presenter = new RegisterPresenter({
      view: this,
      model: StoryAPI,
    });

    this.#setupForm();
  }

  #setupForm(){
    const form = document.getElementById('registerForm');
    // const msg = document.getElementById('registerMsg');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
      };
      await this.#presenter.getRegistered(data);
      // msg.textContent = '';
      // const name = document.getElementById('name').value;
      // const email = document.getElementById('email').value;
      // const password = document.getElementById('password').value;
      // try {
      //   await presenter.register({ name, email, password });
      //   msg.textContent = 'Registrasi sukses! Silakan login.';
      //   form.reset();
      // } catch (error) {
      //   msg.textContent = error.message || 'Registrasi gagal.';
      // }
    });
  }
  registeredSuccessfully(message) {
    console.log(message);

    // Redirect
    location.hash = '/login';
  }

  registeredFailed(message) {
    alert(message);
  }

  showSubmitLoadingButton() {
  document.getElementById('submit-button-container').innerHTML = `
    <button type="submit" disabled style="
      width: 100%;
      padding: 0.7em 0;
      font-size: 1.2em;
      background: #0099ff;
      color: #fff;
      border: none;
      border-radius: 8px;
      margin-bottom: 1em;
      cursor: not-allowed;
      box-shadow: 0 2px 4px #0001;
    ">
      <i class="fas fa-spinner fa-spin" style="margin-right: 8px;"></i> Signing Up...
    </button>
  `;
}

hideSubmitLoadingButton() {
  document.getElementById('submit-button-container').innerHTML = `
    <button type="submit" style="
      width: 100%;
      padding: 0.7em 0;
      font-size: 1.2em;
      background: #0099ff;
      color: #fff;
      border: none;
      border-radius: 8px;
      margin-bottom: 1em;
      cursor: pointer;
      box-shadow: 0 2px 4px #0001;
    ">Sign Up</button>
  `;
}

};

