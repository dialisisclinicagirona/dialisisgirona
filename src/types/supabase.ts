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
  data_naixement: string; // o Date, segons com ho tractes
  poblacio: string;
  facultatiu_responsable: string;
  entitat: string;
  data_inici_HD: string;
  programacio: string;
  ubicacio: string;
  llit: number;
  modalitat_HD: string;
  
  conc_acid: string;
  conc_bic: string;
  qb: string;
  na: number;
  t_liquid: string;
  ocm: string;
  uf_total: string;
  uf_horaria: number;
  tolerancia_uf: string;
  perfil_uf: string;
  temps_total: string;
  pes_sec: number;
  acces_vascular: string;
  agulles: string;
  hemostasia: string;
  segellat_cvc: string;
  alergies: string;
  hta: string;
  ic: string;
  mpoc: string;
  dm: string;
  altres_antecedents: string;
  barthel: number;
  pfeiffer: number;
  comentaris: string;
  anticoagulant: number;
  anticoagulant_nom: string;
  dialitzador: number;
  dialitzador_nom: string;
};

export type Anticoagulant = {
  id: number;
  nom: string;
};

export type Dialitzador = {
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