// Fungsi untuk mendapatkan lokasi user (latitude & longitude)
export function getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation tidak didukung browser'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          });
        },
        (err) => {
          reject(new Error('Gagal mendapatkan lokasi: ' + err.message));
        }
      );
    });
  }