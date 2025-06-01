import { DadaPacient, Option } from "../../../types/supabase";
import InputText from "../../common/TextInput";
import SelectInput from "../../common/SelectInput";
import DateInput from "../../common/DateInput";
import TextInput from "../../common/TextInput";
import { formatDate } from "../../common/Utils";
import TextAreaInput from "../../common/TextAreaInput";

type DialisiTabProps = {
  pacient: DadaPacient;
  anticoagulants: Option[];
  dialitzadors: Option[];
  concsAcid: Option[];
  concsBic: Option[];
  onPacientChange?: (updatedPacient: DadaPacient) => void;
  onSubmitChange?: () => void;
};

const DialisiTab = ({ 
  pacient, 
  anticoagulants, 
  dialitzadors, 
  concsAcid, 
  concsBic, 
  onPacientChange, 
  onSubmitChange 
}: DialisiTabProps) => {
  const opcionsSN = [{ id: "Sí", nom: "Sí" }, { id: "No", nom: "No" }];
  const opcionsUbicacio = [
    {id: "Sala 1", nom: "Sala 1"}, 
    {id: "Sala 2", nom: "Sala 2"}, 
    {id: "Sala 3", nom: "Sala 3"}, 
    {id: "Sala 4", nom: "Sala 4"}, 
    {id: "Sala 5", nom: "Sala 5"},
    {id: "Hosp. Olot", nom: "Hosp. Olot"}
  ];
  const opcionsProgramacio = [
    { id: "Dl, Dx, Dv (Matí)", nom: "Dl, Dx, Dv (Matí)" }, 
    { id: "Dl, Dx, Dv (Mig Matí)", nom: "Dl, Dx, Dv (Mig Matí)" }, 
    { id: "Dl, Dx, Dv (Mitja Tarda)", nom: "Dl, Dx, Dv (Mitja Tarda)" }, 
    { id: "Dl, Dx, Dv (Tarda)", nom: "Dl, Dx, Dv (Tarda)" },
    { id: "Dm, Dj, Ds (Matí)", nom: "Dm, Dj, Ds (Matí)" },
    { id: "Dm, Dj, Ds (Mig Matí)", nom: "Dm, Dj, Ds (Mig Matí)" }, 
    { id: "Dm, Dj, Ds (Mitja Tarda)", nom: "Dm, Dj, Ds (Mitja Tarda)" }, 
    { id: "Dm, Dj, Ds (Tarda)", nom: "Dm, Dj, Ds (Tarda)" }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    if (onPacientChange) {
      onPacientChange({
        ...pacient,
        [e.target.name]: e.target.value || null
      });
    }
  };

  return (
    <div className="p-4 rounded-lg bg-gray-50 md:my-6" role="tabpanel" aria-labelledby="profile-tab">
      {/* Informació de dialisi */}
      <h3 className="w-full text-lg font-semibold text-gray-800 mb-2">Dades de Diàlisi</h3>
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="space-y-2">
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
              <SelectInput
                  label="Ubicació" 
                  value={pacient.ubicacio}
                  prop="ubicacio"
                  options={opcionsUbicacio}
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
          <h3 className="w-full text-lg font-semibold text-gray-800 mb-2">Pauta</h3>
           <div className="flex flex-wrap -mx-3 mb-4">
            
            <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
              <SelectInput
                label="Dialitzador"
                value={pacient.dialitzador?.toString() ?? ''}
                prop="dialitzador"
                options={dialitzadors}
                onValueChanged={handleChange}
                onSubmit={onSubmitChange}
              />
            </div>

            <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
              <SelectInput
                label="Concentració Acid"
                value={pacient.conc_acid?.toString() ?? ''}
                prop="conc_acid"
                options={concsAcid}
                onValueChanged={handleChange}
                onSubmit={onSubmitChange}
              />
            </div>

            <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
              <SelectInput
                label="Concentració Bicarbonat"
                value={pacient.conc_bic?.toString() ?? ''}
                prop="conc_bic"
                options={concsBic}
                onValueChanged={handleChange}
                onSubmit={onSubmitChange}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-4">
            
            <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
              <SelectInput
                label="Anticoagulant"
                value={pacient.anticoagulant?.toString() ?? ''}
                prop="anticoagulant"
                options={anticoagulants}
                onValueChanged={handleChange}
                onSubmit={onSubmitChange}
              />
            </div>
            <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
              <TextInput
                label="Heparina Sòdica (%)"
                value={pacient.heparina_sodica ?? ''}
                prop="heparina_sodica"
                onValueChanged={handleChange}
                onSubmit={onSubmitChange}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-4">
            <div className="w-full md:w-1/1 px-2 mb-4 md:mb-0">
              <TextAreaInput
                label="Comentaris"
                value={pacient.comentaris_pauta}
                prop="comentaris_pauta"
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
                label="Pes sec pauta (kg)"
                value={pacient.pes_sec?.toString() ?? ''}
                prop="pes_sec"
                onValueChanged={handleChange}
                onSubmit={onSubmitChange}
              />
            </div>
              <div className="w-full md:w-1/4 px-2 mb-4 md:mb-0">
              <TextInput
                label="Pes sec real (kg)"
                value={pacient.pes_sec_tolerat?.toString() ?? ''}
                prop="pes_sec_tolerat"
                onValueChanged={handleChange}
                onSubmit={onSubmitChange}
              />
              {pacient.ultima_actualitzacio_pes_tolerat && <p className="text-sm text-gray-600">Darrera actualització: {formatDate(pacient.ultima_actualitzacio_pes_tolerat)}</p>}
            </div>
          </div>

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

          <h3 className="w-full text-lg font-semibold text-gray-800 mb-2">Paràmetres de sessió a considerar</h3>
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
          <div className="flex flex-wrap -mx-3 mb-4">
            <div className="w-full md:w-1/1 px-2 mb-4 md:mb-0"></div>
              <TextAreaInput
                label="Tara de roba"
                value={pacient.tara_roba?.toString() ?? ''}
                prop="tara_roba"
                onValueChanged={handleChange}
                onSubmit={onSubmitChange}
              />
            </div>
        </div>
      </div>
    </div>
  );
};

export default DialisiTab;