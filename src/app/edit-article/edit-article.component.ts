import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { Article } from '../models/Article.type';

@Component({
  selector: 'app-edit-article',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatIconModule,
  ],
  templateUrl: './edit-article.component.html',
  styleUrl: './edit-article.component.scss',
})
export class EditArticleComponent {
  fichierSelectionne: File | null = null;

  prixMinimum: number = 0.01;

  http: HttpClient = inject(HttpClient);
  formBuilder: FormBuilder = inject(FormBuilder);
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);

  formulaire: FormGroup = this.formBuilder.group({
    nom: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
    ],
    description: ['', []],
    prix: [1, [Validators.required, Validators.min(this.prixMinimum)]],
  });

  ngOnInit() {
    this.route.params.subscribe((parametresUrl) => {
      //si le paramètre id existe dans l'URL
      if (parametresUrl['id']) {
        //si le parametre est un nombre
        if (!isNaN(parametresUrl['id'])) {
          const id: number = parametresUrl['id'];

          this.http
            .get<Article>(
              //'http://localhost/backend-angular/article.php?id=' + id
              `http://localhost/backend-angular/article.php?id=${id}`
            )
            .subscribe((article) => this.formulaire.patchValue(article));

        } else {
          alert(parametresUrl['id'] + " n'est pas un identifant valide");
        }
      }
    });
  }

  onSubmit() {
    if (this.formulaire.valid) {
      const donnees: FormData = new FormData();

      donnees.append('article', JSON.stringify(this.formulaire.value));

      if (this.fichierSelectionne) {
        donnees.append('image', this.fichierSelectionne);
      }

      this.http
        .post('http://localhost/backend-angular/ajout-article.php', donnees)
        .subscribe({
          next: (resultat) => this.router.navigateByUrl('/accueil'),
          error: (resultat) =>
            alert(
              resultat.error.message
                ? resultat.error.message
                : 'Erreur inconnue, contactez votre administrateur'
            ),
        });
    }
  }

  onFichierSelectionne(evenement: any) {
    this.fichierSelectionne = evenement.target.files[0];
  }
}
