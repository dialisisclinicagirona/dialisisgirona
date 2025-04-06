import React, { useEffect, useState } from 'react';
import { supabase } from "../../lib/supabaseClient";
import { Database } from '../../types/supabase';
import { useNavigate } from 'react-router-dom';

type Pacient = Database['public']['Tables']['pacients']['Row'];
type PacientLlista = Pick<Database['public']['Tables']['pacients']['Row'], 'id' | 'nom'>;

const Pacient = () => {
  const navigate = useNavigate();
  const [pacients, setPacients] = useState<PacientLlista[]>([]);
  let dadescarregades = false;
  

  useEffect(() => {
    const carregarPacients = async () => {

      // 1. Verifica l'usuari
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      //console.log("Usuari:", user, "Error:", authError);

      // 
      if(user && authError == null){
        if(pacients.length == 0 && !dadescarregades){
          dadescarregades = true;
          const { data, error } = await supabase
            .from('pacients')
            .select('id, nom');
            
          console.log(data);
          if (!error) setPacients(data);
        }
    }
      else{
        navigate("/");
      }
    };
    carregarPacients();
  }, []);

  return (
    <div>
      <ul>
      {pacients.map(pacient => (
        <li key={pacient.id}>{pacient.nom}</li>
      ))}
    </ul>
      
    </div>
  );
};

export default Pacient;