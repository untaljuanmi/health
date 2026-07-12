import { DocumentData } from '@angular/fire/firestore';

export enum HealthEventTypeEnum {
  Pain = 'pain',
  Drug = 'drug',
}

export enum HealthEventPainTypeEnum {
  Headache = 'headache',
  Nausea = 'nausea',
  Vomiting = 'vomiting',
  Diarrhea = 'diarrhea',
}

export interface HealthEventDrugInterface {
  drug: string;
  quantity: number;
}

export interface HealthEventInterface {
  id?: string | null;
  type?: HealthEventTypeEnum | null;
  description?: string | null;
  painType?: HealthEventPainTypeEnum | null;
  painLevel?: number | null;
  drugs?: HealthEventDrugInterface[] | null;
  notes?: string[] | null;
  from?: Date | null;
  to?: Date | null;
  date?: Date | null;
  created?: Date | null;
  updated?: Date | null;
}

export class HealthEvent implements HealthEventInterface {
  id?: string | null;
  type?: HealthEventTypeEnum | null;
  description?: string | null;
  painType?: HealthEventPainTypeEnum | null;
  painLevel?: number | null;
  drugs?: HealthEventDrugInterface[] | null;
  notes?: string[] | null;
  from?: Date | null;
  to?: Date | null;
  date?: Date | null;
  created?: Date | null;
  updated?: Date | null;

  constructor(healthEvent?: HealthEventInterface) {
    this.id = healthEvent?.id;
    this.type = healthEvent?.type;
    this.description = healthEvent?.description;
    this.painType = healthEvent?.painType;
    this.painLevel = healthEvent?.painLevel;
    this.drugs = healthEvent?.drugs;
    this.notes = healthEvent?.notes;
    this.from = healthEvent?.from;
    this.to = healthEvent?.to;
    this.date = healthEvent?.date;
    this.created = healthEvent?.created;
    this.updated = healthEvent?.updated;
  }

  static buildFromDocumentData(document: DocumentData): HealthEvent {
    return new HealthEvent(document);
  }

  static buildFromDocumentsData(data: DocumentData[]): HealthEvent[] {
    return data?.map((document: DocumentData) => this.buildFromDocumentData(document)) ?? [];
  }
}
