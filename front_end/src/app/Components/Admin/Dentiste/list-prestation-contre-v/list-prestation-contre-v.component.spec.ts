import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPrestationContreVComponent } from './list-prestation-contre-v.component';

describe('ListPrestationContreVComponent', () => {
  let component: ListPrestationContreVComponent;
  let fixture: ComponentFixture<ListPrestationContreVComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListPrestationContreVComponent]
    });
    fixture = TestBed.createComponent(ListPrestationContreVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
