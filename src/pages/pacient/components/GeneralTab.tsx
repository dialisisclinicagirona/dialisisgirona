import { DadaPacient, Option } from "../../../types/supabase";
import InputText from "../../common/TextInput";
import SelectInput from "../../common/SelectInput";
import DateInput from "../../common/DateInput";
import TextAreaInput from "../../common/TextAreaInput";

type GeneralTabProps = {
  pacient: DadaPacient;
  enitatsAsseguranca: Option[];
  onPacientChange?: (updatedPacient: DadaPacient) => void;
  onSubmitChange?: () => void;
};

const GeneralTab = ({ pacient, enitatsAsseguranca, onPacientChange, onSubmitChange }: GeneralTabProps) => {
  const opcionsSN = [{ id: "Sí", nom: "Sí" }, { id: "No", nom: "No" }];
  const opcionsDiabetis = [{id: "Tipus I", nom: "Tipus I"}, {id: "Tipus II", nom: "Tipus II"}];
  const opcionsBarthel = [{id: "100", nom: "Independent (100)"}, {id: "60-90", nom: "Dependència moderada (60-90)"}, {id: "<60", nom: "Dependència greu (< 60)"}];
  const opcionsPfeiffer = [{id: "0-2", nom: "Normal (0-2)"}, {id: "3-4", nom: "Deteriorament lleu (3-4)"}, {id: "5-7", nom: "Moderat (5-7)"}, {id: "8-10", nom: "Greu (8-10)"}];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    if (onPacientChange) {
      onPacientChange({
        ...pacient,
        [e.target.name]: e.target.value || null
      });
    }
  };

  return (
    <div className="p-4 rounded-lg bg-gray-50" role="tabpanel" aria-labelledby="profile-tab">
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
                label="M.P.O.C."
                value={pacient.mpoc}
                prop="mpoc"
                options={opcionsSN}
                onValueChanged={handleChange}
                onSubmit={onSubmitChange}
                />
            </div>
            <div className="w-full md:w-1/4 px-2">
              <SelectInput
                selectText="No"
                label="Diabetis Mellitus"
                value={pacient.dm}
                prop="dm"
                options={opcionsDiabetis}
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
              <div className="w-full md:w-1/4 px-2 mb-4 md:mb-0">
              <InputText 
                label="CIP"
                value={pacient.cip ?? ''}
                prop="cip"
                onValueChanged={handleChange}
                onSubmit={onSubmitChange} 
              />
            </div>
            <div className="w-full md:w-1/6 px-2 mb-4 md:mb-0">
              <SelectInput
                label="Entitat Asseguarança"
                value={pacient.entitat?.toString() ?? ''}
                prop="entitat"
                options={enitatsAsseguranca}
                onValueChanged={handleChange}
                onSubmit={onSubmitChange}
              />
            </div>
            <div className="w-full md:w-1/4 px-2 mb-4 md:mb-0">
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
  );
};

export default GeneralTab;