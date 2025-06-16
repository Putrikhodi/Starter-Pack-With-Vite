if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(reg => {
            console.log('Service Worker registered:', reg);

            // Optional: request notification permission langsung
            if (Notification.permission !== 'granted') {
                Notification.requestPermission().then(result => {
                    console.log('Notification permission:', result);
                });
            }
        })
        .catch(err => {
            console.error('SW registration failed:', err);
        });
}
