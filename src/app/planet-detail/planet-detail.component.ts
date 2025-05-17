import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-planet-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './planet-detail.component.html',
  styleUrls: ['./planet-detail.component.css']
})
export class PlanetDetailComponent implements OnInit {
  planet: any = null;
  loading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    console.log('Paramètre ID reçu :', idParam);

    if (!idParam) {
      this.errorMessage = 'ID de planète manquant dans l’URL.';
      return;
    }

    // Extraire l'ID numérique si jamais c'est une URL complète
    const id = this.extractId(idParam);

    if (!id.match(/^\d+$/)) {
      this.errorMessage = 'ID de planète invalide.';
      return;
    }

    this.loading = true;
    this.http.get<any>(`https://www.swapi.tech/api/planets/${id}/`).subscribe({
      next: data => {
        if (data?.result?.properties) {
          this.planet = data.result.properties;
          this.errorMessage = '';
        } else {
          this.errorMessage = 'Données de la planète non trouvées.';
        }
        this.loading = false;
      },
      error: err => {
        this.errorMessage = `Erreur lors de la récupération : ${err.message || err.statusText}`;
        this.loading = false;
        console.error(this.errorMessage);
      }
    });
  }

  extractId(param: string): string {
    if (param.startsWith('http')) {
      const parts = param.split('/');
      return parts[parts.length - 1] === '' ? parts[parts.length - 2] : parts[parts.length - 1];
    }
    return param;
  }

  goBack(): void {
    this.router.navigate(['/planets']);
  }
}
