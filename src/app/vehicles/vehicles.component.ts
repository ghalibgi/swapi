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
    this.fetchAllVehicles();
  }

  fetchAllVehicles(): void {
    const fetchPage = (url: string) => {
      this.http.get<any>(url).subscribe(response => {
        this.vehicles = [...this.vehicles, ...response.results];

        if (response.next) {
          fetchPage(response.next);
        }
      });
    };

    fetchPage('https://swapi.dev/api/vehicles/');
  }
}
