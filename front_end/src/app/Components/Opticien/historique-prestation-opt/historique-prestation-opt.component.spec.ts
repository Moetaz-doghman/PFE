import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriquePrestationOptComponent } from './historique-prestation-opt.component';

describe('HistoriquePrestationOptComponent', () => {
  let component: HistoriquePrestationOptComponent;
  let fixture: ComponentFixture<HistoriquePrestationOptComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoriquePrestationOptComponent]
    });
    fixture = TestBed.createComponent(HistoriquePrestationOptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
