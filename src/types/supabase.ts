export type Pacient = {
  id: string;
  nom: string;
  cognom: string;
  data_naixement: string;
  poblacio: string;
  facultatiu_responsable: string;
  entitat: string;
  data_inici_hd: string;
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

export type Database = {
  public: {
    Tables: {
      pacients: {
        Row: Pacient;
      };
    };
  };
};