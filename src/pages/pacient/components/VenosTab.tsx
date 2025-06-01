import { DadaPacient, Option } from "../../../types/supabase";
import InputText from "../../common/TextInput";
import SelectInput from "../../common/SelectInput";
import TextInput from "../../common/TextInput";

type VenosTabProps = {
  pacient: DadaPacient;
  segellatsCVC: Option[];
  onPacientChange?: (updatedPacient: DadaPacient) => void;
  onSubmitChange?: () => void;
};

const VenosTab = ({
  pacient,
  segellatsCVC,
  onPacientChange,
  onSubmitChange
}: VenosTabProps) => {
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
  );
};

export default VenosTab;