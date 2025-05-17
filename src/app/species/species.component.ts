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
    this.species = [];
    this.fetchAllSpeciesPaginated('https://www.swapi.tech/api/species/');
  }

  fetchAllSpeciesPaginated(url: string): void {
    this.http.get<any>(url).subscribe(response => {
      if (Array.isArray(response.results)) {
        // On ajoute les espèces basiques à la liste (avec url, uid, name)
        this.species = [...this.species, ...response.results];
      }

      if (response.next) {
        this.fetchAllSpeciesPaginated(response.next);
      } else {
        // Quand toutes les pages sont chargées, on récupère les homeworlds
        this.loadHomeworldsForSpecies();
      }
    }, error => {
      console.error('Erreur lors de la récupération des espèces paginées:', error);
    });
  }

  loadHomeworldsForSpecies(): void {
    // Pour chaque espèce, on récupère ses détails pour obtenir le champ homeworld
    const promises = this.species.map(sp =>
      this.http.get<any>(sp.url).toPromise()
    );

    Promise.all(promises).then(results => {
      // Met à jour chaque espèce avec homeworldName récupéré si homeworld existe
      this.species = results.map(res => {
        const properties = res.result.properties;
        const sp = {
          uid: res.result.uid,
          name: properties.name,
          classification: properties.classification,
          designation: properties.designation,
          homeworldName: null
        };

        if (properties.homeworld) {
          // Récupérer le nom de la planète homeworld
          // Attention : c'est asynchrone, on va faire un appel pour chaque homeworld
          this.http.get<any>(properties.homeworld).subscribe(hw => {
            sp.homeworldName = hw.result.properties.name;
          });
        }

        return sp;
      });
    }).catch(error => {
      console.error('Erreur lors du chargement des détails des espèces:', error);
    });
  }
}
