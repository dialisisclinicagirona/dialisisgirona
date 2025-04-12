import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from "../../lib/supabaseClient";
import { User } from '@supabase/supabase-js';

const Top = () => {
    const location = useLocation();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        // Obtenir l'usuari actual
        const getUser = async () => {
            try {
                setLoading(true);
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user);
            } catch (error) {
                console.error('Error obtenint usuari:', error);
            } finally {
                setLoading(false);
            }
        };

        getUser();

        // Subscriure's als canvis d'autenticació
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log("Session", session);
            setUser(session?.user ?? null);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    const isActive = (path: string) => {
        return location.pathname === path ? 
            'bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium' : 
            'text-gray-300 hover:bg-blue-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium';
    };

    return (
        <nav className="bg-blue-800">
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-16">
                    {/* Botó de menú per a mòbil */}
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <button 
                            type="button" 
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            aria-expanded="false"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <span className="sr-only">Obrir menú principal</span>
                            {/* Icona de menú */}
                            <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>

                    {/* Logo i enllaços de navegació */}
                    <div className="flex-1 flex items-center justify-start ps-12 sm:ps-0 sm:items-stretch sm:justify-start">
                        <div className="flex-shrink-0 flex items-center">
                            <span className="text-white font-bold text-xl">Diàlisi Clínica</span>
                        </div>
                        <div className="hidden sm:block sm:ml-6">
                            <div className="flex space-x-4">
                                <Link to="/pacient" className={isActive('/pacient')}>
                                    Pacient
                                </Link>
                                <Link to="/sala" className={isActive('/sala')}>
                                    Filtre per sala
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Informació d'usuari */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        {loading ? (
                            <span className="text-gray-300 text-sm">Carregant...</span>
                        ) : user ? (
                            <div className="ml-3 relative">
                                <div className="flex items-center">
                                    <span className="text-gray-300 text-sm mr-2">{user.email}</span>
                                    <button 
                                        onClick={handleLogout}
                                        className="bg-blue-700 p-1 rounded-full text-gray-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-white"
                                    >
                                        <span className="text-xs px-2">Sortir</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/" className="text-gray-300 hover:bg-blue-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                Iniciar sessió
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Menú mòbil */}
            <div className={`${menuOpen ? 'block' : 'hidden'} sm:hidden`}>
                <div className="px-2 pt-2 pb-3 space-y-1">
                    <Link 
                        to="/pacient" 
                        className={`${isActive('/pacient')} block`}
                        onClick={() => setMenuOpen(false)}
                    >
                        Pacient
                    </Link>
                    <Link 
                        to="/sala" 
                        className={`${isActive('/sala')} block`}
                        onClick={() => setMenuOpen(false)}
                    >
                        Filtre per sala
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Top;