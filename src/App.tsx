import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/login/Login';
import Pacient from './pages/pacient/Pacient';
import Usuaris from './pages/usuaris/Usuaris';
import SetPassword from './pages/set-password/SetPassword';
import ForgotPassword from './pages/forgot-password/ForgotPassword';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/pacient" element={<Pacient />} />  {/* Aquesta es la pàgina de pacients */}
        <Route path="/usuaris" element={<Usuaris />} />
        <Route path="/set-password" element={<SetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;