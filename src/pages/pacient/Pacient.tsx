import { useState } from 'react';
import { supabase } from "../../lib/supabaseClient";
import { DadaPacient, Database } from '../../types/supabase';
import PacientForm  from './components/Form';
import Cerca from './components/Cerca';
import Top from '../topMenu/Top';

type Pacient = DadaPacient;
type PacientLlista = Pick<Database['public']['Tables']['pacients']['Row'], 'id' | 'nom' | 'cognoms'>;

const Pacient = () => {
  const [selectedPacient, setSelectedPacient] = useState<Pacient | null>(null);
  const [allowUpadate, setAllowUpdate] = useState(false);
  
  const handlePacientChange = (updatedPacient: Pacient) => {
    const hasChanged = JSON.stringify(selectedPacient) !== JSON.stringify(updatedPacient);
    const samePacient = selectedPacient?.id === updatedPacient.id;
    console.log("Pacient Change", hasChanged, samePacient)
    setSelectedPacient(updatedPacient);
    setAllowUpdate(samePacient && hasChanged);
    
  };

  const handleSubmitPacient = async () =>{
    console.log("Commit pacient", selectedPacient);
    console.log("Allow update", allowUpadate);
    if(allowUpadate) {
      const id = selectedPacient?.id ?? -1;
      try{
        const { data, error } = await supabase
        .from('pacients')
        .update(cleanPacientData(selectedPacient))
        .eq('id', id)
        .select(); // Afegeix .select() per obtenir el registre actualitzat
      
        if (error) throw error;

        console.log('Pacient actualitzat:', data);
        setAllowUpdate(false);
        return data;
      } catch (error) {
        console.error('Error actualitzant pacient:', error);
        return null;
      }
    }
  }

  const cleanPacientData = (pacient: any): Partial<typeof pacient> => {
    const { anticoagulant_nom, dialitzador_nom, conc_acid_nom, conc_bic_nom, segellat_cvc_nom, ...cleaned } = pacient;
    return cleaned;
  };

  const handlePacientSelect = (pacient: PacientLlista) => {
    // Aquí pots fer la consulta a Supabase amb l'ID seleccionat
    console.log("Pacient seleccionat:", pacient);
    fetchPacientDetails(pacient.id);
  };

  // Funció opcional per fer una consulta més detallada del pacient seleccionat
  const fetchPacientDetails = async (id: string) => {
    const { data, error } = await supabase
      .rpc('get_dades_pacient', { pacient_id: id });
  
    if (!error && data && data.length > 0) {
      console.log("Dades del pacient:", data);
      setSelectedPacient(data[0]);
    } else {
      console.error("Error obtenint les dades del pacient:", error);
    }
  };


  return (
    <>
    <Top />
    <div className="max-w-250 mx-auto p-6">
      <div className="flex">
        <div className="w-full md:w-1/2">
          <Cerca onPacientSelect={handlePacientSelect} />
        </div>
        <div></div>
      </div>
      {/* Resultat seleccionat */}
      {selectedPacient && (
        <PacientForm 
          pacient={selectedPacient} 
          onPacientChange={handlePacientChange}
          onSubmitChange={handleSubmitPacient}
        />
      )}
    </div>
    </>
  );
};

export default Pacient;