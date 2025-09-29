import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewModalsComponent } from './review-modals.component';

describe('ReviewModalsComponent', () => {
  let component: ReviewModalsComponent;
  let fixture: ComponentFixture<ReviewModalsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReviewModalsComponent]
    });
    fixture = TestBed.createComponent(ReviewModalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
