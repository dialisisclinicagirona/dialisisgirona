import { useEffect, useState } from 'react';
import { supabase } from "../../../lib/supabaseClient";
import { format } from 'date-fns';
import { ca } from 'date-fns/locale';

interface CanviHistorial {
  id: number;
  pacient_id: number;
  usuari_id: string;
  columna: string;
  tipus_operacio: string;
  valor_anterior: string | null;
  valor_nou: string | null;
  data_hora: string;
  perfils?: {
    nom?: string;
  }
}

interface HistorialCanvisProps {
  pacientId: number;
  reset: number
}

const HistorialCanvis = ({ pacientId, reset }: HistorialCanvisProps) => {
  const [historial, setHistorial] = useState<CanviHistorial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Funció per retornar un nom més amigable de les columnes
  const formatColumnName = (columnName: string) => {
    const mapping: Record<string, string> = {
      nom: "Nom",
      cognoms: "Cognoms",
      facultatiu: "Facultatiu",
      hipertensio_arterial: "Hipertensió arterial",
      insuficiencia_cardiaca: "Insuficiència Cardíaca",
      mpoc: "Mal. Pul. Obstructiva Crònica",
      diabetis: "Diabetis Mellitus",
      altres_antecedents: "Altres antecedents",
      allergies: "Al·lèrgies",
      comentaris: "Comentaris",
      index_barthel: "Índex de Barthel",
      test_pfeiffer: "Test de Pfeiffer",
      data_naixement: "Data de naixement",
      poblacio: "Població",
      ic: "Insuficiència cardíaca",
      hta: "Hipertensió arterial",
      dm: "Diabetis Mellitus",
      alergies: "Al·lèrgies",
      na: "NA (mmol/L)",
    };
    
    return mapping[columnName] || columnName;
  };

  useEffect(() => {
    carregarHistorial();
  }, [reset]);

  // Carrega l'historial de canvis del pacient
  useEffect(() => {
    

    carregarHistorial();
  }, [pacientId]);

  const carregarHistorial = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('historial_canvis')
      .select(`
        *,
        perfils:usuari_id (nom)
      `)
      .eq('pacient_id', pacientId)
      .order('data_hora', { ascending: false });

    if (error) {
      console.error('Error al carregar l\'historial:', error);
    } else {
      console.log('Historial carregat:', data, pacientId);
      setHistorial(data || []);
    }
    setLoading(false);
  };

// Renderitza la taula d'historial de canvis
return (
  <div className="container mx-auto px-4 py-6">
    <h2 className="text-xl font-semibold mb-4">Historial de canvis</h2>
    
    {loading ? (
      <p>Carregant historial...</p>
    ) : historial.length === 0 ? (
      <p>No hi ha canvis registrats per aquest pacient.</p>
    ) : (
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data i hora</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuari</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Camp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operació</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor anterior</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor nou</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {historial.map((canvi) => (
              <tr key={canvi.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-500">
                  {format(new Date(canvi.data_hora), 'dd/MM/yyyy HH:mm', { locale: ca })}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {canvi.perfils?.nom || canvi.usuari_id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {formatColumnName(canvi.columna)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {canvi.tipus_operacio === 'INSERT' ? 'Creació' : 
                   canvi.tipus_operacio === 'UPDATE' ? 'Modificació' : 
                   canvi.tipus_operacio === 'DELETE' ? 'Eliminació' : 
                   canvi.tipus_operacio}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {canvi.valor_anterior || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {canvi.valor_nou || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);
};

export default HistorialCanvis;