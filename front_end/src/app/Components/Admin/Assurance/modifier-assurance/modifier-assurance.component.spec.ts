import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierAssuranceComponent } from './modifier-assurance.component';

describe('ModifierAssuranceComponent', () => {
  let component: ModifierAssuranceComponent;
  let fixture: ComponentFixture<ModifierAssuranceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModifierAssuranceComponent]
    });
    fixture = TestBed.createComponent(ModifierAssuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
