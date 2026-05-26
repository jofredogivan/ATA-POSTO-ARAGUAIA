const cacheName = 'ata-pwa-v2.0.2'; // Mude a versão aqui para forçar uma atualização
const filesToCache = [
    '/',
    'index.html',
    'style.css',
    'manifest.json',
    'imagem_57099f.png',
    'assets/logo_nova.png',
    'assets/image_a77742.png',
    'assets/image_987e83.png',
    'icon.png',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&family=Roboto:wght@400;500&display=swap'
];

self.addEventListener('install', (event) => {
    console.log('[Service Worker] Instalando...');
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('[Service Worker] Cacheando todos os arquivos');
            return cache.addAll(filesToCache).catch(err => {
                console.error('Falha ao cachear arquivos:', err);
            });
        }).then(() => {
            self.skipWaiting();
        })
    );
});

self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Ativando...');
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== cacheName) {
                    console.log('[Service Worker] Removendo cache antigo:', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                return response;
            }
            
            return fetch(event.request).then((networkResponse) => {
                return caches.open(cacheName).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            }).catch(() => {
                // Aqui você pode retornar uma página offline, se houver
                // return caches.match('offline.html');
            });
        })
    );
});
