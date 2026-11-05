/* ============================================================
   API_URL
   ============================================================ */
export const API_URL = 'http://localhost:3000/usuarios';

console.log('🔌 API_URL =', API_URL);

/* ============================================================
   Wrapper fetch
   ============================================================ */
async function request(method, url, body) {
    // 🔥 1. Buscamos el token en el localStorage
    const token = localStorage.getItem('token');

    const opciones = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Accept':       'application/json'
        }
    };

    // 🔥 2. Si hay token, lo inyectamos en el Header
    if (token) {
        opciones.headers['Authorization'] = `Bearer ${token}`;
        console.log(`📡 Enviando petición ${method} a ${url} CON token`);
    } else {
        console.warn(`⚠️ Petición ${method} a ${url} SIN token (ruta pública)`);
    }

    if (body !== undefined) opciones.body = JSON.stringify(body);

    const res  = await fetch(url, opciones);
    
    // 🔥 3. Si el backend dice "no autorizado", cerramos sesión y volvemos al login
    if (res.status === 401 || res.status === 403) {
        console.warn(`🚨 Token inválido o vencido (Error ${res.status}). Redirigiendo...`);
        localStorage.removeItem('token');
        sessionStorage.removeItem('user');
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = './login.html';
        }
    }

    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
}

/* ============================================================
   Endpoints
   ============================================================ */
export const api = {
    login:      (email, pass) => request('POST',   `${API_URL}/login`, { email, pass }),
    listar:     ()            => request('GET',    `${API_URL}`),
    obtener:    (id)          => request('GET',    `${API_URL}/${id}`),
    crear:      (u)           => request('POST',   `${API_URL}`, u),
    actualizar: (id, datos)   => request('PUT',    `${API_URL}/${id}`, datos),
    eliminar:   (id)          => request('DELETE', `${API_URL}/${id}`)
};