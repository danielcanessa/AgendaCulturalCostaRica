import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Perfil from './pages/Perfil/Perfil';
import UpdatePerfil from './pages/UpdatePerfil/UpdatePerfil';
import Event from './pages/Event/Event';
import CreateEvent from './pages/CreateEvent/CreateEvent';
import EditEvent from './pages/EditEvent/EditEvent';
import MiAgenda from './pages/MiAgenda/MiAgenda';
import EventAdm from './pages/EventAdmin/EventAdmin';
import UserAdmin from './pages/UserAdmin/UserAdmin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/perfil/:id" element={<Perfil />} />
        <Route path="/perfil/editar" element={<UpdatePerfil />} />
        <Route path="/Event/:id" element={<Event />} />
        <Route path="/crear-evento" element={<CreateEvent />} />
        <Route path="/editar-evento/:id" element={<EditEvent />} />
        <Route path="/mi-agenda" element={<MiAgenda />} />
        <Route path="/admin/eventos" element={<EventAdm/>}/>
         <Route path="/admin/usuarios" element={<UserAdmin/>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;

