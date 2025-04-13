import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { Anticoagulant, DadaPacient } from "../../../types/supabase";

type Pacient = DadaPacient;
type FormProps = {
    pacient: Pacient;
    onPacientChange?: (updatedPacient: Pacient) => void;
    onSubmitChange?: () => void;
};

const PacientForm = ({pacient, onPacientChange, onSubmitChange}: FormProps) => {
    const [tab, setTap] = useState("form-general");
    const [anticoagulants, setAnticoagulants] = useState<Anticoagulant[]>([]);
    
    useEffect(() => {
      const fetchData = async () => {
        const data = await fetchAnticoagulants();
        setAnticoagulants(data);
      };

      fetchData();
      console.log("Anticoagulants:", anticoagulants);
    }, []);

    const fetchAnticoagulants = async (): Promise<Anticoagulant[]> => {

      const { data, error } = await supabase
        .from('anticoagulant')
        .select('*');

      if (error) {
        console.error("Error obtenint anticoagulants:", error.message);
        return [];
      }
    
      return data;
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
      if (onPacientChange) {
        onPacientChange({
          ...pacient,
          [e.target.name]: e.target.value
        });
      }
    };

    return (
        <div className="mt-6">
          
          <div id="form-general" className={`${tab !== "form-general"? "hidden ":""}p-4 rounded-lg bg-gray-50`} role="tabpanel" aria-labelledby="profile-tab">
            {/* Informació general del pacient */}
            <h3 className="w-full text-lg font-semibold text-gray-800 mb-2">General</h3>
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="space-y-2">
                {/* Nom i cognoms */}
                <div className="flex flex-wrap -mx-3 mb-6">
                  
                  <div className="w-full md:w-1/3 px-3">
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-nom">
                      Nom
                    </label>
                    <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                      id="grid-nom" 
                      name="nom"
                      type="text" 
                      value={pacient.nom}
                      onChange={handleChange}
                      onBlur={(onSubmitChange)} />
                  </div>
                  <div className="w-full md:w-1/3 px-3">
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-cognoms">
                      Cognoms
                    </label>
                    <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                      id="grid-cognoms" 
                      name="cognoms"
                      type="text" 
                      value={pacient.cognoms}
                      onChange={handleChange}
                      onBlur={(onSubmitChange)}/>
                  </div>
                </div>

                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-naixement">
                      Data de naixement
                    </label>
                    <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                    id="grid-naixement" 
                    name="data_naixement"
                    type="text" 
                    value={pacient.data_naixement?.toString() || ''}
                    onChange={handleChange}
                    onBlur={(onSubmitChange)} />
                  </div>
                  <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-poblacio">
                      Població
                    </label>
                    <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                    id="grid-poblacio" 
                    name="poblacio"
                    type="text" 
                    value={pacient.poblacio}
                    onChange={handleChange}
                    onBlur={(onSubmitChange)} />
                  </div>
                  <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-facultatiu">
                      Facultatiu
                    </label>
                    <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                    id="grid-facultatiu" 
                    name="facultatiu_responsable"
                    type="text" 
                    value={pacient.facultatiu_responsable}
                    onChange={handleChange}
                    onBlur={(onSubmitChange)} />
                  </div>

                </div>


              </div>
            </div>
          </div>
          
          <div id="form-dialisi" className={`${tab !== "form-dialisi"? "hidden ":""}sm:block p-4 rounded-lg bg-gray-50 md:my-6`} role="tabpanel" aria-labelledby="profile-tab">
            {/* Informació de dialisi */}
            <h3 className="w-full text-lg font-semibold text-gray-800 mb-2">Dades de Diàlisi</h3>
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="space-y-2">

                <h3 className="w-full text-lg font-semibold text-gray-800 mb-2">Diàlisi</h3>
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-inicihd">
                      Data inici HD
                    </label>
                    <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                      id="grid-inicihd" 
                      name="data_inici_HD"
                      type="text" 
                      value={pacient.data_inici_HD?.toString() || ''}
                      onChange={handleChange}
                      onBlur={(onSubmitChange)}/>
                  </div>
                  <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-programacio">
                      Programació
                    </label>
                    <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                      id="grid-programacio" 
                      name="programacio"
                      type="text" 
                      value={pacient.programacio}
                      onChange={handleChange}
                      onBlur={(onSubmitChange)}/>
                  </div>
                  <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-ubicacio">
                      Ubicació
                    </label>
                    <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                      id="grid-ubicacio" 
                      name="ubicacio"
                      type="text" 
                      value={pacient.ubicacio}
                      onChange={handleChange}
                      onBlur={(onSubmitChange)}/>
                  </div>
                  <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-llit">
                      Llit
                    </label>
                    <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                      id="grid-llit" 
                      name="llit"
                      type="text" 
                      value={pacient.llit}
                      onChange={handleChange}
                      onBlur={(onSubmitChange)}/>
                  </div>
                </div>

                <h3 className="w-full text-lg font-semibold text-gray-800 mb-2">Pauta</h3>
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-anticoagulant">
                      Anticoagulant
                    </label>
                    <select className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                      id="grid-anticoagulant" 
                      name="anticoagulant"
                      value={pacient.anticoagulant}
                      onChange={handleChange}
                      onBlur={(onSubmitChange)}>
                      <option value="">Selecciona</option>
                      {anticoagulants.map((anticoagulant) => (
                        <option key={anticoagulant.id} value={anticoagulant.id} selected={pacient.anticoagulant === anticoagulant.id}>{anticoagulant.nom}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-dialitzador">
                      Dialitzador
                    </label>
                    <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                      id="grid-dialitzador" 
                      name="dialitzador"
                      type="text" 
                      value={pacient.dialitzador}
                      onChange={handleChange}/>
                  </div>
                  <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-conc_acid">
                      Concut Àcid
                    </label>
                    <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                      id="grid-conc_acid" 
                      name="conc_acid"
                      type="text" 
                      value={pacient.conc_acid}
                      onChange={handleChange}/>
                  </div>
                  <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-conc_bic">
                      Concut Bic
                    </label>
                    <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                      id="grid-conc_bic" 
                      name="conc_bic"
                      type="text" 
                      value={pacient.conc_bic}
                      onChange={handleChange}/>
                  </div>
                </div>

                <h3 className="w-full text-lg font-semibold text-gray-800 mb-2">Bany de diàlisi</h3>
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-qb">
                      QB (ml/min)
                    </label>
                    <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                      id="grid-qb" 
                      name="qb"
                      type="text" 
                      value={pacient.qb}
                      onChange={handleChange}
                      onBlur={(onSubmitChange)}/>
                  </div>
                  <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-na">
                      NA (mmol/L)
                    </label>
                    <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                      id="grid-na" 
                      name="na"
                      type="text" 
                      value={pacient.na}
                      onChange={handleChange}
                      onBlur={(onSubmitChange)}/>
                  </div>
                  <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-t_liquid">
                      Tª Líquid (ºC)
                    </label>
                    <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                      id="grid-t_liquid" 
                      name="t_liquid"
                      type="text" 
                      value={pacient.t_liquid}
                      onChange={handleChange}
                      onBlur={(onSubmitChange)}/>
                  </div>
                  <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-ocm">
                      OCM/KtV objectiu
                    </label>
                    <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                      id="grid-ocm" 
                      name="ocm"
                      type="text" 
                      value={pacient.ocm}
                      onChange={handleChange}
                      onBlur={(onSubmitChange)}/>
                  </div>
                </div>
              </div>
            </div>
          </div>

            {/* Navegació a la part inferior només en mòbil */}
            <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-white border-t border-gray-200 shadow-md">
              <ul className="text-sm font-medium text-center text-gray-500 flex">
                <li className="w-1/4 focus-within:z-10">
                  <button type="button" className="inline-block w-full p-4 text-gray-900 bg-gray-50 border-r border-gray-200 focus:ring-4 focus:ring-blue-300 active focus:outline-none" aria-current="page"
                    onClick={() => setTap("form-general")}>General</button>
                </li>
                <li className="w-1/4 focus-within:z-10">
                  <button className="inline-block w-full p-4 bg-white border-r border-gray-200 hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 focus:outline-none"
                    onClick={() => setTap("form-dialisi")}>Dades de diàlisi</button>
                </li>
                <li className="w-1/4 focus-within:z-10">
                  <button className="inline-block w-full p-4 bg-white border-r border-gray-200 hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 focus:outline-none"
                    onClick={() => setTap("s")}>Accès venós</button>
                </li>
                <li className="w-1/4 focus-within:z-10">
                  <button className="inline-block w-full p-4 bg-white border-s-0 border-gray-200 hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-blue-300"
                    onClick={() => setTap("a")}>Pacient</button>
                </li>
              </ul>
            </div>
            
            {/* Espai addicional per evitar que el contingut quedi sota la navegació fixa */}
            <div className="h-16 sm:hidden"></div>
        </div>
    );
}

export default PacientForm;