import { inject, Service } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  docData,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  Firestore,
  getDoc,
  query,
  QueryConstraint,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Service()
export abstract class FirestoreState<T extends { id?: string | null }> {
  private readonly _firestore = inject(Firestore);

  protected readonly _collectionName!: string;
  protected readonly _collection!: CollectionReference;

  protected constructor(collectionName: string) {
    this._collectionName = collectionName;
    this._collection = collection(this._firestore, collectionName);
  }

  set(id: string, payload: T): Promise<void> {
    return setDoc(doc(this._firestore, `${this._collectionName}/${id}`), payload);
  }

  add(payload: T): Promise<DocumentReference> {
    return addDoc(this._collection, payload);
  }

  getAll(filters?: QueryConstraint[]): Observable<DocumentData[]> {
    return collectionData(query(this._collection, ...(filters ?? [])), { idField: 'id' });
  }

  get(id: string): Observable<DocumentData> {
    const path = `${this._collectionName}/${id}`;
    return docData(doc(this._firestore, path), { idField: 'id' }) as Observable<DocumentData>;
  }

  getOnce(id: string): Promise<DocumentSnapshot> {
    return getDoc(doc(this._firestore, `${this._collectionName}/${id}`));
  }

  update(id: string, payload: T): Promise<void> {
    return updateDoc(doc(this._firestore, `${this._collectionName}/${id}`), payload);
  }

  delete(id: string): Promise<void> {
    return deleteDoc(doc(this._firestore, `${this._collectionName}/${id}`));
  }
}
