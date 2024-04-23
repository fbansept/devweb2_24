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
import { MatInputModule } from '@angular/material/input';

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
  ],
  templateUrl: './edit-article.component.html',
  styleUrl: './edit-article.component.scss',
})
export class EditArticleComponent {
  prixMinimum: number = 0.01;

  http: HttpClient = inject(HttpClient);
  formBuilder: FormBuilder = inject(FormBuilder);

  formulaire: FormGroup = this.formBuilder.group({
    nom: [
      'toto',
      [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
    ],
    description: ['', []],
    prix: [1, [Validators.required, Validators.min(this.prixMinimum)]],
  });

  onSubmit() {
    if (this.formulaire.valid) {
      this.http
        .post(
          'http://localhost/backend-angular/ajout-article.php',
          this.formulaire.value
        )
        .subscribe({
          next: (resultat) => console.log(resultat),
          error: (resultat) =>
            alert(
              resultat.error.message
                ? resultat.error.message
                : 'Erreur inconnue, contactez votre administrateur'
            ),
        });
    }
  }
}
