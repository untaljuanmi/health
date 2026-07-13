import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chronology } from './chronology';

describe('Chronology', () => {
  let component: Chronology;
  let fixture: ComponentFixture<Chronology>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chronology],
    }).compileComponents();

    fixture = TestBed.createComponent(Chronology);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
