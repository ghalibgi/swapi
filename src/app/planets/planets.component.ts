import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-planets',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './planets.component.html',
  styleUrls: ['./planets.component.css']
})
export class PlanetsComponent implements OnInit {
  allPlanets: any[] = [];
  displayedPlanets: any[] = [];
  searchQuery: string = '';
  showAll: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.allPlanets = [];
    this.fetchAllPlanetsPaginated('https://www.swapi.tech/api/planets/');
  }

  fetchAllPlanetsPaginated(url: string): void {
    this.http.get<any>(url).subscribe(response => {
      if (Array.isArray(response.results)) {
        this.allPlanets = [...this.allPlanets, ...response.results];
      }

      if (response.next) {
        this.fetchAllPlanetsPaginated(response.next);
      } else {
        this.updateDisplayedPlanets();
      }
    }, error => {
      console.error('Erreur lors de la récupération des planètes paginées:', error);
    });
  }

  updateDisplayedPlanets(): void {
    const filtered = this.allPlanets.filter(planet =>
      planet.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.displayedPlanets = this.showAll ? filtered : filtered.slice(0, 3);
  }

  onSearchChange(): void {
    this.updateDisplayedPlanets();
  }

  toggleShowAll(): void {
    this.showAll = true;
    this.updateDisplayedPlanets();
  }

  getPlanetId(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 2];
  }
}
