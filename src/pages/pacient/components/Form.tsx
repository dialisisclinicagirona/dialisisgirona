import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { DadaPacient, Option } from "../../../types/supabase";
import InputText from "../../common/TextInput";
import SelectInput from "../../common/SelectInput";
import DateInput from "../../common/DateInput";
import TextInput from "../../common/TextInput";
import TextAreaInput from "../../common/TextAreaInput";

type Pacient = DadaPacient;
type FormProps = {
    pacient: Pacient;
    onPacientChange?: (updatedPacient: Pacient) => void;
    onSubmitChange?: () => void;
};

const PacientForm = ({pacient, onPacientChange, onSubmitChange}: FormProps) => {
    const [tab, setTab] = useState("form-general");
    const [anticoagulants, setAnticoagulants] = useState<Option[]>([]);
    const [dialitzadors, setDialitzadors] = useState<Option[]>([]);
    const [concsAcid, setConcsAcid] = useState<Option[]>([]);
    const [concsBic, setConcsBic] = useState<Option[]>([]);
    const [segellatsCVC, setSegellatsCVC] = useState<Option[]>([]);
    const opcionsSN = [{ id: "Sí", nom: "Sí" }, { id: "No", nom: "No" }];
    const opcionsProgramacio = [{ id: "Dl, Dx, Dv", nom: "Dl, Dx, Dv" }, { id: "Dm, Dj, Ds", nom: "Dm, Dj, Ds" }];
    const opcionsBarthel = [{id: "100", nom: "Independent (100)"}, {id: "60-90", nom: "Dependència moderada (60-90)"}, {id: "<60", nom: "Dependència greu (< 60)"}];
    const opcionsPfeiffer = [{id: "0-2", nom: "Normal (0-2)"}, {id: "3-4", nom: "Deteriorament lleu (3-4)"}, {id: "5-7", nom: "Moderat (5-7)"}, {id: "8-10", nom: "Greu (8-10)"}]
    
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
      };

      fetchData();
    }, []);

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
      //console.log("Segellats", data);
      if (error) {
        console.error("Error obtenint segellats CVC:", error.message);
        return [];
      }
    
      return data;
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
      if (onPacientChange) {
        onPacientChange({
          ...pacient,
          [e.target.name]: e.target.value || null
        });
      }
    };

    return (
        <div className="mt-6">
          {/* Tabs per a pantalles més grans */}
          <div className="hidden sm:block mb-4">
            <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200">
              <li className="mr-2">
                <button 
                  type="button" 
                  className={`inline-block p-4 rounded-t-lg ${tab === "form-general" ? "text-blue-600 bg-gray-50 border-b-2 border-blue-600 active" : "hover:text-gray-600 hover:bg-gray-50"}`}
                  onClick={() => setTab("form-general")}
                >
                  Dades del Pacient
                </button>
              </li>
              <li className="mr-2">
                <button 
                  type="button" 
                  className={`inline-block p-4 rounded-t-lg ${tab === "form-dialisi" ? "text-blue-600 bg-gray-50 border-b-2 border-blue-600 active" : "hover:text-gray-600 hover:bg-gray-50"}`}
                  onClick={() => setTab("form-dialisi")}
                >
                  Paràmetres de Diàlisi
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  className={`inline-block p-4 rounded-t-lg ${tab === "form-venos" ? "text-blue-600 bg-gray-50 border-b-2 border-blue-600 active" : "hover:text-gray-600 hover:bg-gray-50"}`}
                  onClick={() => setTab("form-venos")}
                >
                  Accès Vascular Hemostàsia
                </button>
              </li>
            </ul>
          </div>
          
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

                <hr className="border-gray-200 mb-6"/>

                <h3 className="w-full text-lg font-semibold text-gray-800 mb-2">Antecedents patològics</h3>
                <div className="flex flex-wrap -mx-3 mb-4"> 
                  <div className="w-full md:w-1/4 px-2">
                    <SelectInput
                      label="Hipertenció arterial"
                      value={pacient.hta}
                      prop="hta"
                      options={opcionsSN}
                      onValueChanged={handleChange}
                      onSubmit={onSubmitChange}
                      />
                  </div>
                  <div className="w-full md:w-1/4 px-2">
                    <SelectInput
                      label="Insuficiència Cardíaca"
                      value={pacient.ic}
                      prop="ic"
                      options={opcionsSN}
                      onValueChanged={handleChange}
                      onSubmit={onSubmitChange}
                      />
                  </div>
                  <div className="w-full md:w-1/4 px-2">
                    <SelectInput
                      label="Mal. Pul. Obstructiva Crònica"
                      value={pacient.mpoc}
                      prop="mpoc"
                      options={opcionsSN}
                      onValueChanged={handleChange}
                      onSubmit={onSubmitChange}
                      />
                  </div>
                  <div className="w-full md:w-1/4 px-2">
                    <TextInput
                      label="Diabetis Mellitus"
                      value={pacient.dm}
                      prop="dm"
                      onValueChanged={handleChange}
                      onSubmit={onSubmitChange}
                      />
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-4">
                  <div className="w-full px-2 mb-4 md:mb-0">
                    <TextAreaInput
                      label="Altres antecedents"
                      value={pacient.altres_antecedents?.toString() ?? ''}
                      prop="altres_antecedents"
                      onValueChanged={handleChange}
                      onSubmit={onSubmitChange}
                    />
                  </div>
                </div>

                <hr className="border-gray-200 mb-6"/>
                
                <h3 className="w-full text-lg font-semibold text-gray-800 mb-2">Al·lèrgies / Comentaris</h3>
                <div className="flex flex-wrap -mx-3 mb-4">
                  <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
                    <TextAreaInput
                      label="Al·lèrgies"
                      value={pacient.alergies?.toString() ?? ''}
                      prop="alergies"
                      onValueChanged={handleChange}
                      onSubmit={onSubmitChange}
                    />
                  </div>
                  <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
                    <TextAreaInput
                      label="Comentaris"
                      value={pacient.comentaris?.toString() ?? ''}
                      prop="comentaris"
                      onValueChanged={handleChange}
                      onSubmit={onSubmitChange}
                    />
                  </div>
                </div>

                <hr className="border-gray-200 mb-6"/>
                
                <h3 className="w-full text-lg font-semibold text-gray-800 mb-2">Escales clíniques</h3>
                <div className="flex flex-wrap -mx-3 mb-4">
                  <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                    <SelectInput
                      label="Índex de Barthel"
                      value={pacient.barthel?.toString() ?? ''}
                      prop="barthel"
                      options={opcionsBarthel}
                      onValueChanged={handleChange}
                      onSubmit={onSubmitChange}
                    />
                  </div>
                  <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                    <SelectInput
                      label="Test de Pfeiffer"
                      value={pacient.pfeiffer?.toString() ?? ''}
                      prop="pfeiffer"
                      options={opcionsPfeiffer}
                      onValueChanged={handleChange}
                      onSubmit={onSubmitChange}
                    />
                  </div>
                  
                </div>

                <hr className="border-gray-200 mb-6"/>
                
                <h3 className="w-full text-lg font-semibold text-gray-800 mb-2">Dades pacient</h3>
                <div className="flex flex-wrap -mx-3 mb-4">
                  <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                    <DateInput
                      label="Data de naixement"
                      name="data_naixement"
                      value={pacient.data_naixement || ""}
                      onChange={handleChange}
                      onBlur={onSubmitChange}
                    />
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
                  
                </div>
              </div>
            </div>
          </div>
          
          <div id="form-dialisi" className={`${tab !== "form-dialisi"? "hidden ":""} p-4 rounded-lg bg-gray-50 md:my-6`} role="tabpanel" aria-labelledby="profile-tab">
            {/* Informació de dialisi */}
            <h3 className="w-full text-lg font-semibold text-gray-800 mb-2">Dades de Diàlisi</h3>
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="space-y-2">

                <h3 className="w-full text-lg font-semibold text-gray-800 mb-2">Diàlisi</h3>
                <div className="flex flex-wrap -mx-3 mb-4">
                  <div className="w-full md:w-1/4 px-2 mb-4 md:mb-0">
                    <DateInput
                      label="Data inici HD"
                      name="data_inici_HD"
                      value={pacient.data_inici_HD || ""}
                      onChange={handleChange}
                      onBlur={onSubmitChange}
                    />
                  </div>
                  <div className="w-full md:w-1/4 px-2 mb-4 md:mb-0">
                    
                    <SelectInput
                      label="Programació"
                      value={pacient.programacio}
                      prop="programacio"
                      options={opcionsProgramacio}
                      onValueChanged={handleChange}
                      onSubmit={onSubmitChange}
                    />
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

                <div className="flex flex-wrap -mx-3 mb-4">
                  <div className="w-full md:w-1/4 px-2 mb-4 md:mb-0">
                    <TextInput
                      label="Temps (min)"
                      value={pacient.temps_total}
                      prop="temps_total"
                      onValueChanged={handleChange}
                      onSubmit={onSubmitChange}
                    />
                  </div>
                  <div className="w-full md:w-1/4 px-2 mb-4 md:mb-0">
                    <TextInput
                      label="Pes sec (kg)"
                      value={pacient.pes_sec?.toString() ?? ''}
                      prop="pes_sec"
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
                      value={pacient.anticoagulant?.toString() ?? ''}
                      prop="anticoagulant"
                      options={anticoagulants}
                      onValueChanged={handleChange}
                      onSubmit={onSubmitChange}
                    />
                  </div>

                  <div className="w-full md:w-1/4 px-2 mb-4 md:mb-0">
                    <SelectInput
                      label="Dialitzador"
                      value={pacient.dialitzador?.toString() ?? ''}
                      prop="dialitzador"
                      options={dialitzadors}
                      onValueChanged={handleChange}
                      onSubmit={onSubmitChange}
                    />
                  </div>

                  <div className="w-full md:w-1/4 px-2 mb-4 md:mb-0">
                    <SelectInput
                      label="Concentració Acid"
                      value={pacient.conc_acid?.toString() ?? ''}
                      prop="conc_acid"
                      options={concsAcid}
                      onValueChanged={handleChange}
                      onSubmit={onSubmitChange}
                    />
                  </div>

                  <div className="w-full md:w-1/4 px-2 mb-4 md:mb-0">
                    <SelectInput
                      label="Concentració Bicarbonat"
                      value={pacient.conc_acid?.toString() ?? ''}
                      prop="conc_bic"
                      options={concsBic}
                      onValueChanged={handleChange}
                      onSubmit={onSubmitChange}
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
                    <SelectInput
                      label="Tolerancia UF seca"
                      value={pacient.tolerancia_uf?.toString() ?? ''}
                      prop="tolerancia_uf"
                      options={opcionsSN}
                      onValueChanged={handleChange}
                      onSubmit={onSubmitChange}
                    />
                  </div>

                  <div className="w-full md:w-1/4 px-2 mb-4 md:mb-0">
                    <SelectInput
                      label="Perfil UF"
                      value={pacient.perfil_uf?.toString() ?? ''}
                      prop="perfil_uf"
                      options={opcionsSN}
                      onValueChanged={handleChange}
                      onSubmit={onSubmitChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="form-venos" className={`${tab !== "form-venos"? "hidden ":""} p-4 rounded-lg bg-gray-50 md:my-6`} role="tabpanel" aria-labelledby="profile-tab">
              {/* Informació de dialisi */}
              <h3 className="w-full text-lg font-semibold text-gray-800 mb-2">Accés venòs</h3>
              <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="space-y-2">
                  <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full px-2">
                      <InputText
                        label="Agulles (A: / V:)"
                        value={pacient.agulles?.toString() ?? ''}
                        prop="agulles"
                        onValueChanged={handleChange}
                        onSubmit={onSubmitChange}
                      />
                    </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-1/3 px-2">
                      <InputText
                        label="Accès Vascular"
                        value={pacient.acces_vascular?.toString() ?? ''}
                        prop="acces_vascular"
                        onValueChanged={handleChange}
                        onSubmit={onSubmitChange}
                      />
                    </div>
                    <div className="w-full md:w-1/3 px-2">
                      <SelectInput
                        label="Segellat CVC"
                        value={pacient.segellat_cvc?.toString() ?? ''}
                        prop="segellat_cvc"
                        options={segellatsCVC}
                        onValueChanged={handleChange}
                        onSubmit={onSubmitChange}
                      />

                    </div>
                    <div className="w-full md:w-1/3 px-2">
                      <TextInput
                        label="Hemostasia"
                        value={pacient.hemostasia?.toString() ?? ''}
                        prop="hemostasia"
                        onValueChanged={handleChange}
                        onSubmit={onSubmitChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
          </div>

            {/* Navegació a la part inferior només en mòbil */}
            <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-white border-t border-gray-200 shadow-md">
              <ul className="text-sm font-medium text-center text-gray-500 flex">
                <li className="w-1/3 focus-within:z-10">
                  <button type="button" className={`${tab == "form-general"? "bg-gray-50 text-gray-900 ": "bg-white hover:text-gray-700 hover:bg-gray-50 "}inline-block w-full p-4 border-r border-gray-200 focus:ring-4 focus:ring-blue-300 focus:outline-none`}
                    aria-current="page" onClick={() => setTab("form-general")}>Dades del Pacient</button>
                </li>
                <li className="w-1/3 focus-within:z-10">
                  <button type="button" className={`${tab == "form-dialisi"? "bg-gray-50 text-gray-900 ": "bg-white hover:text-gray-700 hover:bg-gray-50 "}inline-block w-full p-4 border-r border-gray-200 focus:ring-4 focus:ring-blue-300 focus:outline-none`}
                    aria-current="page" onClick={() => setTab("form-dialisi")}>Paràmetres de Diàlisi</button>
                </li>
                <li className="w-1/3 focus-within:z-10">
                  <button type="button" className={`${tab == "form-venos"? "bg-gray-50 text-gray-900 ": "bg-white hover:text-gray-700 hover:bg-gray-50 "}inline-block w-full p-4 border-r border-gray-200 focus:ring-4 focus:ring-blue-300 focus:outline-none`}
                    aria-current="page" onClick={() => setTab("form-venos")}>Accès Vascular Hemostàsia</button>
                </li>
              </ul>
            </div>
            
            {/* Espai addicional per evitar que el contingut quedi sota la navegació fixa */}
            <div className="h-16 sm:hidden"></div>
        </div>
    );
}

export default PacientForm;