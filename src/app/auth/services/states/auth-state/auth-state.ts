import { inject, Service, signal } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirebaseError } from 'firebase/app';
import { User } from 'firebase/auth';
import { Observable } from 'rxjs';

import { AppState } from '../../../../core';
import { MyToastState } from '../../../../library';
import { UserProfileInterface } from '../../../models';

@Service()
export class AuthState {
  private readonly _auth = inject(Auth);
  private readonly _router = inject(Router);

  private readonly _appState = inject(AppState);

  private readonly _myToastState = inject(MyToastState);

  private _isLoading = signal<boolean>(false);
  private _isLoadingProfile = signal<boolean>(false);

  isLoading = this._isLoading.asReadonly();
  isLoadingProfile = this._isLoadingProfile.asReadonly();

  constructor() {
    this.listenAuthStateReady();
  }

  get authState$(): Observable<User | null> {
    return authState(this._auth);
  }

  signIn(email: string, password: string): void {
    if (!email || !password) return;

    this._isLoading.set(true);

    signInWithEmailAndPassword(this._auth, email, password)
      .then(() => this._router.navigate(['/home']))
      .catch((error: FirebaseError) => this.manageError(error))
      .finally(() => this._isLoading.set(false));
  }

  signUp(displayName: string, email: string, password: string): void {
    if (!email || !password) return;

    this._isLoading.set(true);

    createUserWithEmailAndPassword(this._auth, email, password)
      .then(() => this.updateUserProfile({ displayName }))
      .then(() => this._router.navigate(['/home']))
      .catch((error: FirebaseError) => this.manageError(error))
      .finally(() => this._isLoading.set(false));
  }

  signOut(): void {
    this._isLoading.set(true);

    signOut(this._auth)
      .then(() => this._router.navigate(['/auth/sign-in']))
      .catch((error: FirebaseError) => this.manageError(error))
      .finally(() => this._isLoading.set(false));
  }

  private updateUserProfile(profile: UserProfileInterface): void {
    const _user = this._auth.currentUser;

    if (!_user) {
      return;
    }

    this._isLoadingProfile.set(true);

    updateProfile(_user, profile)
      .catch((error: FirebaseError) => this.manageError(error))
      .finally(() => this._isLoadingProfile.set(false));
  }

  private manageError(error: FirebaseError): void {
    this._myToastState.error(`auth.errors.${error.code}`, 5000);
  }

  private listenAuthStateReady(): void {
    this._appState.isAppReady.set(false);

    this._auth.onAuthStateChanged((user: User | null): void => {
      this._appState.initState(user);
    });
  }
}
