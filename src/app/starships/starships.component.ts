import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-starships',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './starships.component.html',
  styleUrls: ['./starships.component.css']
})
export class StarshipsComponent implements OnInit {
  allStarships: any[] = [];
  displayedStarships: any[] = [];
  searchQuery: string = '';
  showAll: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.allStarships = [];
    this.fetchAllStarshipsPaginated('https://www.swapi.tech/api/starships/');
  }

  fetchAllStarshipsPaginated(url: string): void {
    this.http.get<any>(url).subscribe(response => {
      console.log('Réponse API starships page:', response);

      if (Array.isArray(response.results)) {
        // Ici, results contient des objets {uid, name, url} mais PAS les propriétés détaillées
        // On stocke simplement le résultat de cette page
        this.allStarships = [...this.allStarships, ...response.results];
      }

      if (response.next) {
        this.fetchAllStarshipsPaginated(response.next);
      } else {
        this.updateDisplayedStarships();
      }
    }, error => {
      console.error('Erreur lors de la récupération des starships paginés:', error);
    });
  }

  updateDisplayedStarships(): void {
    const filtered = this.allStarships.filter(ship =>
      ship.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.displayedStarships = this.showAll ? filtered : filtered.slice(0, 3);
  }

  onSearchChange(): void {
    this.updateDisplayedStarships();
  }

  toggleShowAll(): void {
    this.showAll = true;
    this.updateDisplayedStarships();
  }

  // Si besoin, récupérer l'id du starship depuis son URL
  getStarshipId(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1] === '' ? parts[parts.length - 2] : parts[parts.length - 1];
  }
}
