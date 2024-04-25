import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Article } from '../models/Article.type';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.scss',
})
export class AccueilComponent implements OnInit {
  http: HttpClient = inject(HttpClient);

  listeArticles: Article[] = [];

  ngOnInit() {
    this.refreshListeArticle();
  }

  refreshListeArticle() {
    this.http
      .get<Article[]>('http://localhost/backend-angular/articles.php')
      .subscribe((resultat) => (this.listeArticles = resultat));
  }

  onSuppressionArticle(idArticle?: number) {
    this.http
      .delete(
        'http://localhost/backend-angular/supprimer-article.php?id=' + idArticle
      )
      .subscribe((resultat) => this.refreshListeArticle());
  }
}
