export function getUsuarioActual() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  let tipoUsuario = "visitante";
  let nombre = "Visitante";
  let correo = "";
  let id = null;

  if (usuario) {
    id = usuario.id || null;
    nombre = usuario.name || "Usuario";
    correo = usuario.email || "";

    if (usuario.role?.name === "Administrador") {
      tipoUsuario = "admin";
    } else if (usuario.role?.name === "Visitante") {
      tipoUsuario = "usuario";
    }
  }

  return { id, tipoUsuario, nombre, correo };
}
