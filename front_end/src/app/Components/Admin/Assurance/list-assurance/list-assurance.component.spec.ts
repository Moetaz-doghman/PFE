import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAssuranceComponent } from './list-assurance.component';

describe('ListAssuranceComponent', () => {
  let component: ListAssuranceComponent;
  let fixture: ComponentFixture<ListAssuranceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListAssuranceComponent]
    });
    fixture = TestBed.createComponent(ListAssuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
