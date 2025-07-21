import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Perfil from './pages/Perfil/Perfil';
import UpdatePerfil from './pages/UpdatePerfil/UpdatePerfil';
import Event from './pages/Event/Event';
import CreateEvent from './pages/CreateEvent/CreateEvent';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/perfil/editar" element={<UpdatePerfil />} />
        <Route path="/Event/:id" element={<Event />} />
        <Route path="/crear-evento" element={<CreateEvent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

