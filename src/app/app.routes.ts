import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent)
  },
  {
    path: 'people',
    loadComponent: () =>
      import('./people/people.component').then((m) => m.PeopleComponent)
  },
  {
    path: 'planets',
    loadComponent: () =>
      import('./planets/planets.component').then((m) => m.PlanetsComponent)
  },
  {
    path: 'films',
    loadComponent: () =>
      import('./films/films.component').then((m) => m.FilmsComponent)
  },
  {
    path: 'vehicles',
    loadComponent: () =>
      import('./vehicles/vehicles.component').then((m) => m.VehiclesComponent)
  },
  {
    path: 'starships',
    loadComponent: () =>
      import('./starships/starships.component').then((m) => m.StarshipsComponent)
  },
  {
    path: 'starships/:id',
    loadComponent: () =>
      import('./starship-detail/starship-detail.component').then((m) => m.StarshipDetailComponent)
  },
  {
    path: 'species',
    loadComponent: () =>
      import('./species/species.component').then((m) => m.SpeciesComponent)
  },
  {
    path: 'planets/:id',
    loadComponent: () =>
      import('./planet-detail/planet-detail.component').then((m) => m.PlanetDetailComponent)
  },
  {
    path: 'people/:id',
    loadComponent: () =>
      import('./people-detail/people-detail.component').then((m) => m.PeopleDetailComponent)
  },
  {path:'aboutus',
  loadComponent: () =>
  import('./aboutus/aboutus.component').then((m) => m.AboutusComponent)

  }  


  
];
