import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { GEMINI_API_KEY } from '../config/api.config';

@Component({
  selector: 'app-create-character',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-character.component.html',
  styleUrls: ['./create-character.component.css']
})
export class CreateCharacterComponent implements OnInit {
  character = {
    name: '',
    gender: 'male',
    species: '',
    language: '',
    height: null,
    eye_color: '',
    hair_color: '',
    homeworld: ''
  };

  generatedStory: string | null = null;
  isLoading: boolean = false;

  planets: string[] = [];
  languages: string[] = [];
  speciesList: string[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchAllPlanets();
    this.fetchAllSpecies();
  }

  generateCharacter(): void {
    this.isLoading = true;
    this.generatedStory = null;

    this.generateStoryFromGemini(() => {
      this.isLoading = false;
    });
  }

  generateStoryFromGemini(callback: () => void): void {
    const prompt = `Crée une courte histoire dans l'univers Star Wars à propos de ce personnage :
Nom : ${this.character.name}
Espèce : ${this.character.species}
Genre : ${this.character.gender}
Langue : ${this.character.language}
Taille : ${this.character.height} cm
Cheveux : ${this.character.hair_color}
Yeux : ${this.character.eye_color}
Planète d'origine : ${this.character.homeworld}

Raconte-moi son rôle dans la galaxie avec style.`;

    const headers = {
      'Content-Type': 'application/json'
    };

    const body = {
      instances: [
        {
          messages: [
            {
              author: "user",
              content: prompt
            }
          ]
        }
      ],
      parameters: {
        temperature: 0.8,
        maxOutputTokens: 400
      }
    };

    const url = `https://generativelanguage.googleapis.com/v1/models/chat-bison-001:predict?key=${GEMINI_API_KEY}`;

    this.http.post(url, body, { headers }).subscribe({
      next: (res: any) => {
        console.log('Réponse Gemini:', res);
        this.generatedStory = res.predictions?.[0]?.candidates?.[0]?.content || 'Aucune histoire générée.';
        callback();
      },
      error: (err) => {
        console.error('Erreur Gemini:', JSON.stringify(err, null, 2));
        this.generatedStory = 'Erreur lors de la génération de l’histoire.';
        callback();
      }
    });
  }

  fetchAllPlanets(): void {
    const fetchPage = (url: string) => {
      this.http.get<any>(url).subscribe(res => {
        const names = res.results.map((p: any) => p.name);
        this.planets.push(...names);
        if (res.next) fetchPage(res.next);
      });
    };
    fetchPage('https://swapi.dev/api/planets/');
  }

  fetchAllSpecies(): void {
    const fetchPage = (url: string) => {
      this.http.get<any>(url).subscribe(res => {
        const speciesNames = res.results.map((s: any) => s.name);
        const speciesLanguages = res.results.map((s: any) => s.language).filter((l: string) => l);
        this.speciesList.push(...speciesNames);
        this.languages.push(...speciesLanguages);
        if (res.next) fetchPage(res.next);
      });
    };
    fetchPage('https://swapi.dev/api/species/');
  }
}
