import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonsModalComponent } from './persons-modal.component';

describe('PersonsModalComponent', () => {
  let component: PersonsModalComponent;
  let fixture: ComponentFixture<PersonsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonsModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
