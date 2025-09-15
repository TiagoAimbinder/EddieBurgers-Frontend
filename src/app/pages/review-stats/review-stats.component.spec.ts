import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewStatsComponent } from './review-stats.component';

describe('ReviewStatsComponent', () => {
  let component: ReviewStatsComponent;
  let fixture: ComponentFixture<ReviewStatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReviewStatsComponent]
    });
    fixture = TestBed.createComponent(ReviewStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
