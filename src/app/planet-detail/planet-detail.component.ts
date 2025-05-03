import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

console.log('PlanetDetailComponent chargé');

@Component({
  selector: 'app-planet-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './planet-detail.component.html',
  styleUrls: ['./planet-detail.component.css']
})
export class PlanetDetailComponent implements OnInit {
  planet: any = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Paramètre ID reçu :', id);
    if (id) {
      this.http.get(`https://swapi.dev/api/planets/${id}/`).subscribe(data => {
        this.planet = data;
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/planets']);
  }
}
