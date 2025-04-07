import React, { useEffect, useState, useRef } from 'react';
import { supabase } from "../../lib/supabaseClient";
import { Database } from '../../types/supabase';
import { useNavigate } from 'react-router-dom';

type Pacient = Database['public']['Tables']['pacients']['Row'];
type PacientLlista = Pick<Database['public']['Tables']['pacients']['Row'], 'id' | 'nom' | 'cognoms'>;

const Pacient = () => {
  const navigate = useNavigate();
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
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (user && authError == null) {
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
      } else {
        navigate("/");
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

  const handlePacientSelect = (pacient: PacientLlista) => {
    //setSelectedPacient(pacient);
    setSearchTerm(`${pacient.nom}`);
    setShowSuggestions(false);
    
    // Aquí pots fer la consulta a Supabase amb l'ID seleccionat
    console.log("Pacient seleccionat:", pacient);
    fetchPacientDetails(pacient.id);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSelectedPacient(null);
    setShowSuggestions(true);
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };


  // Funció opcional per fer una consulta més detallada del pacient seleccionat
  const fetchPacientDetails = async (id: string) => {
    const { data, error } = await supabase
      .from('pacients')
      .select('*')
      .eq('id', id)
      .single();

    if (!error) {
      console.log("Dades del pacient:", data);
      setSelectedPacient(data);
    }
  };


  return (
    <div className="max-w-250 mx-auto p-6">
      
      <div className="relative max-w-md" ref={searchRef}>
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
                    onClick={() => handlePacientSelect(pacient)}
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
      
      {/* Resultat seleccionat */}
      {selectedPacient && (
        <div className="mt-6">
          {/* Informació general del pacient */}
          <h3 className="w-full text-lg font-semibold text-gray-800 mb-2">General</h3>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="space-y-2">
              {/* Nom i cognoms */}
              <div className="flex flex-wrap -mx-3 mb-6">
                
                <div className="w-full md:w-1/2 px-3">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-nom">
                    Nom
                  </label>
                  <input className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                    id="grid-nom" 
                    type="text" 
                    value={selectedPacient.nom}/>
                </div>
                <div className="w-full md:w-1/2 px-3">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-cognoms">
                    Cognoms
                  </label>
                  <input className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                    id="grid-cognoms" 
                    type="text" 
                    value={selectedPacient.cognoms}/>
                </div>
              </div>

              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-naixement">
                    Data de naixement
                  </label>
                  <input className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                  id="grid-neixament" 
                  type="text" 
                  value={selectedPacient.data_naixement} />
                </div>
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-poblacio">
                    Població
                  </label>
                  <input className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                  id="grid-poblacio" 
                  type="text" 
                  value={selectedPacient.poblacio} />
                </div>
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-facultatiu">
                    Facultatiu
                  </label>
                  <input className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                  id="grid-facultatiu" 
                  type="text" 
                  value={selectedPacient.facultatiu_responsable} />
                </div>

              </div>


            </div>
          </div>

          {/* Informació de dialisi */}
          <h3 className="w-full text-lg font-semibold text-gray-800 mb-2">Dialisi</h3>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="space-y-2">
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-inicihd">
                    Data inici HD
                  </label>
                  <input className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                    id="grid-inicihd" 
                    type="text" 
                    value={selectedPacient.data_inici_HD}/>
                  </div>
                </div>
              </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Pacient;