import { DocumentData } from '@angular/fire/firestore';

export enum DrugMeasureEnum {
  Milligrams = 'milligrams',
  Milliliters = 'milliliters',
}

export interface DrugInterface {
  id?: string | null;
  name?: string | null;
  description?: string | null;
  measure?: DrugMeasureEnum[] | null;
  quantity?: number | null;
  notes?: string[] | null;
}

export class Drug implements DrugInterface {
  id?: string | null;
  name?: string | null;
  description?: string | null;
  measure?: DrugMeasureEnum[] | null;
  quantity?: number | null;
  notes?: string[] | null;

  constructor(drug?: DrugInterface) {
    this.id = drug?.id;
    this.name = drug?.name;
    this.description = drug?.description;
    this.measure = drug?.measure;
    this.quantity = drug?.quantity;
    this.notes = drug?.notes;
  }

  static buildFromDocumentData(document: DocumentData): Drug {
    return new Drug(document);
  }

  static buildFromDocumentsData(data: DocumentData[]): Drug[] {
    return data?.map((document: DocumentData) => this.buildFromDocumentData(document)) ?? [];
  }
}
