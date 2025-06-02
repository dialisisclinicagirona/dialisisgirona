import { DadaPacient, Option } from "../../../types/supabase";
import InputText from "../../common/TextInput";
import SelectInput from "../../common/SelectInput";
import TextAreaInput from "../../common/TextAreaInput";
import DateInput from "../../common/DateInput";

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
  //const opcionsFAVTecniques = [{id: "1", nom: "Buttonhole"}, {id: "2", nom: "Escala"}, {id: "3", nom: "Àrea"}, {id: "4", nom: "Gore"}];
  const opcionsAgulles = [{id: "Biselada", nom: "Biselada"}, {id: "Roma", nom: "Roma"}, {id: "Clampcath", nom: "Clampcath"}];
  const opcionsAgullesMides = [{id: "18", nom: "18"}, {id: "17", nom: "17"}, {id: "16", nom: "16"}, {id: "15", nom: "15"}];

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

      onPacientChange({
        ...pacientTemp,
        [e.target.name]: e.target.value || null
      });
    }
  };

  return (
    <div className="p-4 rounded-lg bg-gray-50 md:my-6" role="tabpanel" aria-labelledby="profile-tab">
      <h3 className="w-full text-lg font-semibold text-gray-800 mb-2">Accés venòs</h3>
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="space-y-2">
          <h3 className="w-full text-lg font-semibold text-gray-800 mb-2">Fístula Arteriovenosa (FAVI)</h3>
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
                disabled={pacient.fav === "No"}
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
                disabled={pacient.fav === "No"}
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
        </div>
      </div>
    </div>
  );
};

export default VenosTab;