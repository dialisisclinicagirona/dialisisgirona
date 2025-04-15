import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export default function SetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Extract token from URL on component mount
  useEffect(() => {
    // The token is typically in the URL as a hash parameter
    const hash = window.location.hash;
    const queryParams = new URLSearchParams(window.location.search);
    
    // Check if token is in hash (Supabase default) or in query params
    if (hash && hash.includes("access_token")) {
      const hashParams = new URLSearchParams(hash.substring(1));
      setToken(hashParams.get("access_token"));
    } else if (queryParams.get("token")) {
      // Alternative: token might be in query params
      setToken(queryParams.get("token"));
    } else {
      setError("No s'ha trobat el token d'accés. Si us plau, utilitzeu l'enllaç d'invitació complet.");
    }
  }, []);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate passwords
    if (password !== confirmPassword) {
      setError("Les contrasenyes no coincideixen");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("La contrasenya ha de tenir almenys 8 caràcters");
      setLoading(false);
      return;
    }

    try {
      if (!token) {
        throw new Error("No s'ha trobat el token d'accés");
      }

      // Update password using the token
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        throw error;
      }

      // Password updated successfully
      setSuccess(true);
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Hi ha hagut un error en establir la contrasenya");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center my-8">
        <img src="./clinicaGirona192.png" alt="Logo" className="w-24 h-24 mb-4 rounded-2xl shadow-sm" />
        <h1 className="text-2xl font-bold text-[#0066B3]">Diàlisis App - Clínica Girona</h1>
      </div>
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-sm">
        {success ? (
          <div className="text-center">
            <h2 className="text-xl font-semibold text-green-600 mb-2">Contrasenya establerta correctament!</h2>
            <p className="mb-4">Seràs redirigit a la pàgina d'inici de sessió en uns segons...</p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center">Estableix la teva contrasenya</h2>
            <form onSubmit={handleSetPassword} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Nova contrasenya</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={8}
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Confirma la contrasenya</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={8}
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full ${
                  loading ? "bg-gray-400" : "bg-[#0097A7] hover:bg-[#007D90]"
                } text-white font-semibold py-2 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 mt-6`}
              >
                {loading ? "Processant..." : "Establir contrasenya"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}