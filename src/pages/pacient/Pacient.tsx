import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from "../../lib/supabaseClient";
import { DadaPacient, Database } from '../../types/supabase';
import PacientForm  from './components/Form';
import Cerca from './components/Cerca';
import Top from '../topMenu/Top';


type PacientLlista = Pick<Database['public']['Tables']['pacients']['Row'], 'id' | 'nom' | 'cognoms'>;

const PacientView = () => {
  const { id } = useParams<{ id?: string }>();
  const [selectedPacient, setSelectedPacient] = useState<DadaPacient | null>(null);
  const [allowUpadate, setAllowUpdate] = useState(false);
  const [resetDades, setResetDades] = useState(Date.now());
  
  // Carregar pacient automàticament si hi ha un ID a la URL
  useEffect(() => {
    if (id) {
      console.log("Carregant pacient amb ID:", id);
      fetchPacientDetails(parseInt(id));
    }
  }, [id]); // Executar quan canviï l'ID
  
  const handlePacientChange = (updatedPacient: DadaPacient) => {
    const hasChanged = JSON.stringify(selectedPacient) !== JSON.stringify(updatedPacient);
    const samePacient = selectedPacient?.id === updatedPacient.id;
    console.log("Pacient Change", hasChanged, samePacient)
    setSelectedPacient(updatedPacient);
    setAllowUpdate(samePacient && hasChanged);
    
  };

  const handleSubmitPacient = async () =>{
    console.log("Commit pacient", selectedPacient);
    console.log("Allow update", allowUpadate);
    
    if (!selectedPacient) return null;
    
    try {
      // Si l'ID no existeix, estem creant un nou pacient
      if (!selectedPacient.id) {
        const pacientACrear = cleanPacientData({ ...selectedPacient });

        console.log("Nou pacient", pacientACrear);

        const { data, error } = await supabase
          .from('pacients')
          .insert([pacientACrear])
          .select();
        

        if (error) throw error;
        
        console.log('Nou pacient creat:', data);
        
        // Actualitzar l'estat amb el pacient creat (que tindrà un ID assignat)
        if (data && data.length > 0) {
          // Obtenir les dades completes del nou pacient
          fetchPacientDetails(data[0].id.toString());
        }
        
        setAllowUpdate(false);
        return data;
      } 
      // Actualitzar un pacient existent
      else if (allowUpadate) {
        const id = selectedPacient.id;
        const { data, error } = await supabase
          .from('pacients')
          .update(cleanPacientData(selectedPacient))
          .eq('id', id)
          .select(); // Afegeix .select() per obtenir el registre actualitzat
        
        if (error) throw error;

        console.log('Pacient actualitzat:', data);
        setAllowUpdate(false);
        
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error actualitzant/creant pacient:', error);
      return null;
    } finally {
      setResetDades(Date.now());
    }
  }

  const cleanPacientData = (pacient: any): Partial<typeof pacient> => {
    const { anticoagulant_nom, dialitzador_nom, conc_acid_nom, conc_bic_nom, segellat_cvc_nom, ultima_actualitzacio_pes_tolerat, ...cleaned } = pacient;
    return cleaned;
  };

  const handlePacientSelect = (pacient: PacientLlista) => {
    // Aquí pots fer la consulta a Supabase amb l'ID seleccionat
    console.log("Pacient seleccionat:", pacient);
    fetchPacientDetails(pacient.id);
  };

  // Funció opcional per fer una consulta més detallada del pacient seleccionat
  const fetchPacientDetails = async (id: number) => {
    const { data, error } = await supabase
      .rpc('get_dades_pacient', { pacient_id: id });
  
    if (!error && data && data.length > 0) {
      console.log("Dades del pacient:", data);
      setSelectedPacient(data[0]);
    } else {
      console.error("Error obtenint les dades del pacient:", error);
    }
  };


  // Funció per crear un nou pacient buit
  const handleCreateNewPacient = () => {
    // Crear un objecte amb totes les propietats necessàries inicialitzades amb valors buits o per defecte
    const newPacient: Partial<DadaPacient> = {
      nom: '',
      cognoms: '',
      data_naixement: undefined,
      poblacio: '',
      facultatiu_responsable: '',
      hta: '',
      ic: '',
      mpoc: '',
      dm: '',
      altres_antecedents: '',
      alergies: '',
      comentaris: '',
      barthel: '',
      pfeiffer: '',
      programacio: '',
      ubicacio: '',
      llit: '',
      temps_total: '',
      pes_sec: '',
      anticoagulant: undefined,
      dialitzador: undefined,
      conc_acid: undefined,
      conc_bic: undefined,
      qb: '',
      na: '',
      t_liquid: '',
      ocm: '',
      uf_total: '',
      uf_horaria: '',
      tolerancia_uf: '',
      perfil_uf: '',
      agulles: '',
      acces_vascular: '',
      segellat_cvc: undefined,
      hemostasia: '',
    };
    
    setSelectedPacient(newPacient as DadaPacient);
    setAllowUpdate(true); // Permetre guardar el nou pacient
  };

  // Funció per esborrar el pacient actual
  const handleDeletePacient = async () => {
    if (!selectedPacient || !selectedPacient.id) return;
    
    // Mostrar missatge de confirmació
    if (window.confirm("Estàs segur que vols esborrar aquest pacient? Aquesta acció no es pot desfer.")) {
      try {
        const { error } = await supabase
          .from('pacients')
          .delete()
          .eq('id', selectedPacient.id);
        
        if (error) throw error;
        
        console.log('Pacient esborrat correctament');
        setSelectedPacient(null); // Netejar l'estat del pacient seleccionat
        setResetDades(Date.now());
      } catch (error) {
        console.error('Error esborrant pacient:', error);
      }
    }
  };

  const handleImprimir = () => {
    if (selectedPacient) {
      window.open(`/imprimir/${selectedPacient.id}`, '_new');
    }   
  };

  return (
    <>
    <Top />
    <div className="max-w-250 mx-auto p-6">
      <div className="flex flex-wrap justify-between items-center">
        <div className="w-full md:w-1/2 mb-4 md:mt-0">
          <Cerca onPacientSelect={handlePacientSelect} reset={resetDades} />
        </div>
        <div className="w-full md:w-1/2 md:text-right">
          {((!selectedPacient) || (selectedPacient && selectedPacient.id)) && (
            <button 
              onClick={handleCreateNewPacient}
              className="bg-[#0097A7] hover:bg-[#2cc0d0] text-white font-bold py-2 px-4 mr-2 rounded"
            >
              Nou Pacient
            </button>
          )}
          {selectedPacient && selectedPacient.id && (
            <>
              <button 
                onClick={handleDeletePacient}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 mr-2 rounded"
              >
                Esborrar Pacient
              </button>
              <button 
              onClick={handleImprimir}
              className="bg-grey-50 border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded"
            >
              Imprimir
            </button>
          </>
          )}
        </div>
      </div>
      {/* Resultat seleccionat */}
      {selectedPacient && (
        <PacientForm 
          pacient={selectedPacient} 
          onPacientChange={handlePacientChange}
          onSubmitChange={handleSubmitPacient}
          reset={resetDades}
        />
      )}
    </div>
    </>
  );
};

export default PacientView;