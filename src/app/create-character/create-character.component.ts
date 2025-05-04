import { Component } from '@angular/core';
import { SwapiService } from '../swapi.service';  // Assure-toi d'importer le service SWAPI
import { CharacterService } from '../config/api.config';  // Assure-toi d'importer le service Gemini
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-character',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-character.component.html',
  styleUrls: ['./create-character.component.css'],
})
export class CreateCharacterComponent {
  character = {
    name: '',
    gender: 'male',
    species: '',
    language: '',
    height: null,
    eye_color: '',
    hair_color: '',
    homeworld: '',
  };

  isLoading = false;
  generatedStory: string = '';
  speciesList: any[] = [];
  languages = ['Basic', 'Huttese', 'Shyriiwook'];
  planets = ['Tatooine', 'Alderaan', 'Coruscant'];

  constructor(
    private swapiService: SwapiService,  // Service pour récupérer les données SWAPI
    private characterService: CharacterService // Service pour générer l'histoire avec Gemini
  ) {}

  ngOnInit(): void {
    this.loadSpecies();  // Charger les espèces lors de l'initialisation du composant
  }

  loadSpecies(): void {
    this.swapiService.getSpecies().subscribe(
      (species) => {
        this.speciesList = species;  // Récupérer les espèces depuis SWAPI
      },
      (error) => {
        console.error('Erreur lors du chargement des espèces', error);
      }
    );
  }

  generateCharacter() {
    this.isLoading = true;
    this.generatedStory = '';  // Réinitialiser l'histoire avant chaque nouvelle génération

    this.characterService.generateStory(this.character).subscribe(
      (response) => {
        this.generatedStory = response.generatedStory;  // La réponse de l'API Gemini contient l'histoire générée
        this.isLoading = false;
      },
      (error) => {
        console.error('Erreur lors de la génération de l\'histoire', error);
        this.isLoading = false;
      }
    );
  }
}
