import { Database } from "../../../types/supabase";

type Pacient = Database['public']['Tables']['pacients']['Row'];
type FormProps = {
    pacient: Pacient;
};

const PacientForm = ({pacient}: FormProps) => {
    return (
        <div className="mt-6">
          {/* Informació general del pacient */}
          <h3 className="w-full text-lg font-semibold text-gray-800 mb-2">General</h3>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="space-y-2">
              {/* Nom i cognoms */}
              <div className="flex flex-wrap -mx-3 mb-6">
                
                <div className="w-full md:w-1/2 px-3">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-nom">
                    Nom
                  </label>
                  <input className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                    id="grid-nom" 
                    type="text" 
                    value={pacient.nom}/>
                </div>
                <div className="w-full md:w-1/2 px-3">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-cognoms">
                    Cognoms
                  </label>
                  <input className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                    id="grid-cognoms" 
                    type="text" 
                    value={pacient.cognoms}/>
                </div>
              </div>

              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-naixement">
                    Data de naixement
                  </label>
                  <input className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                  id="grid-neixament" 
                  type="text" 
                  value={pacient.data_naixement} />
                </div>
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-poblacio">
                    Població
                  </label>
                  <input className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                  id="grid-poblacio" 
                  type="text" 
                  value={pacient.poblacio} />
                </div>
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-facultatiu">
                    Facultatiu
                  </label>
                  <input className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                  id="grid-facultatiu" 
                  type="text" 
                  value={pacient.facultatiu_responsable} />
                </div>

              </div>


            </div>
          </div>

          {/* Informació de dialisi */}
          <h3 className="w-full text-lg font-semibold text-gray-800 mb-2">Dialisi</h3>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="space-y-2">
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-inicihd">
                    Data inici HD
                  </label>
                  <input className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                    id="grid-inicihd" 
                    type="text" 
                    value={pacient.data_inici_HD}/>
                  </div>
                </div>
              </div>
            </div>
        </div>
    );
}

export default PacientForm;