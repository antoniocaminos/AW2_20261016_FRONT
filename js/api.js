/* ============================================================
   API_URL
   ------------------------------------------------------------
   En MULTI REPO el front vive en otro puerto distinto al backend.
   El front NO puede usar rutas relativas como '/usuarios' porque
   esas rutas se resolverian contra el puerto del front, no del back.
   Por eso apuntamos con URL ABSOLUTA al backend.
   ============================================================ */
export const API_URL = 'http://localhost:3000/usuarios';

console.log('🔌 API_URL =', API_URL);

/* ============================================================
   Wrapper fetch
   ------------------------------------------------------------
   Centralizamos todas las peticiones aca.
   Ventaja: si mañana cambia la URL del backend (deploy, dominio,
   puerto), se cambia en UN SOLO LUGAR.
   ============================================================ */
async function request(method, url, body) {
    const opciones = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Accept':       'application/json'
        }
    };
    if (body !== undefined) opciones.body = JSON.stringify(body);

    const res  = await fetch(url, opciones);
    const data = await res.json().catch(() => ({}));  ///// si no es JSON valido, devolvemos {}
    return { ok: res.ok, status: res.status, data };
}

/* ============================================================
   Endpoints
   ------------------------------------------------------------
   Cada metodo del front se mapea 1 a 1 con una ruta del backend.
   ============================================================ */
export const api = {
    login:      (email, pass) => request('POST',   `${API_URL}/login`, { email, pass }),
    listar:     ()            => request('GET',    `${API_URL}`),
    obtener:    (id)          => request('GET',    `${API_URL}/${id}`),
    crear:      (u)           => request('POST',   `${API_URL}`, u),
    actualizar: (id, datos)   => request('PUT',    `${API_URL}/${id}`, datos),
    eliminar:   (id)          => request('DELETE', `${API_URL}/${id}`)
};