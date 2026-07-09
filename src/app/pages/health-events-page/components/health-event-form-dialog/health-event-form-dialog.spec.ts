import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthEventFormDialog } from './health-event-form-dialog';

describe('HealthEventFormDialog', () => {
  let component: HealthEventFormDialog;
  let fixture: ComponentFixture<HealthEventFormDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthEventFormDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(HealthEventFormDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
