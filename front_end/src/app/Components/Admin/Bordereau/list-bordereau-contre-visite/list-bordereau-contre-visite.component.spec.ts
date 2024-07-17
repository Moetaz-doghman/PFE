import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBordereauContreVisiteComponent } from './list-bordereau-contre-visite.component';

describe('ListBordereauContreVisiteComponent', () => {
  let component: ListBordereauContreVisiteComponent;
  let fixture: ComponentFixture<ListBordereauContreVisiteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListBordereauContreVisiteComponent]
    });
    fixture = TestBed.createComponent(ListBordereauContreVisiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
