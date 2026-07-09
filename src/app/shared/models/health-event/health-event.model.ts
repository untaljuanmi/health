import { DocumentData } from '@angular/fire/firestore';

import { DrugInterface } from '../drug/drug.model';

export enum HealthEventPainTypeEnum {
  Headache = 'headache',
  Stomachache = 'stomachache',
  Nausea = 'nausea',
  Vomiting = 'vomiting',
  Diarrhea = 'diarrhea',
}

export interface HealthEventInterface {
  id?: string | null;
  title?: string | null;
  description?: string | null;
  painType?: HealthEventPainTypeEnum[] | null;
  painLevel?: number | null;
  drugs?: DrugInterface[] | null;
  notes?: string[] | null;
  from?: Date | null;
  to?: Date | null;
}

export class HealthEvent implements HealthEventInterface {
  id?: string | null;
  title?: string | null;
  description?: string | null;
  painType?: HealthEventPainTypeEnum[] | null;
  painLevel?: number | null;
  drugs?: DrugInterface[] | null;
  notes?: string[] | null;
  from?: Date | null;
  to?: Date | null;

  constructor(healthEvent?: HealthEventInterface) {
    this.id = healthEvent?.id;
    this.title = healthEvent?.title;
    this.description = healthEvent?.description;
    this.painType = healthEvent?.painType;
    this.painLevel = healthEvent?.painLevel;
    this.drugs = healthEvent?.drugs;
    this.notes = healthEvent?.notes;
    this.from = healthEvent?.from;
    this.to = healthEvent?.to;
  }

  static buildFromDocumentData(document: DocumentData): HealthEvent {
    return new HealthEvent(document);
  }

  static buildFromDocumentsData(data: DocumentData[]): HealthEvent[] {
    return data?.map((document: DocumentData) => this.buildFromDocumentData(document)) ?? [];
  }
}
