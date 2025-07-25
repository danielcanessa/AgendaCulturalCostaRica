export function getUsuarioActual() {
  try {
    const datos = JSON.parse(localStorage.getItem('usuario'));
    if (!datos) return { tipoUsuario: 'visitante', nombre: '' };

    const { rol, nombre, correo } = datos;

    if (rol === 'admin') return { tipoUsuario: 'admin', nombre, correo };
    if (rol === 'usuario') return { tipoUsuario: 'usuario', nombre, correo};

    return { tipoUsuario: 'visitante', nombre: '' };
  } catch (e) {
    return { tipoUsuario: 'visitante', nombre: '' };
  }
}
