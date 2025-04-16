import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from "../../lib/supabaseClient";
import { DadaPacient } from '../../types/supabase';
import Top from '../topMenu/Top';

type FilteredPacient = {
  id: number;
  nom: string;
  cognoms: string;
  pes_sec: string;
  temps_total: string;
  llit: string;
  dialitzador_nom: string;
  programacio: string;
  ubicacio: string;
};

const PacientsSala = () => {
  const [pacients, setPacients] = useState<FilteredPacient[]>([]);
  const [filteredPacients, setFilteredPacients] = useState<FilteredPacient[]>([]);
  const [programacioFilter, setProgramacioFilter] = useState<string>('');
  const [ubicacioFilter, setUbicacioFilter] = useState<string>('');
  const [programacioOptions, setProgramacioOptions] = useState<string[]>([]);
  const [ubicacioOptions, setUbicacioOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch patients data
  useEffect(() => {
    const fetchPacients = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .rpc('get_dades_pacient', { pacient_id: -1 });

        if (error) {
          console.error("Error fetching patients:", error);
          return;
        }

        if (data) {
          console.log("Pacients", data);
          // Extract the fields we need
          const filteredData = data.map((pacient: DadaPacient) => ({
            id: pacient.id,
            nom: pacient.nom,
            cognoms: pacient.cognoms,
            pes_sec: pacient.pes_sec,
            temps_total: pacient.temps_total,
            llit: pacient.llit,
            dialitzador_nom: pacient.dialitzador_nom,
            programacio: pacient.programacio,
            ubicacio: pacient.ubicacio
          }));

          setPacients(filteredData);
          setFilteredPacients(filteredData);

          // Extract unique values for filters
          const programacions = [...new Set(data.map((p: DadaPacient) => p.programacio).filter(Boolean))] as string[];
          const ubicacions = [...new Set(data.map((p: DadaPacient) => p.ubicacio).filter(Boolean))] as string[];
          
          setProgramacioOptions(programacions);
          setUbicacioOptions(ubicacions);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPacients();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    let result = pacients;

    if (programacioFilter) {
      result = result.filter(pacient => pacient.programacio === programacioFilter);
    }

    if (ubicacioFilter) {
      result = result.filter(pacient => pacient.ubicacio === ubicacioFilter);
    }

    setFilteredPacients(result);
  }, [programacioFilter, ubicacioFilter, pacients]);

  // Handle filter changes
  const handleProgramacioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProgramacioFilter(e.target.value);
  };

  const handleUbicacioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUbicacioFilter(e.target.value);
  };

  // Reset filters
  const handleResetFilters = () => {
    setProgramacioFilter('');
    setUbicacioFilter('');
  };

  return (
    <>
      <Top />
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Pacients per Programació i Ubicació</h1>
        
        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Programació
              </label>
              <select
                value={programacioFilter}
                onChange={handleProgramacioChange}
                className="mt-1 block w-full md:w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Tots</option>
                {programacioOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ubicació (Sala)
              </label>
              <select
                value={ubicacioFilter}
                onChange={handleUbicacioChange}
                className="mt-1 block w-full md:w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Totes</option>
                {ubicacioOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="w-full md:w-auto">
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Reiniciar filtres
              </button>
            </div>
          </div>
        </div>
        
        {/* Results */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregant pacients...</p>
            </div>
          ) : filteredPacients.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No s'han trobat pacients amb els filtres seleccionats
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom i Cognoms
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pes sec
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Programació
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Temps
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Llit
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dialitzador
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPacients.map((pacient) => (
                    <tr key={pacient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link 
                          to={`/pacient/${pacient.id}`} 
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          {pacient.nom} {pacient.cognoms}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {pacient.pes_sec || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {pacient.programacio || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {pacient.temps_total || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {pacient.llit || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {pacient.dialitzador_nom || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PacientsSala;