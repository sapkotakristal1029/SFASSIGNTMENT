import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class localStorageService {
  getCurrentUser(): any {
    const userData = localStorage.getItem('currentUser');
    console.log('userData:', userData);
    return userData ? JSON.parse(userData) : null;
  }
}
