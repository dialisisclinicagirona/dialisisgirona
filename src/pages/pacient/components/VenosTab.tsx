import { useEffect, useState } from "react";
import { DadaPacient, Option, Incidencia } from "../../../types/supabase";
import InputText from "../../common/TextInput";
import SelectInput from "../../common/SelectInput";
import TextAreaInput from "../../common/TextAreaInput";
import DateInput from "../../common/DateInput";
import { supabase } from "../../../lib/supabaseClient";
import { format } from "date-fns";
import { ca } from "date-fns/locale";

type VenosTabProps = {
  pacient: DadaPacient;
  favTecniques: Option[];
  onPacientChange?: (updatedPacient: DadaPacient) => void;
  onSubmitChange?: () => void;
};

const VenosTab = ({
  pacient,
  favTecniques,
  onPacientChange,
  onSubmitChange
}: VenosTabProps) => {
  const opcionsSN = [{ id: "Sí", nom: "Sí" }, { id: "No", nom: "No" }];
  const opcionsFAV = [{id: "No", nom: "No"}, {id: "Unipunció", nom: "Unipunció"}, {id: "Bipunció", nom: "Bipunció"}];
  const opcionsHemostasia = [{id: "Manual", nom: "Manual"}, {id: "Dispositiu", nom: "Dispositiu"}];
  const opcionsCateterTipus = [{id: "No", nom: "No"},{id: "AxA", nom: "AxA"}, {id: "AxV", nom: "AxV"}];
  const opcionsAgulles = [{id: "Biselada", nom: "Biselada"}, {id: "Roma", nom: "Roma"}, {id: "Clampcath", nom: "Clampcath"}];
  const opcionsAgullesMides = [{id: "18", nom: "18"}, {id: "17", nom: "17"}, {id: "16", nom: "16"}, {id: "15", nom: "15"}];
  const opcionsIncidenciaTipus = [
    { id: "Punció difícil", nom: "Punció difícil" },
    { id: "Extravasació", nom: "Extravasació" },
    { id: "Infecció", nom: "Infecció" },
    { id: "Obstrucció", nom: "Obstrucció" },
    { id: "Altres", nom: "Altres" },
  ];

  const [isFAVIExpanded, setIsFAVIExpanded] = useState(true);
  const [incidencies, setIncidencies] = useState<Incidencia[]>([]);
  const [isCateterExpanded, setIsCateterExpanded] = useState(true);
  const [novaIncidencia, setNovaIncidencia] = useState({ tipus: '', descripcio: '' });
  const [errorIncidencia, setErrorIncidencia] = useState<string | null>(null);
  const [loadingIncidencia, setLoadingIncidencia] = useState(false);

  useEffect(() => {
    if(pacient && pacient.id) {
      fetchIncidenciesPacient();
    }
  },[]);

  const fetchIncidenciesPacient = async () => {
    const { data, error } = await supabase
          .from('incidencia_pacient')
          .select(`*`)
          .eq('pacient_id', pacient.id)
          .order('data', { ascending: false });
              
            
    if (error) throw error;
    console.log("Incidencies", data);
    // Actualitzar l'estat amb el pacient creat (que tindrà un ID assignat)
    if (data && data.length > 0) {
      // Obtenir les dades completes del nou pacient
      setIncidencies(data);
    }
    
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    if (onPacientChange) {
      console.log("Pacient", pacient);
      onPacientChange({
        ...pacient,
        [e.target.name]: e.target.value || null
      });
    }
  };

  const handleChangeFAV = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onPacientChange) {
      const pacientTemp = { ...pacient };
      const value = e.target.value;
      if(value === "No") {
        pacientTemp.fav_tecnica = null;
        pacientTemp.fav_ecoguiada = "";
        pacientTemp.agullaA = "";
        pacientTemp.agullaV = "";
        pacientTemp.agullaA_mida = null;
        pacientTemp.agullaV_mida = null;
        pacientTemp.hemostasia = "";
        pacientTemp.hemostasia_temps = "";
        pacientTemp.trans_flux_acces = "";
        pacientTemp.trans_recirculacio = "";
        pacientTemp.trans_propera_revisio = null;
        pacientTemp.fav_comentaris = "";

      }
      else if(value === "Unipunció"){
        pacientTemp.agullaV = "";
        pacientTemp.agullaV_mida = null;
      }

      onPacientChange({
        ...pacientTemp,
        [e.target.name]: e.target.value || null
      });
    }
  };

  const handleChangeCateter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onPacientChange) {
      const pacientTemp = { ...pacient };
      const value = e.target.value;
      
      if(value === "No") {
        pacientTemp.llum_A = "";
        pacientTemp.llum_V = "";
        pacientTemp.cateter_comentaris = "";
      }
      else if(value === "AxA") {  
        pacientTemp.llum_V = "";
      }

      onPacientChange({
        ...pacientTemp,
        [e.target.name]: e.target.value || null
      });
    }
  };

  const toggleFAVIPanel = () => {
    setIsFAVIExpanded(!isFAVIExpanded);
  };

  const toggleCateterPanel = () => {
    setIsCateterExpanded(!isCateterExpanded);
  };

  const handleNovaIncidenciaChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    setNovaIncidencia({ ...novaIncidencia, [e.target.name]: e.target.value });
  };

  const handleCrearIncidencia = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorIncidencia(null);
    if (!novaIncidencia.tipus || !novaIncidencia.descripcio) {
      setErrorIncidencia('Cal omplir tots els camps.');
      return;
    }
    setLoadingIncidencia(true);
    const { error } = await supabase.from('incidencia_pacient').insert({
      pacient_id: pacient.id,
      tipus: novaIncidencia.tipus,
      descripcio: novaIncidencia.descripcio,
      data: new Date().toISOString(),
    });
    setLoadingIncidencia(false);
    if (error) {
      setErrorIncidencia('Error al crear la incidència.');
      return;
    }
    setNovaIncidencia({ tipus: '', descripcio: '' });
    fetchIncidenciesPacient();
  };

  return (
    <div className="p-4 rounded-lg bg-gray-50 md:my-6" role="tabpanel" aria-labelledby="profile-tab">
      <h1 className="w-full text-lg font-semibold text-gray-800 mb-2">Accés venòs</h1>
      
      {/* FAVI Panel */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-800">Fístula Arteriovenosa (FAVI)</h3>
            <button 
              onClick={toggleFAVIPanel} 
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-expanded={isFAVIExpanded}
              aria-label={isFAVIExpanded ? "Collapse FAVI panel" : "Expand FAVI panel"}
            >
              <svg 
                className={`w-5 h-5 transition-transform ${isFAVIExpanded ? 'transform rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
          </div>
          
          {isFAVIExpanded && (
            <>
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/3 px-2">
                  <SelectInput
                    label="FAV"
                    value={pacient.fav?.toString() ?? ''}
                    prop="fav"
                    onValueChanged={handleChangeFAV}
                    options={opcionsFAV}
                    required={true}
                    onSubmit={onSubmitChange}
                  />
                </div>
                <div className="w-full md:w-1/3 px-2">
                  <SelectInput
                    label="Tècnica"
                    value={pacient.fav_tecnica?.toString() ?? ''}
                    prop="fav_tecnica"
                    disabled={pacient.fav === "No"}
                    onValueChanged={handleChange}
                    options={favTecniques}
                    onSubmit={onSubmitChange}
                  />
                </div>
                <div className="w-full md:w-1/3 px-2">
                  <SelectInput
                    label="Ecoguiada"
                    value={pacient.fav_ecoguiada?.toString() ?? ''}
                    prop="fav_ecoguiada"
                    disabled={pacient.fav === "No"}
                    onValueChanged={handleChange}
                    options={opcionsSN}
                    onSubmit={onSubmitChange}
                  />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/4 px-2">
                  <SelectInput
                    label="Agulla Arterial"
                    value={pacient.agullaA?.toString() ?? ''}
                    prop="agullaA"
                    disabled={pacient.fav === "No"}
                    onValueChanged={handleChange}
                    options={opcionsAgulles}
                    onSubmit={onSubmitChange}
                  />
                </div>
                <div className="w-full md:w-1/4 px-2">
                  <SelectInput
                    label="Mida"
                    value={pacient.agullaA_mida?.toString() ?? ''}
                    prop="agullaA_mida"
                    disabled={pacient.fav === "No"}
                    onValueChanged={handleChange}
                    options={opcionsAgullesMides}
                    onSubmit={onSubmitChange}
                  />
                </div>
                <div className="w-full md:w-1/4 px-2">
                  <SelectInput
                    label="Agulla Venosa"
                    value={pacient.agullaV?.toString() ?? ''}
                    prop="agullaV"
                    disabled={pacient.fav !== "Bipunció"}
                    onValueChanged={handleChange}
                    options={opcionsAgulles}
                    onSubmit={onSubmitChange}
                  />
                </div>
                <div className="w-full md:w-1/4 px-2">
                  <SelectInput
                    label="Mida"
                    value={pacient.agullaV_mida?.toString() ?? ''}
                    prop="agullaV_mida"
                    disabled={pacient.fav !== "Bipunció"}
                    onValueChanged={handleChange}
                    options={opcionsAgullesMides}
                    onSubmit={onSubmitChange}
                  />
                </div>
              </div>
              <h3 className="w-full text-lg font-semibold text-gray-800 mb-2">Hemostàsia</h3>
              <div className="flex flex-wrap -mx-3 mb-4"> 
                <div className="w-full md:w-1/4 px-2">
                  <SelectInput
                    label="Hemostàsia"
                    value={pacient.hemostasia?.toString() ?? ''}
                    prop="hemostasia"
                    disabled={pacient.fav === "No"}
                    onValueChanged={handleChange}
                    options={opcionsHemostasia}
                    onSubmit={onSubmitChange}
                  />
                </div>
                <div className="w-full md:w-1/4 px-2">
                  <InputText
                    label="Temps"
                    value={pacient.hemostasia_temps?.toString() ?? ''}
                    prop="hemostasia_temps"
                    disabled={pacient.fav === "No"}
                    onValueChanged={handleChange}
                    onSubmit={onSubmitChange}
                  />
                </div>
              </div>
              <h3 className="w-full text-lg font-semibold text-gray-800 mb-2">Transònic</h3>
              <div className="flex flex-wrap -mx-3 mb-4"> 
                <div className="w-full md:w-1/4 px-2">
                  <InputText
                    label="Flux Accés"
                    value={pacient.trans_flux_acces?.toString() ?? ''}
                    prop="trans_flux_acces"
                    disabled={pacient.fav === "No"}
                    onValueChanged={handleChange}
                    onSubmit={onSubmitChange}
                  />
                </div>
                <div className="w-full md:w-1/4 px-2">
                  <InputText
                    label="Recirculació"
                    value={pacient.trans_recirculacio?.toString() ?? ''}
                    prop="trans_recirculacio"
                    disabled={pacient.fav === "No"}
                    onValueChanged={handleChange}
                    onSubmit={onSubmitChange}
                  />
                </div>
                <div className="w-full md:w-1/4 px-2">
                  <DateInput
                    label="Propera revisió"
                    value={pacient.trans_propera_revisio || ""}
                    name="trans_propera_revisio"
                    disabled={pacient.fav === "No"}
                    onChange={handleChange}
                    onBlur={onSubmitChange}
                  />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/1 px-2">
                  <TextAreaInput
                    label="Comentaris"
                    value={pacient.fav_comentaris?.toString() ?? ''}
                    prop="fav_comentaris"
                    disabled={pacient.fav === "No"}
                    onValueChanged={handleChange}
                    onSubmit={onSubmitChange}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      <br/>
      
      {/* Cateter Panel */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-lg font-semibold text-gray-800">Catéter</h1>
            <button 
              onClick={toggleCateterPanel} 
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-expanded={isCateterExpanded}
              aria-label={isCateterExpanded ? "Collapse Catéter panel" : "Expand Catéter panel"}
            >
              <svg 
                className={`w-5 h-5 transition-transform ${isCateterExpanded ? 'transform rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
          </div>
          
          {isCateterExpanded && (
            <>
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/3 px-2">
                  <SelectInput
                    label="Tipus"
                    value={pacient.cateter?.toString() ?? ''}
                    prop="cateter"
                    onValueChanged={handleChangeCateter}
                    options={opcionsCateterTipus}
                    required={true}
                    onSubmit={onSubmitChange}
                  />
                </div>
                <div className="w-full md:w-1/3 px-2">
                  <InputText
                    label="Llum A"
                    value={pacient.llum_A?.toString() ?? ''}
                    prop="llum_A"
                    disabled={pacient.cateter === "No"}
                    onValueChanged={handleChange}
                    onSubmit={onSubmitChange}
                  />
                </div>
                <div className="w-full md:w-1/4 px-2">
                  <InputText
                    label="Llum V"
                    value={pacient.llum_V?.toString() ?? ''}
                    prop="llum_V"
                    disabled={pacient.cateter === "No"}
                    onValueChanged={handleChange}
                    onSubmit={onSubmitChange}
                  />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/1 px-2">
                  <TextAreaInput
                    label="Comentaris"
                    value={pacient.cateter_comentaris?.toString() ?? ''}
                    prop="cateter_comentaris"
                    disabled={pacient.cateter === "No"}
                    onValueChanged={handleChange}
                    onSubmit={onSubmitChange}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      <br/>

      {/* Incidències del pacient */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="space-y-2">
      <h1 className="text-lg font-semibold text-gray-800">Incidències</h1>
      {/* Formulari per registrar una incidència nova */}
      <form className="flex flex-wrap items-center mb-6 gap-2" onSubmit={handleCrearIncidencia}>
        <div className="w-full md:w-1/4 px-2">
          <SelectInput
            label="Tipus"
            value={novaIncidencia.tipus}
            prop="tipus"
            onValueChanged={handleNovaIncidenciaChange}
            options={opcionsIncidenciaTipus}
            required={true}
          />
        </div>
        <div className="w-full md:w-2/4 px-2">
          <InputText
            label="Descripció"
            value={novaIncidencia.descripcio}
            prop="descripcio"
            onValueChanged={handleNovaIncidenciaChange}
          />
        </div>
        <div className="w-full md:w-1/6 px-2 mt-3">
          <button type="submit" className="bg-[#0097A7] text-white px-4 py-2 rounded hover:bg-[#2cc0d0] disabled:opacity-50" disabled={loadingIncidencia}>
            {loadingIncidencia ? 'Guardant...' : 'Afegir'}
          </button>
        </div>
        {errorIncidencia && <div className="w-full text-red-600 px-2">{errorIncidencia}</div>}
      </form>

        {incidencies.length > 0 &&
         
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/1 px-2">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data i hora</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipus</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incidència</th>
                      </tr>
                    </thead>      
                    <tbody className="bg-white divide-y divide-gray-200">
                    {incidencies.map((incidencia, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {format(new Date(incidencia.data), 'dd/MM/yyyy HH:mm', { locale: ca })}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{incidencia.tipus}</td> 
                            <td className="px-6 py-4 text-sm text-gray-500">{incidencia.descripcio}</td> 
                          </tr>
                      ))}
                    </tbody>
                  </table>
                </div>   
            </div>
       
          }
         </div>
      </div>
    </div>
  );
};

export default VenosTab;