import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from "../../lib/supabaseClient";
import './ImprimirPacient.css';
import { DadaPacient } from '../../types/supabase';

const ImprimirPacient = () => {
    const { id } = useParams<{ id: string }>();
    const [pacient, setPacient] = useState<DadaPacient | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const carregarPacient = async () => {
        if (!id) return;
  
        try {
          fetchPacientDetails(parseInt(id));
        } catch (err) {
          console.error('Error carregant el pacient:', err);
          setError('Error carregant les dades del pacient');
        } finally {
          setLoading(false);
        }
      };
  
      carregarPacient();
    }, [id]);

    const fetchPacientDetails = async (id: number) => {
      const { data, error } = await supabase
        .rpc('get_dades_pacient', { pacient_id: id });
    
      if (!error && data && data.length > 0) {
        console.log("Dades del pacient:", data);
        setPacient(data[0]);
      } else {
        console.error("Error obtenint les dades del pacient:", error);
      }
    };
  
    useEffect(() => {
      // Imprimeix automàticament quan les dades estiguin carregades
      if (!loading && pacient && !error) {
        // Petit retard per assegurar que el DOM s'ha renderitzat completament
        const timer = setTimeout(() => {
          window.print();
        }, 500);
        return () => clearTimeout(timer);
      }
    }, [loading, pacient, error]);
  
   
  
    if (loading) return <div className="carregant">Carregant dades del pacient...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!pacient) return <div className="error">No s'ha trobat el pacient</div>;
  
    const formatData = (data: string | null): string => {
      if (!data) return '-';
      try {
        const d = new Date(data);
        return d.toLocaleDateString('ca-ES');
      } catch (e) {
        return data;
      }
    };
  
    return (
      <div className="imprimir-pacient">
        <div className="no-print controls">
         
          <button onClick={() => window.print()} className="btn-print">
            Imprimir
          </button>
        </div>
  
        <div className="pagina-impressio">
          <div className="capcalera">
            <h2>{`${pacient.nom} ${pacient.cognoms}`}</h2>
            <div className="data-impressio">Data d'impressió: {new Date().toLocaleDateString('ca-ES')}</div>
          </div>
  
          <section className="seccio-dades">
            <h3>General</h3>
            <div className="grid-3">
              <div className="camp">
                <span className="etiqueta-inline">Facultatiu:</span>
                <span className="valor">{pacient.facultatiu_responsable || '-'}</span>
              </div>
              <div className="camp">
                <span className="etiqueta-inline">Data de naixement:</span>
                <span className="valor">{formatData(pacient.data_naixement?.toString() || null)}</span>
              </div>
              <div className="camp">
                <span className="etiqueta-inline">Població:</span>
                <span className="valor">{pacient.poblacio || '-'}</span>
              </div>
            </div>
          </section>
  
          <section className="seccio-dades">
            <h3>Antecedents patològics</h3>
            <div className="grid-4">
              <div className="camp">
                <span className="etiqueta-inline">Hipertensió arterial:</span>
                <span className="valor">{pacient.hta || 'No'}</span>
              </div>
              <div className="camp">
                <span className="etiqueta-inline">Insuficiència Cardíaca:</span>
                <span className="valor">{pacient.ic || 'No'}</span>
              </div>
              <div className="camp">
                <span className="etiqueta-inline">M.P.O.C.:</span>
                <span className="valor">{pacient.mpoc || 'No'}</span>
              </div>
              <div className="camp">
                <span className="etiqueta-inline">Diabetis Mellitus:</span>
                <span className="valor">{pacient.dm || 'No'}</span>
              </div>
            </div>
            <div className="camp full-width">
              <span className="etiqueta">Altres antecedents:</span>
              <span className="valor multi-linia">{pacient.altres_antecedents || '-'}</span>
            </div>
            <h3>Al·lergies / Comentaris</h3>
              <div className="camp">
                <span className="etiqueta">Al·lèrgies:</span>
                <span className="valor multi-linia">{pacient.alergies || '-'}</span>
              </div>
              <div className="camp">
                <span className="etiqueta">Comentaris:</span>
                <span className="valor multi-linia">{pacient.comentaris || '-'}</span>
              </div>
            <div className="grid-4">
              <h3>Escales clíniques</h3>
              <div className="camp">
                <span className="etiqueta-inline">Índex de Barthel:</span>
                <span className="valor">{pacient.barthel || '-'}</span>
              </div>
              <div className="camp">
                <span className="etiqueta-inline">Test de Pfeiffer:</span>
                <span className="valor">{pacient.pfeiffer || '-'}</span>
              </div>
            </div>
          </section>

          <section className="seccio-dades">
            <h3>Diàlisi</h3>
            <div className="grid-3">
              <div className="camp">
                <span className="etiqueta-inline">Data inici:</span>
                <span className="valor">{formatData(pacient.data_inici_HD?.toString() || null)}</span>
              </div>
              <div className="camp">
                <span className="etiqueta-inline">Programació:</span>
                <span className="valor">{pacient.programacio || '-'}</span>
              </div>
              <div className="camp">
                <span className="etiqueta-inline">Ubicació:</span>
                <span className="valor">{pacient.ubicacio || '-'}</span>
              </div>
              <div className="camp">
                <span className="etiqueta-inline">Llit:</span>
                <span className="valor">{pacient.llit || '-'}</span>
              </div>
              <div className="camp">
                <span className="etiqueta-inline">Temps:</span>
                <span className="valor">{pacient.temps_total || '-'}</span>
              </div>
              <div className="camp">
                <span className="etiqueta-inline">Pes sec:</span>
                <span className="valor">{pacient.pes_sec || '-'}</span>
              </div>
            </div>
            <div className="grid-3">
              <div className="camp">
                <span className="etiqueta-inline">Anticoagulant:</span>
                <span className="valor">{pacient.anticoagulant_nom || null}</span>
              </div>
              <div className="camp">
                <span className="etiqueta-inline">Dialitzador:</span>
                <span className="valor">{pacient.dialitzador_nom || '-'}</span>
              </div>
              <div className="camp">
                <span className="etiqueta-inline">Conc. àcid:</span>
                <span className="valor">{pacient.conc_acid_nom || '-'}</span>
              </div>
              <div className="camp">
                <span className="etiqueta-inline">Conc. bic:</span>
                <span className="valor">{pacient.conc_bic_nom || '-'}</span>
              </div>
            </div>
          </section>

          <section className="seccio-dades">
            <h3>Bany de Diàlisi</h3>
            <div className="grid-4">
              <div className="camp">
                <span className="etiqueta-inline">QB (ml/min):</span>
                <span className="valor">{pacient.qb || null}</span>
              </div>
              <div className="camp">
                <span className="etiqueta-inline">NA (mmol/L):</span>
                <span className="valor">{pacient.na || '-'}</span>
              </div>
              <div className="camp">
                <span className="etiqueta-inline">Tª Líquid (ºC):</span>
                <span className="valor">{pacient.t_liquid || '-'}</span>
              </div>
              <div className="camp">
                <span className="etiqueta-inline">OCM/KtV objectiu:</span>
                <span className="valor">{pacient.ocm || '-'}</span>
              </div>
            </div>
            <h3>UF</h3>
            <div className="grid-4">
              <div className="camp">
                <span className="etiqueta-inline">UF màx. Total (ml):</span>
                <span className="valor">{pacient.uf_total || null}</span>
              </div>
              <div className="camp">
                <span className="etiqueta-inline">UF màx. horària (ml/h):</span>
                <span className="valor">{pacient.uf_horaria || '-'}</span>
              </div>
              <div className="camp">
                <span className="etiqueta-inline">Tolerancia UF seca:</span>
                <span className="valor">{pacient.tolerancia_uf || '-'}</span>
              </div>
              <div className="camp">
                <span className="etiqueta-inline">Perfil UF:</span>
                <span className="valor">{pacient.perfil_uf || '-'}</span>
              </div>
            </div>
          </section>

          <section className="seccio-dades">
            <h3>Accés venòs</h3>
            <div className="grid-2">
              <div className="camp">
                <span className="etiqueta-inline">Agulles (A: / V:):</span>
                <span className="valor">{pacient.agulles || null}</span>
              </div>
              <div className="camp">
                <span className="etiqueta-inline">Accès Vascular:</span>
                <span className="valor">{pacient.acces_vascular || '-'}</span>
              </div>
              <div className="camp">
                <span className="etiqueta-inline">Segellat CVC:</span>
                <span className="valor">{pacient.segellat_cvc_nom || '-'}</span>
              </div>
              <div className="camp">
                <span className="etiqueta-inline">Hemostasia:</span>
                <span className="valor">{pacient.hemostasia || '-'}</span>
              </div>
            </div>
          </section>
  
          
        </div>
      </div>
    );
  };
  
  export default ImprimirPacient;