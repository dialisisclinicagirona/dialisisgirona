export type Pacient = {
  id: number;
  cip: string;
  cognoms: string;
  nom: string;
  data_naixement?: Date;
  poblacio: string;
  facultatiu_responsable: string;
  entitat: number;
  data_inici_HD?: Date;
  programacio: string;
  ubicacio: string;
  llit: string;
  modalitat_HD: string;
  qb: string;
  na: string;
  t_liquid: string;
  ocm: string;
  uf_total: string;
  uf_horaria: string;
  tolerancia_uf: string;
  perfil_uf: string;
  temps_total: string;
  pes_sec: string;
  pes_sec_tolerat: string;
  flux_acces: string;
  recirculacio: string;
  propera_revisio?: string | null;
  agulles: string;
  hemostasia: string;
  hemostasia_temps:string;
  trans_flux_acces: string;
  trans_recirculacio: string;
  trans_propera_revisio?: Date | null;
  alergies: string;
  hta: string;
  ic: string;
  mpoc: string;
  dm: string;
  altres_antecedents: string;
  barthel: string;
  pfeiffer: string;
  comentaris: string;
  anticoagulant: number;
  heparina_sodica: string;
  comentaris_pauta: string;
  dialitzador: number;
  conc_acid: number;
  tara_roba: string;
  conc_bic: number;
  fav: string;
  fav_tecnica: string | null;
  fav_ecoguiada: string;
  fav_comentaris: string;
  agullaA: string;
  agullaV: string;
  agullaA_mida?: number | null;
  agullaV_mida?: number | null;
  ultima_actualitzacio_pes_tolerat?: Date;
  cateter: string;
  llum_A: string;
  llum_V: string;
  cateter_comentaris: string;

};



export type DadaPacient = {
  id: number;
  cip: string;
  cognoms: string;
  nom: string;
  data_naixement?: string;
  poblacio: string;
  facultatiu_responsable: string;
  entitat: number;
  data_inici_HD?: string;
  programacio: string;
  ubicacio: string;
  llit: string;
  modalitat_HD: string;
  qb: string;
  na: string;
  t_liquid: string;
  ocm: string;
  uf_total: string;
  uf_horaria: string;
  tolerancia_uf: string;
  perfil_uf: string;
  temps_total: string;
  pes_sec: string;
  pes_sec_tolerat: string;
  flux_acces: string;
  recirculacio: string;
  propera_revisio?: string
  agulles: string;
  hemostasia: string;
  hemostasia_temps:string;
  trans_flux_acces: string;
  trans_recirculacio: string;
  trans_propera_revisio?: string | null;
  alergies: string;
  hta: string;
  ic: string;
  mpoc: string;
  dm: string;
  altres_antecedents: string;
  barthel: string;
  pfeiffer: string;
  comentaris: string;
  anticoagulant?: number;
  heparina_sodica: string;
  comentaris_pauta: string;
  anticoagulant_nom: string;
  dialitzador?: number;
  dialitzador_nom: string;
  conc_acid?: number;
  conc_acid_nom: string;
  conc_bic?: number;
  conc_bic_nom: string;
  tara_roba: string;
  ultima_actualitzacio_pes_tolerat?: string;
  fav: string;
  fav_tecnica?: number | null;
  fav_ecoguiada: string;
  fav_comentaris: string;
  agullaA: string;
  agullaV: string;
  agullaA_mida?:  number | null;
  agullaV_mida?:  number | null;
  cateter: string;
  llum_A: string;
  llum_V: string;
  cateter_comentaris: string;
};

export type Option = {
  id: string;
  nom: string;
};

export type Anticoagulant = {
  id: number;
  nom: string;
};

export type Dialitzador = {
  id: number;
  nom: string;
};

export type ConcentracioAcid = {
  id: number;
  nom: string;
};

export type ConcentracioBicarbonat = {
  id: number;
  nom: string;
};

export type SegellatCVC = {
  id: number;
  nom: string;
};

export type Incidencia = {
  id: number;
  pacient_id: number;
  descripcio: string;
  data: Date;
  crated_at: Date;
}

export type Database = {
  public: {
    Tables: {
      pacients: {
        Row: Pacient;
      };
    };
  };
};