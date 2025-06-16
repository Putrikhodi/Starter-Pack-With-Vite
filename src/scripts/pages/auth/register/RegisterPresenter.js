// class RegisterPresenter {
//     constructor({ apiUrl } = {}) {
//       this.apiUrl = apiUrl || 'https://story-api.dicoding.dev/v1/register';
//     }
  
//     async register({ name, email, password }) {
//       if (!name || !email || !password) throw new Error('Nama, email, dan password wajib diisi');
//       if (password.length < 8) throw new Error('Password minimal 8 karakter');
//       const response = await fetch(this.apiUrl, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ name, email, password }),
//       });
//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.message || 'Registrasi gagal');
//       }
//       return data;
//     }
//   }
  
//   export default RegisterPresenter;

export default class RegisterPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async getRegistered({ name, email, password }) {
    this.#view.showSubmitLoadingButton();
    try {
      // const response = await this.#model.getRegistered({ name, email, password });
      const response = await this.#model.Register({name, email, password});

      if (!response.ok) {
        console.error('getRegistered: response:', response);
        this.#view.registeredFailed(response.message);
        return;
      }

      this.#view.registeredSuccessfully(response.message, response.data);
    } catch (error) {
      console.error('getRegistered: error:', error);
      this.#view.registeredFailed(error.message);
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}
