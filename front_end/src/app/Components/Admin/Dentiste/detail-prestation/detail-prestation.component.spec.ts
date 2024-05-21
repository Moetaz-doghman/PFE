import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPrestationComponent } from './detail-prestation.component';

describe('DetailPrestationComponent', () => {
  let component: DetailPrestationComponent;
  let fixture: ComponentFixture<DetailPrestationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailPrestationComponent]
    });
    fixture = TestBed.createComponent(DetailPrestationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
