import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import TextInput from "../common/TextInput";
import PasswordInput from "../common/PasswordInput";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [contrasenya, setContrasenya] = useState("");
  const [error, setError] = useState("");

  //Funció de login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Iniciar sessió amb Supabase Auth
    const { data:{ user }, error } = await supabase.auth.signInWithPassword({
      email,
      password: contrasenya,
    });

    if (error || !user) {
      setError("Usuari o contrasenya incorrectes");
      return;
    }


    // Recuperar el perfil de l'usuari associat
    const { data, error: perfilError } = await supabase
      .from('perfils')
      .select('*')
      .eq('id', user.id)
      .single();

      if (perfilError || !data) {
        setError("Usuari o contrasenya incorrectes");
        return;
      }
    
    // Guardar usuari loguejat (localStorage o context)
    
    //localStorage.setItem("usuari", JSON.stringify(data));

    navigate("/pacient");
  };


  
  return (
    <div>
      
      <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100">
        <div className="flex flex-col items-center justify-center my-8">
          <img src="./clinicaGirona192.png" alt="Logo" className="w-24 h-24 mb-4 rounded-2xl shadow-sm" />
          <h1 className="text-2xl font-bold text-[#0066B3]">Diàlisis App - Clínica Girona</h1>
        </div>
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-sm">

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <TextInput
                label="Usuari"
                value={email}
                prop="email"
                onValueChanged={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <PasswordInput
                label="Contrasenya"
                value={contrasenya}
                prop="contrasenya"
                onValueChanged={(e) => setContrasenya(e.target.value)}
              />
              <div className="text-right mt-1">
                <Link to="/forgot-password" className="text-[#0097A7] hover:text-[#007D90] text-sm font-medium">
                  Has oblidat la contrasenya?
                </Link>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              className="w-full bg-[#0097A7] hover:bg-[#007D90] text-white font-semibold py-2 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 mt-6"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
