import './UpdatePerfil.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { getUsuarioActual } from '../../utils/getUsuarioActual';
import { useEffect, useState } from 'react';

const API_ME = "http://localhost:8000/api/me/";
const API_USERS = "http://localhost:8000/api/users/"; // NUEVO: endpoint correcto para PATCH
const API_ORGS = "http://localhost:8000/api/organizations/";
const API_UPDATE_PASS = "http://localhost:8000/api/password-change/";

export default function UpdatePerfil() {
  const usuarioActual = getUsuarioActual();
  const token = localStorage.getItem('token');
  const [formulario, setFormulario] = useState({
    name: '',
    last_name: '',
    phone: '',
    bio: '',
    organization: '',
  });
  const [userId, setUserId] = useState(''); // NUEVO: guardar id de usuario
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passFields, setPassFields] = useState({
    old_password: '',
    new_password: '',
    confirm_new_password: ''
  });
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [savingPass, setSavingPass] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(API_ME, { headers: { Authorization: `Bearer ${token}` }}).then(r => r.json()),
      fetch(API_ORGS, { headers: { Authorization: `Bearer ${token}` }}).then(r => r.json())
    ])
    .then(([user, orgList]) => {
      setFormulario({
        name: user.name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        bio: user.bio || '',
        organization: user.organization?.id || '',
      });
      setUserId(user.id); // NUEVO: guardar id de usuario
      setOrgs(Array.isArray(orgList) ? orgList : []);
      setLoading(false);
    })
    .catch(() => {
      setError('No se pudo cargar tu información.');
      setLoading(false);
    });
  }, [token]);

  const handleChange = e => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const validar = () => {
    if (!formulario.name.trim()) return "El nombre es obligatorio";
    if (!formulario.last_name.trim()) return "Los apellidos son obligatorios";
    if (!/^(\d{4}-?\d{4})?$/.test(formulario.phone)) return "Teléfono inválido";
    if (formulario.bio.length > 500) return "La biografía es muy larga";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const errorMsg = validar();
    if (errorMsg) { setError(errorMsg); return; }
    setSaving(true);
    const payload = {
      name: formulario.name.trim(),
      last_name: formulario.last_name.trim(),
      phone: formulario.phone.trim(),
      bio: formulario.bio.trim(),
      organization: formulario.organization || null,
    };
    try {
      const res = await fetch(`${API_USERS}${userId}/`, { // PATCH AL USUARIO CORRECTO
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Error al actualizar el perfil');
      setSuccess('Perfil actualizado correctamente');
    } catch {
      setError('No se pudo actualizar el perfil.');
    }
    setSaving(false);
  };

  const validarPass = () => {
    if (!passFields.old_password || !passFields.new_password || !passFields.confirm_new_password)
      return "Todos los campos son obligatorios";
    if (passFields.new_password.length < 8)
      return "La nueva contraseña debe tener al menos 8 caracteres";
    if (passFields.new_password !== passFields.confirm_new_password)
      return "Las contraseñas no coinciden";
    return "";
  };

  const handleChangePass = e => {
    setPassFields({ ...passFields, [e.target.name]: e.target.value });
  };

  const handleSubmitPass = async (e) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');
    const err = validarPass();
    if (err) { setPassError(err); return; }
    setSavingPass(true);
    try {
      const res = await fetch(API_UPDATE_PASS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          old_password: passFields.old_password,
          new_password: passFields.new_password,
        })
      });
      if (!res.ok) {
        const errorData = await res.json();
        setPassError(errorData.detail || "Error al cambiar la contraseña");
      } else {
        setPassSuccess('Contraseña actualizada correctamente');
        setPassFields({ old_password: '', new_password: '', confirm_new_password: '' });
      }
    } catch {
      setPassError("No se pudo cambiar la contraseña.");
    }
    setSavingPass(false);
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="update-perfil-page"><div className="update-container">Cargando...</div></main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header tipoUsuario={usuarioActual.tipoUsuario} nombre={usuarioActual.nombre} />
      <main className="update-perfil-page">
        <div className="update-container">
          <div className="update-card">
            <h2>Editar mi perfil</h2>
            <form className="update-form" onSubmit={handleSubmit} autoComplete="off">
              {error && <div className="form-error" role="alert">{error}</div>}
              {success && <div className="form-success">{success}</div>}

              <label>Nombre:</label>
              <input type="text" name="name" value={formulario.name} onChange={handleChange} required maxLength={50} />

              <label>Apellidos:</label>
              <input type="text" name="last_name" value={formulario.last_name} onChange={handleChange} required maxLength={60} />

              <label>Teléfono:</label>
              <input type="text" name="phone" value={formulario.phone} onChange={handleChange} maxLength={20} placeholder="Ej: 2222-3333" />

              <label>Biografía:</label>
              <textarea name="bio" value={formulario.bio} onChange={handleChange} maxLength={500} />

              <label>Organización:</label>
              <select name="organization" value={formulario.organization || ''} onChange={handleChange}>
                <option value="">Sin organización</option>
                {orgs.map(org => (
                  <option key={org.id} value={org.id}>{org.name}</option>
                ))}
              </select>

              <button className="btn-actualizar" type="submit" disabled={saving || !userId}>
                {saving ? 'Guardando...' : 'Actualizar perfil'}
              </button>
            </form>
          </div>
          <div className="update-card">
            <h2>Cambiar contraseña</h2>
            <form className="update-form" onSubmit={handleSubmitPass}>
              {passError && <div className="form-error" role="alert">{passError}</div>}
              {passSuccess && <div className="form-success">{passSuccess}</div>}

              <label>Contraseña actual:</label>
              <input type="password" name="old_password" value={passFields.old_password} onChange={handleChangePass} autoComplete="current-password" />

              <label>Nueva contraseña:</label>
              <input type="password" name="new_password" value={passFields.new_password} onChange={handleChangePass} autoComplete="new-password" />

              <label>Confirmar nueva contraseña:</label>
              <input type="password" name="confirm_new_password" value={passFields.confirm_new_password} onChange={handleChangePass} autoComplete="new-password" />

              <button className="btn-actualizar" type="submit" disabled={savingPass}>{savingPass ? 'Guardando...' : 'Actualizar contraseña'}</button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}