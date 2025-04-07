import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

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
      throw error || new Error('Usuari no trobat');
    }

    // Recuperar el perfil de l'usuari associat
    const { data, error: perfilError } = await supabase
      .from('perfils')
      .select('*')
      .eq('id', user.id)
      .single();

    if (perfilError || !data) {
      throw perfilError || new Error('Perfil no trobat');
    }
    
    // Guardar usuari loguejat (localStorage o context)
    
    //localStorage.setItem("usuari", JSON.stringify(data));

    navigate("/pacient");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Iniciar sessió</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Usuari</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Contrasenya</label>
            <input
              type="password"
              value={contrasenya}
              onChange={(e) => setContrasenya(e.target.value)}
              className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
