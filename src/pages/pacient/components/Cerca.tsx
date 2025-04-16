import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { Database } from '../../../types/supabase';

type Pacient = Database['public']['Tables']['pacients']['Row'];
type PacientLlista = Pick<Database['public']['Tables']['pacients']['Row'], 'id' | 'nom' | 'cognoms'>;

type CercaProps = {
    onPacientSelect: (pacient: PacientLlista) => void;
};

const Cerca = ({onPacientSelect}: CercaProps) => {
    const [pacients, setPacients] = useState<PacientLlista[]>([]);
    const [filteredPacients, setFilteredPacients] = useState<PacientLlista[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPacient, setSelectedPacient] = useState<Pacient | null>(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    let dadescarregades = false;

    // Carregar pacients inicials
    useEffect(() => {
    const carregarPacients = async () => {
        setIsLoading(true);
    
        if (pacients.length == 0 && !dadescarregades) {
            dadescarregades = true;
            const { data, error } = await supabase
            .from('pacients')
            .select('id, nom, cognoms');

            if (!error) {
            setPacients(data);
            setFilteredPacients(data);
            }
        }
      
        setIsLoading(false);
    };
    carregarPacients();
    }, []);

    // Filtrar pacients quan canvia el terme de cerca
    useEffect(() => {
    if (searchTerm === '') {
        setFilteredPacients(pacients);
    } else {
        const filtered = pacients.filter(pacient =>
        `${pacient.nom} ${pacient.cognoms}`.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPacients(filtered);
    }
    }, [searchTerm, pacients]);
    


    // Gestionar clic fora del camp de cerca
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
        if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
            setShowSuggestions(false);
        }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSelectedPacient(null);
    setShowSuggestions(true);
    };

    const handleSearchChange = (pacient: PacientLlista) => {
        setSearchTerm(`${pacient.nom} ${pacient.cognoms}`);
        setShowSuggestions(false);
        onPacientSelect(pacient);
    }

    const handleInputFocus = () => {
    setShowSuggestions(true);
    };


    return (
        <div className="relative" ref={searchRef}>
        {/* Camp de cerca */}
        <input
            type="text"
            placeholder="Escriu el nom o cognoms del pacient..."
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        />
        
        {/* Icona de cerca (opcional) */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>
        
        {/* Llista de suggeriments */}
        {showSuggestions && searchTerm && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
            {isLoading ? (
                <div className="p-4 text-center text-gray-500">Carregant...</div>
            ) : filteredPacients.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No s'han trobat resultats</div>
            ) : (
                <ul className="divide-y divide-gray-200">
                {filteredPacients.map(pacient => (
                    <li 
                    key={pacient.id} 
                    className={`p-3 hover:bg-blue-50 cursor-pointer transition-colors ${selectedPacient?.id === pacient.id ? 'bg-blue-100' : ''}`}
                    onClick={() => handleSearchChange(pacient)}
                    >
                    <div className="font-medium text-gray-900">{pacient.nom} {pacient.cognoms}</div>
                    <div className="text-sm text-gray-500">ID: {pacient.id}</div>
                    </li>
                ))}
                </ul>
            )}
            </div>
        )}
        </div>
    );
}

export default Cerca;