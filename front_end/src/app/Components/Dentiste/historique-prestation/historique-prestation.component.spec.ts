import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriquePrestationComponent } from './historique-prestation.component';

describe('HistoriquePrestationComponent', () => {
  let component: HistoriquePrestationComponent;
  let fixture: ComponentFixture<HistoriquePrestationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoriquePrestationComponent]
    });
    fixture = TestBed.createComponent(HistoriquePrestationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
