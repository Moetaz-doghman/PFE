import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActeDentaire } from 'src/app/Models/Prestation';
import { ActeDentaireService } from 'src/app/Services/acte-dentaire.service';
import { NomenclatureService } from 'src/app/Services/nomenclature.service';

@Component({
  selector: 'app-add-nomenclature',
  templateUrl: './add-nomenclature.component.html',
  styleUrls: ['./add-nomenclature.component.css']
})
export class AddNomenclatureComponent  implements OnInit {
  acteDentaires: ActeDentaire[] = [];
  nomenclatureForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private nomenclatureService: NomenclatureService,
    private router: Router,
    private acteDentaireService: ActeDentaireService
  ) {}

  ngOnInit(): void {
    this.nomenclatureForm = this.fb.group({
      codeActe: ['', [Validators.required, Validators.minLength(2)]],
      cotation: ['', Validators.required],
      avisMedical: ['', Validators.required],
      acteDentaire: ['', Validators.required]
    });

    this.loadActeDentaires();
  }

  loadActeDentaires(): void {
    this.acteDentaireService.getAllActeDentaires().subscribe(
      (acteDentaires: ActeDentaire[]) => {
        this.acteDentaires = acteDentaires;
      },
      (error) => {
        console.error('Erreur lors de la récupération des actes dentaires :', error);
      }
    );
  }

  onSubmit(): void {
    if (this.nomenclatureForm.valid) {
      const nomenclatureData = this.nomenclatureForm.value;
      const acteDentaireId = nomenclatureData.acteDentaire;
      const formattedData = {
        ...nomenclatureData,
        acteDentaire: { id: acteDentaireId }
      };
      console.log(formattedData);
      this.nomenclatureService.createNomenclature(formattedData).subscribe(
        (nomenclature) => {
          console.log('Nomenclature ajoutée avec succès :', nomenclature);
          this.router.navigate(['/menu/admin/listNomenclature']);
        },
        (error) => {
          console.error('Erreur lors de l\'ajout de la nomenclature :', error);
        }
      );
    } else {
      this.nomenclatureForm.markAllAsTouched();
    }
  }

  onReset(): void {
    this.nomenclatureForm.reset();
  }

  goBack(): void {
    window.history.back();
  }
}
