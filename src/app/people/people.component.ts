import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchAllPeople();
  }

  fetchAllPeople(): void {
    const fetchPage = (url: string) => {
      const fullUrl = url.startsWith('http') ? url : `https://swapi.dev${url}`;
      this.http.get<any>(fullUrl).subscribe(response => {
        this.allPeople = [...this.allPeople, ...response.results];
        if (response.next) {
          fetchPage(response.next);
        } else {
          this.updateDisplayedPeople();
        }
      });
    };

    fetchPage('https://swapi.dev/api/people/');
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

  getPersonId(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 2];
  }
}
