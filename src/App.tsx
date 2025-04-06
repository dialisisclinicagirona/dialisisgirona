import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/login/Login';
import Pacient from './pages/pacient/Pacient';  // Asegúrate de tener la página de pacientes

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/pacient" element={<Pacient />} />  {/* Esta será la página de pacientes */}
      </Routes>
    </Router>
  );
}

export default App;