import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterBeneficiaireComponent } from './ajouter-beneficiaire.component';

describe('AjouterBeneficiaireComponent', () => {
  let component: AjouterBeneficiaireComponent;
  let fixture: ComponentFixture<AjouterBeneficiaireComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AjouterBeneficiaireComponent]
    });
    fixture = TestBed.createComponent(AjouterBeneficiaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
