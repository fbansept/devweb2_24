import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [HttpClientModule, MatCardModule, MatButtonModule],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.scss',
})
export class AccueilComponent {
  http: HttpClient = inject(HttpClient);

  listeArticles: any = [];

  ngOnInit() {
    this.http
      .get('http://localhost/backend-angular/articles.php')
      .subscribe((resultat) => (this.listeArticles = resultat));
  }
}
