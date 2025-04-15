import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/login/Login';
import Pacient from './pages/pacient/Pacient';
import Usuaris from './pages/usuaris/Usuaris';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/pacient" element={<Pacient />} />  {/* Aquesta es la pàgina de pacients */}
        <Route path="/usuaris" element={<Usuaris />} />
      </Routes>
    </Router>
  );
}

export default App;