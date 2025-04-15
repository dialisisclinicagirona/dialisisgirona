import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { DadaPacient, Option } from "../../../types/supabase";
import InputText from "../../common/InputText";
import SelectInput from "../../common/Selector";

type Pacient = DadaPacient;
type FormProps = {
    pacient: Pacient;
    onPacientChange?: (updatedPacient: Pacient) => void;
    onSubmitChange?: () => void;
};

const PacientForm = ({pacient, onPacientChange, onSubmitChange}: FormProps) => {
    const [tab, setTap] = useState("form-general");
    const [anticoagulants, setAnticoagulants] = useState<Option[]>([]);
    const [dialitzadors, setDialitzadors] = useState<Option[]>([]);
    const [concsAcid, setConcsAcid] = useState<Option[]>([]);
    const [concsBic, setConcsBic] = useState<Option[]>([]);
    const [segellatsCVC, setSegellatsCVC] = useState<Option[]>([]);
    
    useEffect(() => {
      const fetchData = async () => {
        const a = await fetchAnticoagulants();
        const d = await fetchDialitzadors();
        const ca = await fetchConcentracionsAcid();
        const cb = await fetchConcentracionsBicarbonat();
        const sc = await fetchSegellatsCVC();
        setAnticoagulants(a);
        setDialitzadors(d);
        setConcsAcid(ca);
        setConcsBic(cb);
        setSegellatsCVC(sc);
        console.log(segellatsCVC);
      };

      fetchData();
    }, []);

    useEffect(() => {
     console.log("Pacient changed", pacient);
    }, [JSON.stringify(pacient)]);

    const fetchAnticoagulants = async (): Promise<Option[]> => {
      const { data, error } = await supabase
        .from('anticoagulant')
        .select('*');

      if (error) {
        console.error("Error obtenint anticoagulants:", error.message);
        return [];
      }
    
      return data;
    };

    const fetchDialitzadors = async (): Promise<Option[]> => {
      const { data, error } = await supabase
        .from('dialitzador')
        .select('*');

      if (error) {
        console.error("Error obtenint dialitzadors:", error.message);
        return [];
      }
    
      return data;
    };

    const fetchConcentracionsAcid = async (): Promise<Option[]> => {
      const { data, error } = await supabase
        .from('concentracio_acid')
        .select('*');

      if (error) {
        console.error("Error obtenint concentracions acid:", error.message);
        return [];
      }
    
      return data;
    };

    const fetchConcentracionsBicarbonat = async (): Promise<Option[]> => {
      const { data, error } = await supabase
        .from('concentracio_bicarbonat')
        .select('*');

      if (error) {
        console.error("Error obtenint concentracions bicarbonat:", error.message);
        return [];
      }
    
      return data;
    };

    const fetchSegellatsCVC = async (): Promise<Option[]> => {
      const { data, error } = await supabase
        .from('segellat_cvc')
        .select('*');

      if (error) {
        console.error("Error obtenint segellats CVC:", error.message);
        return [];
      }
    
      return data;
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
      if (onPacientChange) {
        onPacientChange({
          ...pacient,
          [e.target.name]: e.target.value || null
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
                  <div className="w-full md:w-1/3 px-2">
                    <InputText 
                      label="Nom" 
                      value={pacient.nom} 
                      prop="nom" 
                      onValueChanged={handleChange} 
                      onSubmit={onSubmitChange} />
                  </div>
                  <div className="w-full md:w-1/3 px-2">
                    <InputText 
                      label="Cognoms"
                      value={pacient.cognoms}
                      prop="cognoms"
                      onValueChanged={handleChange}
                      onSubmit={onSubmitChange} />
                  </div>
                </div>

                <div className="flex flex-wrap -mx-3 mb-4">
                  <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">

                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-1" htmlFor="grid-naixement">
                      Data de naixement
                    </label>
                    <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-2 px-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-naixement" 
                    name="data_naixement"
                    type="text" 
                    value={pacient.data_naixement?.toString() || ''}
                    onChange={handleChange}
                    onBlur={(onSubmitChange)} />
                  </div>
                  <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                    <InputText 
                      label="Població"
                      value={pacient.poblacio}
                      prop="poblacio"
                      onValueChanged={handleChange}
                      onSubmit={onSubmitChange} 
                    />
                  </div>
                  <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                    <InputText
                      label="Facultatiu"
                      value={pacient.facultatiu_responsable}
                      prop="facultatiu_responsable"
                      onValueChanged={handleChange}
                      onSubmit={onSubmitChange}
                    />
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
                <div className="flex flex-wrap -mx-3 mb-4">
                  <div className="w-full md:w-1/4 px-2 mb-4 md:mb-0">

                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-1" htmlFor="grid-inicihd">
                      Data inici HD
                    </label>
                    <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-2 px-3 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-inicihd" 
                      name="data_inici_HD"
                      type="text" 
                      value={pacient.data_inici_HD?.toString() ?? ''}
                      onChange={handleChange}
                      onBlur={(onSubmitChange)}/>
                  </div>
                  <div className="w-full md:w-1/4 px-2 mb-4 md:mb-0">
                    
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-1" htmlFor="grid-programacio">
                      Programació
                    </label>
                    <select className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-2 px-3 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                       id="grid-programacio" 
                      name="programacio"
                      value={pacient.programacio ?? ''}
                      onChange={handleChange}
                      onBlur={(onSubmitChange)}>
                      <option value="">Selecciona</option>
                      <option value="Dl, Dx, Dv">Dl, Dx, Dv</option>
                      <option value="Dm, Dj, Ds">Dm, Dj, Ds</option>
                    </select>
                  </div>
                  <div className="w-full md:w-1/4 px-2 mb-4 md:mb-0">
                  <InputText
                      label="Ubicació" 
                      value={pacient.ubicacio}
                      prop="ubicacio"
                      onValueChanged={handleChange}
                      onSubmit={onSubmitChange}
                    />
                  </div>
                  <div className="w-full md:w-1/4 px-2 mb-4 md:mb-0">
                    <InputText
                      label="Llit"
                      value={pacient.llit?.toString() ?? ''}
                      prop="llit"
                      onValueChanged={handleChange}
                      onSubmit={onSubmitChange}
                    />
                  </div>
                </div>

                <hr className="border-gray-200 mb-6"/>

                <h3 className="w-full text-lg font-semibold text-gray-800 mb-2">Pauta</h3>
                <div className="flex flex-wrap -mx-3 mb-4">
                  <div className="w-full md:w-1/4 px-2 mb-4 md:mb-0">
                  <SelectInput
                    label="Anticoagulant"
                    pacient={pacient}
                    prop="anticoagulant"
                    options={anticoagulants}
                    onPacientChange={handleChange}
                    onSubmitChange={onSubmitChange}
                  />
                  </div>
                  <div className="w-full md:w-1/4 px-2 mb-4 md:mb-0">
                    <SelectInput
                      label="Dialitzador"
                      pacient={pacient}
                      prop="dialitzador"
                      options={dialitzadors}
                      onPacientChange={handleChange}
                      onSubmitChange={onSubmitChange}
                    />
                  </div>
                  <div className="w-full md:w-1/4 px-2 mb-4 md:mb-0">
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-1" htmlFor="grid-conc_acid">
                      Concut Àcid
                    </label>
                    <select className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-2 px-3 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-conc_acid" 
                      name="conc_acid"
                      value={pacient.conc_acid ?? ''}
                      onChange={handleChange}
                      onBlur={(onSubmitChange)}>
                      <option value="">Selecciona</option>
                      {concsAcid.map((c) => (
                        <option key={c.id} value={c.id}>{c.nom}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full md:w-1/4 px-2 mb-4 md:mb-0">
                    <SelectInput
                      label="Concentració Bicarbonat"
                      pacient={pacient}
                      prop="conc_bic"
                      options={concsBic}
                      onPacientChange={handleChange}
                      onSubmitChange={onSubmitChange}
                    />
                  </div>
                </div>

                <hr className="border-gray-200 mb-6"/>

                <h3 className="w-full text-lg font-semibold text-gray-800 mb-2">Bany de diàlisi</h3>
                <div className="flex flex-wrap -mx-3 mb-4">
                  <div className="w-full md:w-1/4 px-2 mb-4 md:mb-0">
                    <InputText
                      label="QB (ml/min)"
                      value={pacient.qb?.toString() ?? ''}
                      prop="qb"
                      onValueChanged={handleChange}
                      onSubmit={onSubmitChange}
                    />
                  </div>
                  <div className="w-full md:w-1/4 px-2 mb-4 md:mb-0">
                    <InputText
                      label="NA (mmol/L)"
                      value={pacient.na?.toString() ?? ''}
                      prop="na"
                      onValueChanged={handleChange}
                      onSubmit={onSubmitChange}
                    />
                  </div>
                  <div className="w-full md:w-1/4 px-2 mb-4 md:mb-0">
                    <InputText
                      label="Tª Líquid (ºC)"
                      value={pacient.t_liquid?.toString() ?? ''}
                      prop="t_liquid"
                      onValueChanged={handleChange}
                      onSubmit={onSubmitChange}
                    />
                  </div>
                  <div className="w-full md:w-1/4 px-2 mb-4 md:mb-0">
                    <InputText
                      label="OCM/KtV objectiu"
                      value={pacient.ocm?.toString() ?? ''}
                      prop="ocm"
                      onValueChanged={handleChange}
                      onSubmit={onSubmitChange}
                    />
                  </div>
                </div>
                
                <hr className="border-gray-200 mb-6"/>

                <h3 className="w-full text-lg font-semibold text-gray-800 mb-2">UF</h3>
                <div className="flex flex-wrap -mx-3 mb-4">
                  <div className="w-full md:w-1/4 px-2 mb-4 md:mb-0">
                    <InputText
                      label="UF màx. Total (ml)"
                      value={pacient.uf_total?.toString() ?? ''}
                      prop="uf_total"
                      onValueChanged={handleChange}
                      onSubmit={onSubmitChange}
                    />
                  </div>
                  <div className="w-full md:w-1/4 px-2 mb-4 md:mb-0">
                    <InputText
                      label="UF màx. horària (ml/h)"
                      value={pacient.uf_horaria?.toString() ?? ''}
                      prop="uf_horaria"
                      onValueChanged={handleChange}
                      onSubmit={onSubmitChange}
                    />
                  </div>
                  <div className="w-full md:w-1/4 px-2 mb-4 md:mb-0">
                  
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-1" htmlFor="grid-ocm">
                      Tolèrancia UF seca
                    </label>
                    <select className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-2 px-3 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-tolerancia_uf" 
                      name="tolerancia_uf"
                      value={pacient.tolerancia_uf ?? ''}
                      onChange={handleChange}
                      onBlur={(onSubmitChange)}>
                      <option value="">Selecciona</option>
                      <option value="Sí">Sí</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div className="w-full md:w-1/4 px-2 mb-4 md:mb-0">
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-1" htmlFor="grid-ocm">
                      Perfil UF
                    </label>
                    <select className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-2 px-3 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-perfil_uf" 
                      name="perfil_uf"
                      value={pacient.perfil_uf ?? ''}
                      onChange={handleChange}
                      onBlur={(onSubmitChange)}>
                      <option value="">Selecciona</option>
                      <option value="Sí">Sí</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="form-venos" className={`${tab !== "form-dialisi"? "hidden ":""}sm:block p-4 rounded-lg bg-gray-50 md:my-6`} role="tabpanel" aria-labelledby="profile-tab">
              {/* Informació de dialisi */}
              <h3 className="w-full text-lg font-semibold text-gray-800 mb-2">Accés venòs</h3>
              <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                  
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
                    onClick={() => setTap("form-venos")}>Accès venós</button>
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