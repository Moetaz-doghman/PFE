import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Nomenclature } from 'src/app/Models/Nomenclature';
import { ActeDentaire } from 'src/app/Models/Prestation';
import { ActeDentaireService } from 'src/app/Services/acte-dentaire.service';
import { NomenclatureService } from 'src/app/Services/nomenclature.service';

@Component({
  selector: 'app-update-nomenclature',
  templateUrl: './update-nomenclature.component.html',
  styleUrls: ['./update-nomenclature.component.css']
})
export class UpdateNomenclatureComponent implements OnInit {
  nomenclatureForm: FormGroup;
  acteDentaires: ActeDentaire[] = [];
  nomenclatureId: number;

  constructor(
    private fb: FormBuilder,
    private nomenclatureService: NomenclatureService,
    private acteDentaireService: ActeDentaireService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.nomenclatureId = this.route.snapshot.params['id'];

    this.nomenclatureForm = this.fb.group({
      codeActe: ['', [Validators.required, Validators.minLength(2)]],
      cotation: ['', Validators.required],
      avisMedical: ['', Validators.required],
      acteDentaire: ['', Validators.required]
    });

    this.loadNomenclature();
    this.loadActeDentaires();
  }

  loadNomenclature(): void {
    this.nomenclatureService.getNomenclatureById(this.nomenclatureId).subscribe(
      (nomenclature: Nomenclature) => {
        if (nomenclature && nomenclature.acteDentaire) {
          this.nomenclatureForm.patchValue({
            codeActe: nomenclature.codeActe,
            cotation: nomenclature.cotation,
            avisMedical: nomenclature.avisMedical,
            acteDentaire: nomenclature.acteDentaire.id
          });
        } else {
          console.error('Nomenclature ou acte dentaire introuvable');
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération de la nomenclature :', error);
      }
    );
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


      this.nomenclatureService.updateNomenclature(this.nomenclatureId, formattedData).subscribe(
        (nomenclature) => {
          console.log('Nomenclature mise à jour avec succès :', nomenclature);
          this.router.navigate(['menu/admin/listNomenclature']);
        },
        (error) => {
          console.error('Erreur lors de la mise à jour de la nomenclature :', error);
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
