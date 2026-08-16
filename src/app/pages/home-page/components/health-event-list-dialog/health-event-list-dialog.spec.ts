import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthEventListDialog } from './health-event-list-dialog';

describe('HealthEventListDialog', () => {
  let component: HealthEventListDialog;
  let fixture: ComponentFixture<HealthEventListDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthEventListDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(HealthEventListDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
