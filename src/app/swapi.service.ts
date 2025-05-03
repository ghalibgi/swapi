import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SwapiService {
  httpClient = inject(HttpClient)

  private baseUrl = 'https://swapi.dev/api';

  constructor(private http: HttpClient) {}

  getPeople(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/people/`).pipe(
      map(res => res.results) // comme avec "drinks" dans le cocktailAPI
    );
  }
  getFilms(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/films/`).pipe(
      map(res => res.results));
  }
  getPlanets(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/planets/`).pipe(
      map(res => res.results));
  }
  getSpecies(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/species/`).pipe(
      map(res => res.results));

  }getStarships(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/starships/`).pipe(
      map(res => res.results));

  }getVehicles(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/vehicles/`).pipe(
      map(res => res.results));
  }

}
