//Guadar elementos en el cache dinámico

function actualizaCacheDinamico(dynamicCache, req, res) {

    if (res.ok) { //La resepuesta tiene datos

        //Abro la cache que se pasa como parámetro, que es una promesa
        return caches.open(dynamicCache).then(cache => {
            cache.put(req, res.clone()); //pongo la resquest y la respuesta en al cache, tengo que clonarla
            return res.clone(); //devuelvo la respuesta (no debe responde undefine)
        });

    } else { //En caso de que no haya datos, no se puede hacer mucho, sera un 404, o similar
        return res;
    };

}