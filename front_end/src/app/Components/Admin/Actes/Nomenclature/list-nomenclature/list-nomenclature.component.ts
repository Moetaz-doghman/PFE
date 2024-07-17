import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Nomenclature } from 'src/app/Models/Nomenclature';
import { NomenclatureService } from 'src/app/Services/nomenclature.service';

@Component({
  selector: 'app-list-nomenclature',
  templateUrl: './list-nomenclature.component.html',
  styleUrls: ['./list-nomenclature.component.css']
})
export class ListNomenclatureComponent implements OnInit {
  nomenclatures: Nomenclature[] = [];
  selectedNomenclature: Nomenclature | null = null;

  constructor(
    private nomenclatureService: NomenclatureService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadNomenclatures();
  }

    

  loadNomenclatures(): void {
    this.nomenclatureService.getAllNomenclatures().subscribe(
      (data: Nomenclature[]) => {
        this.nomenclatures = data;
        console.log(data);
      },
      (error: any) => {
        console.log('Error fetching nomenclatures:', error);
      }
    );
  }

  confirmDelete(nomenclature: Nomenclature): void {
    this.selectedNomenclature = nomenclature;
  }

  deleteNomenclature(): void {
    if (this.selectedNomenclature) {
      this.nomenclatureService
        .deleteNomenclature(this.selectedNomenclature.id)
        .subscribe(
          () => {
            this.loadNomenclatures();
          },
          (error: any) => {
            console.log('Error deleting nomenclature:', error);
          }
        );
    }
  }

  updateNomenclatureDetails(id: number): void {
    this.router.navigate(['menu/admin/modifierNomenclature', id]);
  }

  addNomenclature(): void {
    this.router.navigate(['menu/admin/nomenclature/add']);
  }
}
