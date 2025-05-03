import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-species',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './species.component.html',
  styleUrls: ['./species.component.css']
})
export class SpeciesComponent implements OnInit {
  species: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchAllSpecies();
  }

  fetchAllSpecies(): void {
    const fetchPage = (url: string) => {
      this.http.get<any>(url).subscribe(response => {
        const current = response.results;
        const withHomeworld = current.map((s: any) => {
          if (s.homeworld) {
            this.http.get<any>(s.homeworld).subscribe(homeworld => {
              s.homeworldName = homeworld.name;
            });
          } else {
            s.homeworldName = null;
          }
          return s;
        });

        this.species = [...this.species, ...withHomeworld];

        if (response.next) {
          fetchPage(response.next);
        }
      });
    };

    fetchPage('https://swapi.dev/api/species/');
  }
}
