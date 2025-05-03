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
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.http.get(`https://swapi.dev/api/people/${id}/`).subscribe((data: any) => {
        this.person = data;

        // Planète d’origine
        if (data.homeworld) {
          this.http.get<any>(data.homeworld).subscribe(world => {
            this.homeworld = world.name;
          });
        }

        // Espèce
        if (data.species?.length > 0) {
          this.http.get<any>(data.species[0]).subscribe(species => {
            this.species = species.name;
          });
        }

        // Films
        if (data.films?.length > 0) {
          Promise.all(data.films.map((url: string) =>
            this.http.get<any>(url).toPromise()
          )).then(results => {
            this.films = results.map(film => film.title);
          });
        }

        // Vaisseaux
        if (data.starships?.length > 0) {
          Promise.all(data.starships.map((url: string) =>
            this.http.get<any>(url).toPromise()
          )).then(results => {
            this.starships = results.map(s => s.name);
          });
        }

        // Véhicules
        if (data.vehicles?.length > 0) {
          Promise.all(data.vehicles.map((url: string) =>
            this.http.get<any>(url).toPromise()
          )).then(results => {
            this.vehicles = results.map(v => v.name);
          });
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/people']);
  }
}
