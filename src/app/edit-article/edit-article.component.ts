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

  //identifiant de l'article (null si on en ajout)
  id: number | null = null;

  //url de l'image sur la base de donnée
  urlImage: string | null = null;

  //passé à vrai lorsqu'une image existe sur la bdd, mais que l'utilisateur veurt la supprimer
  imageSupprime: boolean = false;

  //miniature du fichier qui vient d'etre selectionné
  miniature: string | null = null;

  ngOnInit() {
    this.route.params.subscribe((parametresUrl) => {
      //si le paramètre id existe dans l'URL
      if (parametresUrl['id']) {
        //si le parametre est un nombre
        if (!isNaN(parametresUrl['id'])) {
          this.id = parametresUrl['id'];

          this.http
            .get<Article>(
              //'http://localhost/backend-angular/article.php?id=' + id
              `http://localhost/backend-angular/article.php?id=${this.id}`
            )
            .subscribe((article) => {
              this.formulaire.patchValue(article);
              this.urlImage = article.image;
            });
        } else {
          alert(parametresUrl['id'] + " n'est pas un identifant valide");
        }
      }
    });
  }

  onSubmit() {
    if (this.formulaire.valid) {
      const donnees: FormData = new FormData();

      const article = this.formulaire.value;
      article.imageSupprime = this.imageSupprime;

      donnees.append('article', JSON.stringify(article));

      if (this.fichierSelectionne) {
        donnees.append('image', this.fichierSelectionne);
      }

      const url =
        this.id == null
          ? 'http://localhost/backend-angular/ajout-article.php'
          : `http://localhost/backend-angular/modifier-article.php?id=${this.id}`;

      this.http.post(url, donnees).subscribe({
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
    this.urlImage = null;
    //on affecte la valeur null a l'input afin qu'un evenement (change) soit de nouveau lancé
    //meme si il s'agit du meme fichier (dans le cas ou l'on aurait cliqué sur le bouton supprimé)
    evenement.target.value = null;

    //on recupere le fichier, on le tranforme en url puis on l'affecte à "miniature"
    if (this.fichierSelectionne != null) {
      let reader = new FileReader();

      reader.onload = (e: any) => {
        this.miniature = e.target.result;
      };
      reader.readAsDataURL(this.fichierSelectionne);
    }
  }

  onSuppressionImage() {
    if (this.urlImage != null) {
      this.imageSupprime = true;
    }

    this.urlImage = null;
    this.fichierSelectionne = null;
    this.miniature = null;
  }
}
