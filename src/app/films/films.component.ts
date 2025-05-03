import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-films',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './films.component.html',
  styleUrls: ['./films.component.css']
})
export class FilmsComponent implements OnInit {
  films: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>('https://swapi.dev/api/films/').subscribe(response => {
      this.films = response.results.sort((a: any, b: any) => a.episode_id - b.episode_id);
    });
  }

  getFilmId(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 2];
  }
}
