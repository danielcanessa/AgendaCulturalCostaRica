import './Login.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import bannerImg from '../../assets/banner.jpg';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_LOGIN = "http://localhost:8000/api/login/";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Valida campos requeridos y formato antes de hacer la petición
  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "El correo es requerido";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Correo inválido";
    if (!password) newErrors.password = "La contraseña es requerida";
    return newErrors;
  };

  // Maneja el proceso de login y almacenamiento de tokens
  const manejarLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);

    try {
      const res = await fetch(API_LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        let data;
        try { data = await res.json(); } catch { data = {}; }
        setErrors({ api: data.detail || "Correo o contraseña incorrectos" });
        setLoading(false);
        return;
      }

      const data = await res.json();
      // Guarda los tokens de sesión en localStorage
      localStorage.setItem('token', data.access);
      localStorage.setItem('token_refresh', data.refresh);

      // Guarda el usuario logueado en localStorage para uso global
      localStorage.setItem('usuario', JSON.stringify(data.user));

      // Redirige al usuario al home tras login exitoso
      navigate('/');
    } catch (err) {
      setErrors({ api: "Ocurrió un error inesperado. Intente más tarde." });
    } finally {
      setLoading(false);
    }
  };

  // Indica si hay errores presentes para resumen accesible
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <>
      <Header tipoUsuario="visitante" />
      <main className="login-page">
        <div className="login-container">
          <div className="login-image">
            <img src={bannerImg} alt="Fondo de agenda cultural" />
            <div className="text-overlay">
              <h2>Iniciar Sesión</h2>
              <p>Tu agenda cultural, a un clic.</p>
            </div>
          </div>

          <form className="login-form" onSubmit={manejarLogin} noValidate autoComplete="off">
            {hasErrors && (
              <div className="error-summary" role="alert" aria-live="assertive" tabIndex={-1}>
                {errors.api || "Por favor, corregí los errores en el formulario."}
              </div>
            )}

            <label htmlFor="email">Correo electrónico:</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Ingrese su correo"
              value={email}
              onChange={e => setEmail(e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "error-email" : undefined}
              autoComplete="username"
            />
            {errors.email && (
              <div id="error-email" className="error" role="alert">{errors.email}</div>
            )}

            <label htmlFor="password">Contraseña:</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "error-password" : undefined}
              autoComplete="current-password"
            />
            {errors.password && (
              <div id="error-password" className="error" role="alert">{errors.password}</div>
            )}

            <div className='button-section'>
              <input
                className="button"
                type="submit"
                value={loading ? "Entrando..." : "Iniciar sesión"}
                disabled={loading}
              />
            </div>

            <a
              href="/recuperar"
              className="link-recuperar"
              tabIndex={0}
              aria-label="Recuperar contraseña"
            >
              Recuperar contraseña
            </a>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}