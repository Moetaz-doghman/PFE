import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContreVisiteDentisteComponent } from './contre-visite-dentiste.component';

describe('ContreVisiteDentisteComponent', () => {
  let component: ContreVisiteDentisteComponent;
  let fixture: ComponentFixture<ContreVisiteDentisteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContreVisiteDentisteComponent]
    });
    fixture = TestBed.createComponent(ContreVisiteDentisteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
