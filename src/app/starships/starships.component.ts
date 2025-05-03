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
    this.fetchAllStarships();
  }

  fetchAllStarships(): void {
    const fetchPage = (url: string) => {
      const fullUrl = url.startsWith('http') ? url : `https://swapi.dev${url}`;

      this.http.get<any>(fullUrl).subscribe(response => {
        this.allStarships = [...this.allStarships, ...response.results];

        if (response.next) {
          fetchPage(response.next);
        } else {
          this.updateDisplayedStarships();
        }
      });
    };

    fetchPage('https://swapi.dev/api/starships/');
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

  getStarshipId(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 2]; // ex: https://swapi.dev/api/starships/9/ → "9"
  }
}
