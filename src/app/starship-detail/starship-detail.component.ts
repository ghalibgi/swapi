import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-starship-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './starship-detail.component.html',
  styleUrls: ['./starship-detail.component.css']
})
export class StarshipDetailComponent implements OnInit {
  starship: any = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.http.get<any>(`https://www.swapi.tech/api/starships/${id}/`).subscribe(data => {
        // Les détails sont dans data.result.properties
        this.starship = data.result.properties;
      }, error => {
        console.error('Erreur lors de la récupération du détail du vaisseau:', error);
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/starships']);
  }
}
