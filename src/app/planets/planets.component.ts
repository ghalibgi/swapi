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
    this.fetchAllPlanets();
  }

  fetchAllPlanets(): void {
    const fetchPage = (url: string) => {
      const fullUrl = url.startsWith('http') ? url : `https://swapi.dev${url}`;
      this.http.get<any>(fullUrl).subscribe(response => {
        this.allPlanets = [...this.allPlanets, ...response.results];
        if (response.next) {
          fetchPage(response.next);
        } else {
          this.updateDisplayedPlanets();
        }
      });
    };

    fetchPage('https://swapi.dev/api/planets/');
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
