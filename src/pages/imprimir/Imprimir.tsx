import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from "../../lib/supabaseClient";
import './ImprimirPacient.css';
import { Pacient } from '../../types/supabase';

const ImprimirPacient = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [pacient, setPacient] = useState<Pacient | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const carregarPacient = async () => {
        if (!id) return;
  
        try {
          setLoading(true);
          const { data, error } = await supabase
            .from('pacients')
            .select('*')
            .eq('id', id)
            .single();
  
          if (error) {
            throw error;
          }
  
          if (data) {
            setPacient(data as Pacient);
          } else {
            setError('No s\'ha trobat el pacient');
          }
        } catch (err) {
          console.error('Error carregant el pacient:', err);
          setError('Error carregant les dades del pacient');
        } finally {
          setLoading(false);
        }
      };
  
      carregarPacient();
    }, [id]);
  
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
  
    const handleTornar = () => {
      navigate(-1); // Torna a la pàgina anterior
    };
  
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
          <button onClick={handleTornar} className="btn-tornar">
            Tornar
          </button>
          <button onClick={() => window.print()} className="btn-print">
            Imprimir
          </button>
        </div>
  
        <div className="pagina-impressio">
          <div className="capcalera">
            <h1>Fitxa de Pacient</h1>
            <div className="info-hospital">Hospital Comarcal de la Selva</div>
            <div className="data-impressio">Data d'impressió: {new Date().toLocaleDateString('ca-ES')}</div>
          </div>
  
          <section className="seccio-dades">
            <h2>Dades Personals</h2>
            <div className="grid-2">
              <div className="camp">
                <span className="etiqueta">Nom:</span>
                <span className="valor">{pacient.nom || '-'}</span>
              </div>
              <div className="camp">
                <span className="etiqueta">Cognoms:</span>
                <span className="valor">{pacient.cognoms || '-'}</span>
              </div>
              <div className="camp">
                <span className="etiqueta">Facultatiu:</span>
                <span className="valor">{pacient.facultatiu_responsable || '-'}</span>
              </div>
              <div className="camp">
                <span className="etiqueta">Data de naixement:</span>
                <span className="valor">{formatData(pacient.data_naixement?.toString() || null)}</span>
              </div>
              <div className="camp">
                <span className="etiqueta">Població:</span>
                <span className="valor">{pacient.poblacio || '-'}</span>
              </div>
            </div>
          </section>
  
          <section className="seccio-dades">
            <h2>Antecedents Patològics</h2>
            <div className="grid-4">
              <div className="camp">
                <span className="etiqueta">Hipertensió arterial:</span>
                <span className="valor">{pacient.hta || 'No'}</span>
              </div>
              <div className="camp">
                <span className="etiqueta">Insuficiència Cardíaca:</span>
                <span className="valor">{pacient.ic || 'No'}</span>
              </div>
              <div className="camp">
                <span className="etiqueta">M.P.O.C.:</span>
                <span className="valor">{pacient.mpoc || 'No'}</span>
              </div>
              <div className="camp">
                <span className="etiqueta">Diabetis Mellitus:</span>
                <span className="valor">{pacient.dm || 'No'}</span>
              </div>
            </div>
            <div className="camp full-width">
              <span className="etiqueta">Altres antecedents:</span>
              <span className="valor multi-linia">{pacient.altres_antecedents || '-'}</span>
            </div>
          </section>
  
          <section className="seccio-dades">
            <h2>Al·lèrgies i Comentaris</h2>
            <div className="grid-2">
              <div className="camp">
                <span className="etiqueta">Al·lèrgies:</span>
                <span className="valor multi-linia">{pacient.alergies || '-'}</span>
              </div>
              <div className="camp">
                <span className="etiqueta">Comentaris:</span>
                <span className="valor multi-linia">{pacient.comentaris || '-'}</span>
              </div>
            </div>
          </section>
  
          <section className="seccio-dades">
            <h2>Escales Clíniques</h2>
            <div className="grid-2">
              <div className="camp">
                <span className="etiqueta">Índex de Barthel:</span>
                <span className="valor">{pacient.barthel || '-'}</span>
              </div>
              <div className="camp">
                <span className="etiqueta">Test de Pfeiffer:</span>
                <span className="valor">{pacient.pfeiffer || '-'}</span>
              </div>
            </div>
          </section>
  
          {/* Afegeix més seccions segons els teus camps de pacients */}
          
          <div className="peu-pagina">
            <div className="numero-pagina">Pàgina 1 de 1</div>
            <div className="confidencial">Document confidencial - Ús mèdic</div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ImprimirPacient;