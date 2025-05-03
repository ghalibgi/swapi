import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterModule],  // Import du module Router dans le composant

})
export class AppComponent {
  title = 'starwars';

  constructor(private router: Router) {}

  playSoundAndNavigate() {
  
    const audio = new Audio('/starwars.mp3');
    audio.play().then(() => {
    
      this.router.navigate(['/aboutus']);
    }).catch(err => {
      console.error("Erreur de lecture audio :", err);
      this.router.navigate(['/aboutus']);
    });
  }
}
