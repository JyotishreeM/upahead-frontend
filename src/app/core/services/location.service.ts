
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface State {
  stateId: number;
  stateName: string;
}

export interface City {
  cityId: number;
  cityName: string;
  stateId: number;
}
@Injectable({
  providedIn: 'root'
})
export class LocationService {
 private http = inject(HttpClient);

  private readonly API_URL =
    `${environment.apiUrl}/api/locations`;

  getStates(): Observable<State[]> {
    return this.http.get<State[]>(
      `${this.API_URL}/states`
    );
  }

  getCities(stateId: number): Observable<City[]> {
    return this.http.get<City[]>(
      `${this.API_URL}/states/${stateId}/cities`
    );
  }
}
