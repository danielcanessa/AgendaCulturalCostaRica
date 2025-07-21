export function getUsuarioActual() {
  try {
    const datos = JSON.parse(localStorage.getItem('usuario'));
    if (!datos) return { tipoUsuario: 'visitante', nombre: '' };

    const { rol, nombre } = datos;

    if (rol === 'admin') return { tipoUsuario: 'admin', nombre };
    if (rol === 'usuario') return { tipoUsuario: 'usuario', nombre };

    return { tipoUsuario: 'visitante', nombre: '' };
  } catch (e) {
    return { tipoUsuario: 'visitante', nombre: '' };
  }
}
