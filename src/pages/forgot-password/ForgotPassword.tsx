import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import TextInput from "../common/TextInput";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate email
      if (!email || !email.includes("@")) {
        throw new Error("Si us plau, introdueix un correu electrònic vàlid");
      }

      // Send password reset email
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/set-password`,
      });

      if (error) {
        throw error;
      }

      // Show success message
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Hi ha hagut un error en enviar el correu de recuperació");
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
            <h2 className="text-xl font-semibold text-green-600 mb-2">Correu enviat!</h2>
            <p className="mb-4">
              Si el correu electrònic existeix al nostre sistema, rebràs un enllaç per restablir la teva contrasenya.
            </p>
            <Link
              to="/"
              className="text-[#0097A7] hover:text-[#007D90] font-medium"
            >
              Tornar a l'inici de sessió
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center">Recuperar contrasenya</h2>
            <p className="text-gray-600 mb-4 text-sm text-center">
              Introdueix el teu correu electrònic i t'enviarem un enllaç per restablir la teva contrasenya.
            </p>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <TextInput
                  label="Correu electrònic"
                  value={email}
                  prop="email"
                  onValueChanged={(e) => setEmail(e.target.value)}
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
                {loading ? "Enviant..." : "Enviar enllaç de recuperació"}
              </button>

              <div className="text-center mt-4">
                <Link
                  to="/"
                  className="text-[#0097A7] hover:text-[#007D90] text-sm font-medium"
                >
                  Tornar a l'inici de sessió
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}