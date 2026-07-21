import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyContainer } from './empty-container';

describe('EmptyContainer', () => {
  let component: EmptyContainer;
  let fixture: ComponentFixture<EmptyContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
