//Imports
importScripts('js/sw-utils.js');



//definimos la variables de los 3 tipos de caché
const STATIC_CACHE = "static-v2";
const DYNAMIC_CACHE = "dynamic-v1";
const INMUTABLE_CACHE = "inmutable-v1";


//Creamos el APP_SHELL con todo lo necesarios para que la PWA funcione

const APP_SHELL = [
    // '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js'
];


//Creamos la cache inmutable con las libreria y recursos de terceros
const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

//Realizamos la instalacción de sw
self.addEventListener('install', e => {

    console.log('Comienza la instalación');
    // Cargamos las caches
    const cacheStatic = caches.open(STATIC_CACHE).then(cache =>
        cache.addAll(APP_SHELL));

    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache =>
        cache.addAll(APP_SHELL_INMUTABLE));


    //Esperamos a que acaban todas las cargas de la caché
    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
    console.log('Cache cargada');
});

self.addEventListener('activate', e => {

    //Limpiar la cache estática cada vez que cambio el service worker
    const repuesta = caches.keys().then(keys => {
        keys.forEach(key => {
            if (key !== STATIC_CACHE && key.includes('static')) {
                log.console('cache, borrando: ' , key);
                return caches.delete(key);
            }
        });
    });

});



 //Estrategia del cache: cache network con callback
self.addEventListener('fetch', e => {
    //console.log('fetching ->', e.request);
    //Cache only
    const respuesta = caches.match(e.request).then(res => {
        if (res) { //La respuesta esta en la cache, todo ok
            return res;
        } else { //La respuesta no esta en la cache

            //Esto puede suceder con la fuentes de google, "https://fonts.googleapis.com/css?family=Quicksand:300,400"
            //realmente no es un fichero de fuentes, es un CSS, que contiene una llamada al recurso reak,
            //que es realmente lo que necesitamos, el fichero de fuentes

            //Ejectamos el fetch para obtener el fichero y meterlo en la cache dinámica
            return fetch(e.request).then(newRes => {

                return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes);
            });

        }
    });

    e.respondWith(respuesta);

});
