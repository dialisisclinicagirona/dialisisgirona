import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { DadaPacient, Option } from "../../../types/supabase";
import HistorialCanvis from "./Historial";
import GeneralTab from "./GeneralTab";
import DialisiTab from "./DialisiTab";
import VenosTab from "./VenosTab";

type Pacient = DadaPacient;
type FormProps = {
    pacient: Pacient;
    reset: number;
    onPacientChange?: (updatedPacient: Pacient) => void;
    onSubmitChange?: () => void;
};

const PacientForm = ({pacient, reset, onPacientChange, onSubmitChange}: FormProps) => {
    const [tab, setTab] = useState("form-general");
    const [enitatsAsseguranca, setEnitatsAsseguranca] = useState<Option[]>([]);
    const [anticoagulants, setAnticoagulants] = useState<Option[]>([]);
    const [dialitzadors, setDialitzadors] = useState<Option[]>([]);
    const [concsAcid, setConcsAcid] = useState<Option[]>([]);
    const [concsBic, setConcsBic] = useState<Option[]>([]);
    const [favTecniques, setFavTecniques] = useState<Option[]>([]);
   
    useEffect(() => {
      const fetchData = async () => {
        const e = await fetchEnitatsAsseguranca();
        const a = await fetchAnticoagulants();
        const d = await fetchDialitzadors();
        const ca = await fetchConcentracionsAcid();
        const cb = await fetchConcentracionsBicarbonat();
        const sc = await fetchFavTecniques();
        setEnitatsAsseguranca(e);
        setAnticoagulants(a);
        setDialitzadors(d);
        setConcsAcid(ca);
        setConcsBic(cb);
        setFavTecniques(sc);
      };

      fetchData();
    }, []);

    const fetchEnitatsAsseguranca = async (): Promise<Option[]> => {
      const { data, error } = await supabase
        .from('entitat_asseg')
        .select('*');

      if (error) {
        console.error("Error obtenint enitats asseguranca:", error.message);
        return [];
      }

      console.info("entitats", data);
    
      return data;
    };

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

    const fetchFavTecniques = async (): Promise<Option[]> => {
      const { data, error } = await supabase
        .from('fistula_tecnica')
        .select('*');
      //console.log("Segellats", data);
      if (error) {
        console.error("Error obtenint tècniques de FAV:", error.message);
        return [];
      }
    
      return data;
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
              <li>
                <button 
                  type="button" 
                  className={`inline-block p-4 rounded-t-lg ${tab === "form-historial" ? "text-blue-600 bg-gray-50 border-b-2 border-blue-600 active" : "hover:text-gray-600 hover:bg-gray-50"}`}
                  onClick={() => setTab("form-historial")}
                >
                  Historial de canvis
                </button>
              </li>
            </ul>
          </div>
          
          <div id="form-general" className={`${tab !== "form-general"? "hidden ": ""}`}>
            {tab === "form-general" && (
              <GeneralTab 
                pacient={pacient} 
                enitatsAsseguranca={enitatsAsseguranca} 
                onPacientChange={onPacientChange} 
                onSubmitChange={onSubmitChange} 
              />
            )}
          </div>
          
          <div id="form-dialisi" className={`${tab !== "form-dialisi"? "hidden ": ""}`}>
            {tab === "form-dialisi" && (
              <DialisiTab 
                pacient={pacient} 
                anticoagulants={anticoagulants} 
                dialitzadors={dialitzadors} 
                concsAcid={concsAcid} 
                concsBic={concsBic} 
                onPacientChange={onPacientChange} 
                onSubmitChange={onSubmitChange} 
              />
            )}
          </div>

          <div id="form-venos" className={`${tab !== "form-venos"? "hidden ": ""}`}>
            {tab === "form-venos" && (
              <VenosTab 
                pacient={pacient} 
                favTecniques={favTecniques} 
                onPacientChange={onPacientChange} 
                onSubmitChange={onSubmitChange} 
              />
            )}
          </div>

          <div id="form-historial" className={`${tab !== "form-historial"? "hidden ":""} md:my-6`} role="tabpanel" aria-labelledby="profile-tab">
              <HistorialCanvis pacientId={pacient.id} reset={reset} />
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