export type Pacient = {
  id: string;
  nom: string;
  cognoms: string;
  data_naixement: Date;
  poblacio: string;
  facultatiu_responsable: string;
  entitat: string;
  data_inici_HD: Date;
  programacio: string;
  ubicacio: string;
  llit: string;
  modalitat_hd: string;
  anticoagulant:string;
  dialitzador:string;
  conc_acid: string;
  conc_bic: string;
  qb:string;
  na: string;
  t_liquid: string;
  ocm: string;
};

export type DadaPacient = {
  id: number;
  cognoms: string;
  nom: string;
  data_naixement: string;
  poblacio: string;
  facultatiu_responsable: string;
  entitat: string;
  data_inici_HD: string;
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
  acces_vascular: string;
  agulles: string;
  hemostasia: string;
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
  anticoagulant_nom: string;
  dialitzador: number;
  dialitzador_nom: string;
  conc_acid: number;
  conc_acid_nom: string;
  conc_bic: number;
  conc_bic_nom: string;
  segellat_cvc: number;
  segellat_cvc_nom: string;
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

export type Database = {
  public: {
    Tables: {
      pacients: {
        Row: Pacient;
      };
    };
  };
};