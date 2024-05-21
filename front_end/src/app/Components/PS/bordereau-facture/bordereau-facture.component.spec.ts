import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BordereauFactureComponent } from './bordereau-facture.component';

describe('BordereauFactureComponent', () => {
  let component: BordereauFactureComponent;
  let fixture: ComponentFixture<BordereauFactureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BordereauFactureComponent]
    });
    fixture = TestBed.createComponent(BordereauFactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
