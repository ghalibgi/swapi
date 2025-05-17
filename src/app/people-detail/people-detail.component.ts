import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-people-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './people-detail.component.html',
  styleUrls: ['./people-detail.component.css']
})
export class PeopleDetailComponent implements OnInit {
  person: any = null;
  homeworld: string = '';
  species: string = '';
  films: string[] = [];
  starships: string[] = [];
  vehicles: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      console.error('Aucun ID reçu dans la route.');
      return;
    }

    // Nettoyer l'id au cas où ce serait une URL complète, garder juste l'id numérique
    const id = this.extractIdFromParam(idParam);

    const url = `https://www.swapi.tech/api/people/${id}/`;

    this.http.get<any>(url).subscribe({
      next: data => {
        if (data?.result?.properties) {
          this.person = data.result.properties;

          // Planète d’origine
          if (this.person.homeworld) {
            this.http.get<any>(this.person.homeworld).subscribe(hw => {
              this.homeworld = hw?.result?.properties?.name || '';
            });
          }

          // Espèce
          if (this.person.species && this.person.species.length > 0) {
            this.http.get<any>(this.person.species[0]).subscribe(sp => {
              this.species = sp?.result?.properties?.name || '';
            });
          }

          // Films
          if (this.person.films && this.person.films.length > 0) {
            Promise.all(
              this.person.films.map((url: string) => this.http.get<any>(url).toPromise())
            ).then(results => {
              this.films = results
                .filter(r => r?.result?.properties?.title)
                .map(r => r.result.properties.title);
            });
          }

          // Starships
          if (this.person.starships && this.person.starships.length > 0) {
            Promise.all(
              this.person.starships.map((url: string) => this.http.get<any>(url).toPromise())
            ).then(results => {
              this.starships = results
                .filter(r => r?.result?.properties?.name)
                .map(r => r.result.properties.name);
            });
          }

          // Vehicles
          if (this.person.vehicles && this.person.vehicles.length > 0) {
            Promise.all(
              this.person.vehicles.map((url: string) => this.http.get<any>(url).toPromise())
            ).then(results => {
              this.vehicles = results
                .filter(r => r?.result?.properties?.name)
                .map(r => r.result.properties.name);
            });
          }
        } else {
          console.error('Données personnage manquantes ou incorrectes dans la réponse API');
        }
      },
      error: err => {
        console.error('Erreur lors de la récupération du personnage:', err);
      }
    });
  }

  // Extrait l'id numérique depuis un paramètre qui peut être une URL ou un simple id
  extractIdFromParam(param: string): string {
    if (param.startsWith('http')) {
      const parts = param.split('/');
      // gère un trailing slash éventuel
      return parts[parts.length - 1] === '' ? parts[parts.length - 2] : parts[parts.length - 1];
    }
    return param;
  }

  goBack(): void {
    this.router.navigate(['/people']);
  }
}
