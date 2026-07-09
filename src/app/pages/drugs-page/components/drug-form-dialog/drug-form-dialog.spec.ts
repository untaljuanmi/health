import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugFormDialog } from './drug-form-dialog';

describe('DrugFormDialog', () => {
  let component: DrugFormDialog;
  let fixture: ComponentFixture<DrugFormDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrugFormDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(DrugFormDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
