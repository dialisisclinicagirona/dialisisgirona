import React, { useEffect, useState, useRef } from 'react';
import { supabase } from "../../lib/supabaseClient";
import { Database } from '../../types/supabase';
import PacientForm  from './components/Form';
import Cerca from './components/Cerca';

type Pacient = Database['public']['Tables']['pacients']['Row'];
type PacientLlista = Pick<Database['public']['Tables']['pacients']['Row'], 'id' | 'nom' | 'cognoms'>;

const Pacient = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPacient, setSelectedPacient] = useState<Pacient | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  



  const handlePacientSelect = (pacient: PacientLlista) => {
    //setSelectedPacient(pacient);
    setSearchTerm(`${pacient.nom} ${pacient.cognoms}`);
    setShowSuggestions(false);
    
    // Aquí pots fer la consulta a Supabase amb l'ID seleccionat
    console.log("Pacient seleccionat:", pacient);
    fetchPacientDetails(pacient.id);
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

      <Cerca onPacientSelect={handlePacientSelect} />
      
      {/* Resultat seleccionat */}
      {selectedPacient && (
        <PacientForm pacient={selectedPacient} />
      )}
    </div>
  );
};

export default Pacient;