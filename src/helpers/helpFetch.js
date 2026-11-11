// helpFetch: helper (función auxiliar) reutilizable para hacer peticiones HTTP con fetch.
// Encapsula lo que se repite en todas las peticiones: encabezados, conversión a JSON,
// manejo de errores y cancelación si la petición tarda demasiado.
//
// Uso:
//   const api = helpFetch();
//   api.get('/api/productos')
//   api.post('/api/productos', { body: { nombre: 'Cera', precio: 30000 } })
//   api.put('/api/productos/1', { body: {...} })
//   api.del('/api/productos/1')
// Cada método devuelve una promesa con los datos, o con { err: true, status, statusText } si falla.
export const helpFetch = () => {
  const TIEMPO_MAXIMO = 8000; // milisegundos

  const peticion = (url, opciones = {}) => {
    const controller = new AbortController();
    const temporizador = setTimeout(() => controller.abort(), TIEMPO_MAXIMO);

    const config = {
      method: opciones.method || 'GET',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...opciones.headers },
      signal: controller.signal,
    };
    if (opciones.body) config.body = JSON.stringify(opciones.body);

    return fetch(url, config)
      .then((res) =>
        res.ok
          ? res.json()
          : Promise.reject({ err: true, status: res.status, statusText: res.statusText || 'Ocurrió un error' })
      )
      .catch((error) =>
        error.err
          ? error
          : { err: true, status: 0, statusText: error.name === 'AbortError' ? 'La API no respondió a tiempo' : 'No se pudo conectar con la API. ¿Está corriendo json-server?' }
      )
      .finally(() => clearTimeout(temporizador));
  };

  const get = (url, opciones) => peticion(url, { ...opciones, method: 'GET' });
  const post = (url, opciones) => peticion(url, { ...opciones, method: 'POST' });
  const put = (url, opciones) => peticion(url, { ...opciones, method: 'PUT' });
  const del = (url, opciones) => peticion(url, { ...opciones, method: 'DELETE' });

  return { get, post, put, del };
};
