import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Register.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import bannerImg from '../../assets/banner.jpg';

const API_REGISTER = "http://localhost:8000/api/register/";
const API_ROLES = "http://localhost:8000/api/userroles/";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    bio: "",
    phone: "",
    email: "",
    password: "",
    password2: "",
    acceptPrivacy: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [roleId, setRoleId] = useState(null);
  const [rolesLoading, setRolesLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    setRolesLoading(true);
    fetch(API_ROLES)
      .then(r => r.json())
      .then(roles => {
        const visitante = roles.find(r => r.name.toLowerCase() === "visitante");
        if (visitante) setRoleId(visitante.id);
      })
      .catch(() => setRoleId(null))
      .finally(() => setRolesLoading(false));
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "El nombre es requerido";
    if (!form.lastName.trim()) newErrors.lastName = "El apellido es requerido";
    if (!/^\d{4}-\d{4}$/.test(form.phone)) newErrors.phone = "Teléfono debe tener el formato 8888-0000";
    if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Correo inválido";
    if (form.password.length < 8) newErrors.password = "Contraseña mínima de 8 caracteres";
    if (form.password !== form.password2) newErrors.password2 = "Las contraseñas no coinciden";
    if (!form.acceptPrivacy) newErrors.acceptPrivacy = "Debe aceptar la política de privacidad";
    return newErrors;
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSuccess('');
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    if (!roleId) {
      setErrors({ api: "No se puede procesar el registro en este momento. Intente más tarde." });
      return;
    }

    setLoading(true);

    const payload = {
      name: form.name.trim(),
      last_name: form.lastName.trim(),
      bio: form.bio.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      password: form.password,
      role_id: roleId
    };

    try {
      const res = await fetch(API_REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        setErrors({ api: data.detail || "Error al registrar usuario" });
        setLoading(false);
        return;
      }

      setSuccess("Registro exitoso. Redirigiendo a inicio de sesión...");
      setForm({
        name: "",
        lastName: "",
        bio: "",
        phone: "",
        email: "",
        password: "",
        password2: "",
        acceptPrivacy: false
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setErrors({ api: "Ocurrió un error inesperado. Intente más tarde." });
    } finally {
      setLoading(false);
    }
  };

  if (rolesLoading) {
    return (
      <>
        <Header />
        <main className="register-page">
          <div className="register-container">
            <div style={{ margin: "auto", width: "100%", textAlign: "center", padding: 30 }}>
              Cargando...
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Resumen de errores para accesibilidad
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <>
      <Header />
      <main className="register-page">
        <div className="register-container">
          <form className="register-form" onSubmit={handleSubmit} autoComplete="off" noValidate>
            {hasErrors && (
              <div className="error-summary" role="alert" aria-live="assertive" tabIndex={-1}>
                Por favor, corregí los errores marcados en el formulario.
              </div>
            )}

            <label htmlFor="name">Nombre:</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Nombre"
              value={form.name}
              onChange={handleChange}
              autoComplete="off"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "error-name" : undefined}
            />
            {errors.name && (
              <div id="error-name" className="error" role="alert">
                {errors.name}
              </div>
            )}

            <label htmlFor="lastName">Apellidos:</label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              placeholder="Apellidos"
              value={form.lastName}
              onChange={handleChange}
              autoComplete="off"
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? "error-lastName" : undefined}
            />
            {errors.lastName && (
              <div id="error-lastName" className="error" role="alert">
                {errors.lastName}
              </div>
            )}

            <label htmlFor="bio">Biografía:</label>
            <textarea
              id="bio"
              name="bio"
              placeholder="Contanos un poco sobre vos"
              rows={3}
              value={form.bio}
              onChange={handleChange}
              maxLength={300}
              aria-describedby="bio-counter"
            />
            <div id="bio-counter" className="bio-counter">
              {form.bio.length}/300
            </div>

            <label htmlFor="phone">Teléfono:</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              placeholder="8888-0000"
              pattern="[0-9]{4}-[0-9]{4}"
              maxLength={9}
              title="El teléfono debe tener el formato 8888-0000"
              value={form.phone}
              onChange={handleChange}
              autoComplete="off"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "error-phone" : undefined}
            />
            {errors.phone && (
              <div id="error-phone" className="error" role="alert">
                {errors.phone}
              </div>
            )}

            <label htmlFor="email">Correo electrónico:</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="correo@correo.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="off"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "error-email" : undefined}
            />
            {errors.email && (
              <div id="error-email" className="error" role="alert">
                {errors.email}
              </div>
            )}

            <label htmlFor="password">Contraseña:</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="**********"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "error-password" : undefined}
            />
            {errors.password && (
              <div id="error-password" className="error" role="alert">
                {errors.password}
              </div>
            )}

            <label htmlFor="password2">Confirmar contraseña:</label>
            <input
              id="password2"
              type="password"
              name="password2"
              placeholder="**********"
              value={form.password2}
              onChange={handleChange}
              autoComplete="new-password"
              aria-invalid={!!errors.password2}
              aria-describedby={errors.password2 ? "error-password2" : undefined}
            />
            {errors.password2 && (
              <div id="error-password2" className="error" role="alert">
                {errors.password2}
              </div>
            )}

            <div className="checkbox">
              <input
                className="checkbtn"
                type="checkbox"
                id="privacidad"
                name="acceptPrivacy"
                checked={form.acceptPrivacy}
                onChange={handleChange}
                aria-invalid={!!errors.acceptPrivacy}
                aria-describedby={errors.acceptPrivacy ? "error-acceptPrivacy" : undefined}
              />
              <label htmlFor="privacidad">Acepto política de privacidad</label>
            </div>
            {errors.acceptPrivacy && (
              <div id="error-acceptPrivacy" className="error" role="alert">
                {errors.acceptPrivacy}
              </div>
            )}

            <a
              href="/politica"
              className="link-politica"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver política de privacidad
            </a>

            {errors.api && (
              <div className="error" role="alert">
                {errors.api}
              </div>
            )}
            {success && (
              <div style={{ color: "green", marginTop: 8 }} role="status" aria-live="polite">
                {success}
              </div>
            )}

            <div className="button-section">
              <input
                className="button"
                type="submit"
                value={loading ? "Registrando..." : "Registrarse"}
                disabled={loading || !roleId}
              />
            </div>
          </form>

          <div className="register-image">
            <img src={bannerImg} alt="Registro" />
            <div className="text-overlay">
              <h2>Registro de Cuenta</h2>
              <p>La cultura vive donde estés.</p>
            </div>
          </div>
        </div>
      </main>
      <br />
      <br />
      <Footer />
    </>
  );
}