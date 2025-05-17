import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent implements OnInit {
  vehicles: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.vehicles = [];
    this.fetchAllVehiclesPaginated('https://www.swapi.tech/api/vehicles/');
  }

  fetchAllVehiclesPaginated(url: string): void {
    this.http.get<any>(url).subscribe(response => {
      if (Array.isArray(response.results)) {
        this.vehicles = [...this.vehicles, ...response.results];
      }

      if (response.next) {
        this.fetchAllVehiclesPaginated(response.next);
      } else {
        // Ici tu peux faire une action à la fin si besoin
        console.log('Tous les véhicules chargés', this.vehicles);
      }
    }, error => {
      console.error('Erreur lors de la récupération des véhicules paginés:', error);
    });
  }
}
