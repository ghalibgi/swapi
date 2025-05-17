import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SwapiService } from '../swapi.service'; // adapte le chemin si besoin

@Component({
  selector: 'app-people',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {
  allPeople: any[] = [];
  displayedPeople: any[] = [];
  searchQuery: string = '';
  showAll: boolean = false;

  constructor(private swapiService: SwapiService) {}

  ngOnInit(): void {
    this.fetchAllPeople();
  }

  fetchAllPeople(): void {
    this.swapiService.getPeople().subscribe(response => {
      this.allPeople = response;
      this.updateDisplayedPeople();
    });
  }

  updateDisplayedPeople(): void {
    const filtered = this.allPeople.filter(person =>
      person.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.displayedPeople = this.showAll ? filtered : filtered.slice(0, 3);
  }

  onSearchChange(): void {
    this.updateDisplayedPeople();
  }

  toggleShowAll(): void {
    this.showAll = true;
    this.updateDisplayedPeople();
  }

  getPersonId(uid: string): string {
    return uid; // Swapi.tech renvoie directement l'ID dans `uid`
  }
}
