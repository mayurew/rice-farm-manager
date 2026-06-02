const CACHE_NAME =
    "rice-farm-v1";

const urlsToCache = [
    "./",
    "./index.html",
    "./field.html",
    "./field-summary.html",
    "./asset.html",
    "./dashboard.html",
    "./settings.html",

    "./style.css",

    "./script.js",

    "./js/setting.js",
    "./js/pwa.js",

    "./manifest.json",

    "./icon-192.png",
    "./icon-512.png"
];

self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches.open(CACHE_NAME)
                .then(cache => {

                    return cache.addAll(
                        urlsToCache
                    );

                })

        );

    }
);

self.addEventListener(
    "fetch",
    event => {

        event.respondWith(

            caches.match(event.request)
                .then(response => {

                    return response ||
                        fetch(event.request);

                })

        );

    }
);