// Fungsi openCamera: Membuka kamera dan mengembalikan file gambar (Blob)
export async function openCamera() {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      input.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
          resolve(file);
        } else {
          reject(new Error('Tidak ada gambar yang dipilih'));
        }
      };
      input.click();
    });
  }